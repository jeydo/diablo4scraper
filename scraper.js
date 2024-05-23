const puppeteer = require('puppeteer')

const scrapeMaxroll = async(url) => {
	const browser = await puppeteer.launch({
	    headless: true
	});

	const page = await browser.newPage();

	await page.goto(url);

	const cookiesPopup = await page.waitForSelector('.ncmp__btn:last-child');
	await cookiesPopup.click();
	await new Promise(r => setTimeout(r, 200));

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

	
	const data = {
		name : title,
		affixes : [],
		uniques : []
	};
	const slots = await page.$$('.builder__gear__items .builder__gear__item:not(.disabled)')
	for (slot of slots) {
		const elementItemType = await slot.$('.builder__gear__slot')
		
		let itemType = await elementItemType.evaluate(el => el.textContent)

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

			data.affixes = [...document.querySelectorAll('.codex__tooltip__stats:not(.codex__tooltip__stats--tempering) .codex__tooltip__stat:not(.implicit)')].map(node => node.textContent);
			return data
		})
		
		if (itemData.unique) {
			data.uniques.push(itemData.unique)
			continue
		}
		data.affixes.push({
			itemType : itemData.itemType ? itemData.itemType : itemType,
			affixes : itemData.affixes
		})
	}

	await browser.close();
	return data;
}

module.exports.scrapeMaxroll = scrapeMaxroll;
module.exports.scrapeD4builds = scrapeD4builds;

