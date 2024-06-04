const puppeteer = require('puppeteer')
const itemTypeMatcher = require('./itemtype.js')

const scrapeMaxroll = async(url) => {
	const browser = await puppeteer.launch({
	    headless: true
	});

	const page = await browser.newPage();

	await page.goto(url);

	try {
		const cookiesPopup = await page.waitForSelector('.ncmp__btn:last-child');
		await cookiesPopup.click();
	} catch (e) {
		console.log('No cookies popup')
	}
	//await new Promise(r => setTimeout(r, 200));

	const data = await page.evaluate(async() => {
		let data = {
			name : document.querySelector('title').textContent.replace(/ - .*/, ''),
			affixes : [],
			uniques : []
		};
		const slots = document.querySelectorAll('.d4t-PlannerPaperdoll .d4t-slot');
		for (const slot of slots) {
				await slot.click();
				let activeItem = document.querySelector('.d4t-item-list .d4t-active');
				if (activeItem == null) {
					continue;
				}
				if (document.querySelector('.d4t-item-options').textContent.startsWith('Unique')) {
					data.uniques.push(document.querySelector('.d4t-header-title').textContent);
					continue;
				}
				const itemType = activeItem.closest('.d4t-expanded').querySelector('.d4t-category-header').textContent;
							
				const obj = { itemType : itemType, affixes : [] };
				
				const affixesContainer = document.querySelector('.d4t-affix-category:not(.d4t-category-implicit)');
				const affixes = affixesContainer.querySelectorAll('.d4t-property');
				for (const affix of affixes) {
					obj.affixes.push(
						affix.textContent
					);
				}
				data.affixes.push(obj)

		}
		return data;
		
	})
	console.log(data.name)
	await browser.close();
	return data;
}

const scrapeD4builds = async(url) => {
	const browser = await puppeteer.launch({
	    headless: true
	});

	const page = await browser.newPage();

	await page.goto(url);

	const cookiesPopup = await page.waitForSelector('.fc-cta-consent');
	await cookiesPopup.click();

	const adVideo = await page.waitForSelector('.bolt-close-button')
	await adVideo.click()

	await page.waitForSelector('.builder__gear__icon');
	const title = await page.$eval('input.builder__header__input', ({ value }) => value)

	const charClass = await page.$eval('.builder__header__icon', el => el.getAttribute('alt').replace('Diablo 4 ', ''))
	console.log(charClass)
	console.log(title)

	const data = {
		name : title,
		affixes : [],
		uniques : []
	};
	const slots = await page.$$('.builder__gear__items .builder__gear__item:not(.disabled)')
	for (slot of slots) {
		const elementItemType = await slot.$('.builder__gear__slot')
		
		let itemType = await elementItemType.evaluate(el => el.textContent)

		if (itemType == 'Empty') continue

		const imgHover = await slot.$('.builder__gear__icon')
		if (!imgHover) continue
		await imgHover.hover()

		const itemData = await page.evaluate(() => {
			const data = { itemType : null, affixes : [], unique : null }
			const implicit = document.querySelector('.codex__tooltip__stat.implicit')
			if (implicit) {
				const itemType = implicit.textContent
				if (itemType.indexOf(':') !== -1) {
					data.itemType = itemType.replace(/:.*/g, '') 
				}
			}

			const unique = document.querySelector('.unique__tooltip__name')
			if (unique) {
				data.unique = unique.textContent
				return data
			}

			data.affixes = [...document.querySelectorAll('.codex__tooltip__stats:not(.codex__tooltip__stats--tempering) .codex__tooltip__stat:not(.implicit)')].map(node => node.textContent.replace('Max Life', 'Maximum Life'));
			return data
		})
		
		if (itemData.unique) {
			data.uniques.push(itemData.unique)
			continue
		}
		const currentItemType = itemData.itemType ?? itemType
		data.affixes.push({
			itemType : itemTypeMatcher.matcherFn(currentItemType, charClass, itemTypeMatcher.d4builds),//itemTypeMatcher.d4builds.weapon[currentItemType] ?? (itemTypeMatcher.d4builds[charClass][currentItemType] ?? currentItemType),
			affixes : itemData.affixes
		})
	}

	await browser.close();
	return data;
}

const scrapeMobalytics = async(url) => {
	const browser = await puppeteer.launch({
	    headless: true
	});

	const page = await browser.newPage();
	await page.goto(url);
	//const buttonPrivacy = await page.waitForSelector('.qc-cmp2-summary-buttons button:last-child')
	//await buttonPrivacy.evaluate(b => b.click());
	
	const gearStats = await page.waitForSelector('::-p-xpath(//div[contains(text(), "Gear Stats")])')
	await gearStats.click()
	
	const data = {
		name : '',
		affixes : [],
		uniques : []
	};
	
	data.name = await page.$eval('title', el => el.textContent.replace(/ - Diablo 4 .* Build Guide/, ''))

	const charClass = await page.$eval('.m-a53mf3', el => el.textContent.replace(/(Diablo 4 | Build)/g, ''))
	
	console.log(data.name)
	console.log(charClass)

	const dataBuilt = await page.evaluate(() => {
		const data = { affixes : [], uniques : [] }
		const slots = document.querySelectorAll('.m-4tf4x5 .m-vg1xh6')
		for (const slot of slots) {
			const item = { itemType : null, affixes : [] }

			item.itemType = slot.querySelector('.m-1vrrnd3').textContent

			let affixes = [...slot.querySelectorAll('.m-9l2af6 li.m-qodgh2')]

			//check if it's a unique
			const aspect = slot.querySelector('.m-ndz0o2')?.textContent

			if (aspect && !aspect.includes('Aspect')) {
				data.uniques.push(aspect)
				continue
			}

			if (affixes.length <= 0) continue
			affixes = affixes.filter(el => {
				const img = el.querySelector('img')
				return img && !img.src.includes('Tempreing.svg')
			})
			//.filter(el => !el.textContent.includes('Implicit'))
			.map(el => el.textContent)
			
			if (affixes[0].includes('Implicit')) {
				if (affixes[0].includes(':')) {
					item.itemType = affixes[0].replace(/:.*/g, '')
				}	
				affixes = affixes.slice(1)
			}
			item.affixes = affixes

			data.affixes.push(item)
		}

		return data;
	});

	data.affixes = dataBuilt.affixes.map(el => {
		el.itemType = itemTypeMatcher.matcherFn(el.itemType, charClass, itemTypeMatcher.mobalytics)
		return el
	})
	data.uniques = dataBuilt.uniques
	
	await browser.close();
	return data;
}

module.exports.scrapeMaxroll = scrapeMaxroll;
module.exports.scrapeD4builds = scrapeD4builds;
module.exports.scrapeMobalytics = scrapeMobalytics;

