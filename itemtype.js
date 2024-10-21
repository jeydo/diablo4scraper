const d4builds = {
	weapon : {
		'2h Mace' : 'two-handed mace',
		'1h Mace' : 'mace',
		'2h Sword' : 'two-handed sword',
		'1h Sword' : 'sword',
		'2h Axe' : 'two-handed axe',
		'1h Axe' : 'axe',
		'2h Scythe' : 'two-handed scythe',
		'1h Scythe' : 'scythe'
	},
	Barbarian : {
		'Bludgeoning Weapon' : 'two-handed mace',
		'Slashing Weapon' : 'two-handed axe,two-handed sword',
		'Dual-Wield Weapon 1' : 'sword,mace,axe',
		'Dual-Wield Weapon 2' : 'sword,mace,axe',
	},
	Rogue : {
		'Ranged Weapon' : 'crossbow,bow',
		'Dual-Wield Weapon 1' : 'sword,dagger',
		'Dual-Wield Weapon 2' : 'sword,dagger',
	},
	Necromancer : {
		'Offhand' : 'focus,shield',
		'Weapon' : 'sword,scythe,two-handed sword,two-handed scythe,wand,staff'
	},
	Druid : {
		'Offhand' : 'totem',
		'Weapon' : 'axe,mace,two-handed mace,two-handed axe'
	},
	Sorcerer : {
		'Offhand' : 'focus,tome',
		'Weapon' : 'dagger,wand,staff'
	},
	Spiritborn : {

	}
}
const mobalytics = {
	weapon : {
		'2h Mace' : 'two-handed mace',
		'1h Mace' : 'mace',
		'2h Sword' : 'two-handed sword',
		'1h Sword' : 'sword',
		'2h Axe' : 'two-handed axe',
		'1h Axe' : 'axe',
		'2h Scythe' : 'two-handed scythe',
		'1h Scythe' : 'scythe'
	},
	Barbarian : {
		'Bludgeoning Weapon' : 'two-handed mace',
		'Slashing Weapon' : 'two-handed axe,two-handed sword',
		'Dual-Wield Weapon 1' : 'sword,mace,axe',
		'Dual-Wield Weapon 2' : 'sword,mace,axe',
	},
	Rogue : {
		'Ranged Weapon' : 'crossbow,bow',
		'Dual-Wield Weapon 1' : 'sword,dagger',
		'Dual-Wield Weapon 2' : 'sword,dagger',
	},
	Necromancer : {
		'Offhand' : 'focus',
		'Weapon' : 'sword,scythe,two-handed sword,two-handed scythe,wand,staff'
	},
	Druid : {
		'Offhand' : 'totem',
		'Weapon' : 'axe,mace,two-handed mace,two-handed axe'
	},
	Sorcerer : {
		'Offhand' : 'focus,tome',
		'Weapon' : 'dagger,wand,staff'
	},
	Spiritborn : {}
}

const matchItemType = function(itemType, charClass, matcher) {
	return matcher.weapon[itemType] ?? (matcher[charClass][itemType] ?? itemType)
}

module.exports.matcherFn = matchItemType;
module.exports.d4builds = d4builds;
module.exports.mobalytics = mobalytics;