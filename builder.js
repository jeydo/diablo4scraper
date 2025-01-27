class Builder {
	constructor(name) {
		this.id = Math.random() * 100000;
		this.name = name;
		this.affixes = [];
		this.uniques = [];
	}

	setNewItem(itemType, affixes) {
		let name = itemType
		const search = this.affixes.find(item => item.name == name)
		if (search) {
			name = name + ' 2'
		}
		const item = {
			id: Math.random() * 100000,
        	name : name,
        	itemType : itemType.toLowerCase().replace(/^([0-9]h?)/g, '').trim().split(','),
        	minPower : 750,
        	affixPools : this.setItemAffixes(affixes),
        	minAffixCount : 2,
        	minGreaterAffixCount : null
    	};
    	return item;
	}

	setItemAffixes(affixes) {
		const affixPools = [];
		for (const affix of affixes) {
	    	affixPools.push({
	    		id: Math.random() * 100000,
	            affix: this.cleanText(affix),
	            value: ''	
	    	})
	    }
	    return affixPools;
	}

	setBuildItems(items) {
		for (const item of items) {
			const newItem = this.setNewItem(item.itemType, item.affixes);
			this.affixes.push(newItem);
		}
	}

	setNewUnique(unique) {
		return {
			id : Math.random() * 100000,
			unique: unique.toLowerCase().replace(/[ ]{1,}/g, '_').replace(/'/g, ''),
	        value: '',
	        minPower : 750,
	        affixPools: []
		};
	}

	setBuildUniques(uniques) {
		for (const unique of uniques) {
			this.uniques.push(this.setNewUnique(unique));
		}
	}

	buildObject(data) {
		this.setBuildItems(data.affixes);
		this.setBuildUniques(data.uniques);
	}

	exportBuild() {
		return JSON.stringify(this);
	}

	cleanText(text) {
		return text
			.replace(/[0-9,\.\[\]%+:\-]/g, '')
			.toLowerCase()
			.replace(/^ranks to/, 'to')
			.replace(/ \([^ ]+ only\)/, '')
			.replace(/^lucky hit chance to/i, 'lucky hit up to a chance to')
			.replace(/ \(spiritborn only\)/, '')
			.replace(/^ranks (?!of)/, 'to ')
			.trim().replace(/[ ]{1,}/g, '_');
	}
}

module.exports = Builder;
