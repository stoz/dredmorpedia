/*******************************************************************************
** Stat
**
** The various statistics of the character, items, monsters and spells.
*******************************************************************************/

Dredmor.Stat = {};

/**
** Stat Category
**
** Set of stat categories.
*/
Dredmor.Stat.Category =
{
	Damage:
	{
		id: genId(),
		name: 'Damage'
	},
	Resistance:
	{
		id: genId(),
		name: 'Resistance'
	},
	Primary:
	{
		id: genId(),
		name: 'Primary'
	},
	Secondary:
	{
		id: genId(),
		name: 'Secondary'
	}
}

/**
** Stat Map
**
** Map for reasonably fast lookup of stats by their 'index'.
*/
Dredmor.Stat.Map =
{
}

/**
** Stat Data
**
** A map of the form:
**     stat-type-name -> [Parsed Stat Type]
**
** A [Parsed Stat Type] is of the form:
**     name:			(String)	Display name
**     type:			(String)	Type of stat
**     index:			(String)	Index for fast access (e.g. 'voltaic' or 21)
**     icon:			(String)	Name of the stat's icon file (located in the 'data/ui/icons' directory)
**     color:			(String)	Hex color of the stat
**     order:			(Integer)	Order that this stat should be shown (e.g. first damage, then resistances)
**     description:		(String)	Description of the stat
*/
Dredmor.Stat.Data =
{
	AcidicDamage:
	{
		id: genId(),
		name: 'Acidic Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'acidic',
		description: 'Acidic damage is why you should always be careful when attempting to make a really large baking-soda-and-vinegar volcano. It bypasses your opponent\'s armour.',
		icon: 'dmg_acidic',
		color: 0xFFFFFF,
		order: 0
	},
	AetherealDamage:
	{
		id: genId(),
		name: 'Aethereal Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'aethereal',
		description: 'Aethereal damage is inflicted when your attack damages using the power of the stars. We have absolutely nothing funny to say about this, because we take astronomy very seriously. So should you. It bypasses your opponent\'s armour.',
		icon: 'dmg_aethereal',
		color: 0xFFFFFF,
		order: 0
	},
	AsphyxiativeDamage:
	{
		id: genId(),
		name: 'Asphyxiative Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'asphyxiative',
		description: 'Asphyxiative damage is very hard to spell, and is inflicted upon your opponent when your attack suddenly causes them to stop breathing. This is usually accomplished by removing air from the room, and replacing it with gas, cabbage scents, or noxious cologne. It bypasses your opponent\'s armour.',
		icon: 'dmg_aphyxiative',
		color: 0xFFFFFF,
		order: 0
	},
	BlastingDamage:
	{
		id: genId(),
		name: 'Blasting Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'blasting',
		description: 'Blasting damage, first discovered by Alfred Nobel, refers to any damage projected from the quasi-elemental plane of dynamite. It is affected by your opponent\'s armour.',
		icon: 'dmg_blast',
		color: 0xFFFFFF,
		order: 0
	},
	ConflagratoryDamage:
	{
		id: genId(),
		name: 'Conflagratory Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'conflagratory',
		description: 'Conflagratory damage is inflicted upon your opponent when you manage to set any part of them on fire. It is not affected by armour.',
		icon: 'dmg_conflagratory',
		color: 0xFFFFFF,
		order: 0
	},
	CrushingDamage:
	{
		id: genId(),
		name: 'Crushing Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'crushing',
		description: 'Crushing damage is caused by maces, blunt objects, feet, rocks, and elderly gravy. It is affected by your opponent\'s armour.',
		icon: 'dmg_crushing',
		color: 0xFFFFFF,
		order: 0
	},
	ExistentialDamage:
	{
		id: genId(),
		name: 'Existential Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'existential',
		description: 'Existential damage: does it exist or not? We don\'t know, but your weapon may inflict it on somebody... if they exist. It bypasses your opponent\'s armour, if it exists. This tooltip is now going to go off and question its existence, read Heidegger, and weep piteously into a bottle of Dr. Sanin\'s New-Age Pilsner. It bypasses your opponent\'s armour.',
		icon: 'dmg_existential',
		color: 0xFFFFFF,
		order: 0
	},
	HyperboreanDamage:
	{
		id: genId(),
		name: 'Hyperborean Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'hyperborean',
		description: 'Hyperborean damage is inflicted by frost bite, frost demons, frost weapons, Frost Brand, and frost giants. It is not affected by armour.',
		icon: 'dmg_hyperborean',
		color: 0xFFFFFF,
		order: 0
	},
	NecromanticDamage:
	{
		id: genId(),
		name: 'Necromantic Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'necromantic',
		description: 'Necromantic damage is inflicted by necromancy, which usually means that you have a sword that drains life or turns people into zombies or something. It bypasses your opponent\'s armour.',
		icon: 'dmg_necromatic',
		color: 0xFFFFFF,
		order: 0
	},
	PiercingDamage:
	{
		id: genId(),
		name: 'Piercing Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'piercing',
		description: 'Piercing damage is caused when you manage to get the pointy bit of the weapon to stick into the other guy\'s flesh. It bypasses armour.',
		icon: 'dmg_piercing',
		color: 0xFFFFFF,
		order: 0
	},
	PutrefyingDamage:
	{
		id: genId(),
		name: 'Putrefying Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'putrefying',
		description: 'Putrefying damage is inflicted by any attacks that cause your opponent\'s flesh to decay and rot, such as by attacking them with the vegetable crisper in a refridgerator. It bypasses your opponent\'s armour.',
		icon: 'dmg_putrefying',
		color: 0xFFFFFF,
		order: 0
	},
	RighteousDamage:
	{
		id: genId(),
		name: 'Righteous Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'righteous',
		description: 'Righteous damage is inflicted by holy weaponry, really pretty elven maidens, angelic beings, certain sorts of very mystical and holy crystals, and mineral water. It bypasses your opponent\'s armour.',
		icon: 'dmg_righteous',
		color: 0xFFFFFF,
		order: 0
	},
	SlashingDamage:
	{
		id: genId(),
		name: 'Slashing Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'slashing',
		description: 'Slashing damage is caused when you manage to get the sharp bit of the weapon to cut through the flesh of the other guy. It is affected by your opponent\'s armour.',
		icon: 'dmg_slashing',
		color: 0xFFFFFF,
		order: 0
	},
	ToxicDamage:
	{
		id: genId(),
		name: 'Toxic Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'toxic',
		description: 'Toxic damage is everything icky, nasty, and poisonous. It is often inflicted by tiny Brazilian frogs. The frogs do not like you very much, and we do not recommend strapping them to your equipment. It is not affected by armour.',
		icon: 'dmg_toxic',
		color: 0xFFFFFF,
		order: 0
	},
	TransmutativeDamage:
	{
		id: genId(),
		name: 'Transmutative Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'transmutative',
		description: 'Transmutative damage is inflicted when your attack changes something into something else, like clean white linens into a very large drycleaning bill. It bypasses your opponent\'s armour.',
		icon: 'dmg_transmutative',
		color: 0xFFFFFF,
		order: 0
	},
	VoltaicDamage:
	{
		id: genId(),
		name: 'Voltaic Damage',
		category: Dredmor.Stat.Category.Damage,
		index: 'voltaic',
		description: 'Voltaic damage is any damage of an electrical nature. It is not affected by your opponent\'s armour.',
		icon: 'dmg_voltaic',
		color: 0xFFFFFF,
		order: 0
	},
	AcidicResistance:
	{
		id: genId(),
		name: 'Acidic Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'acidic',
		description: 'Acidic resistance is best achieved by covering yourself, head to toe, in baking soda. Failing that, we suggest the adventurer\'s fallback: magic rings, again.',
		icon: 'dmg_acidic_resist',
		color: 0xFFFFFF,
		order: 1
	},
	AetherealResistance:
	{
		id: genId(),
		name: 'Aethereal Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'aethereal',
		description: 'Aethereal resistance protects you from attacks fuelled by the power of the stars, the universe, and the influences of the Celestial Bodies upon your more earthly body. Caution: do not stare directly into the Celestial Aegis.',
		icon: 'dmg_aethereal_resist',
		color: 0xFFFFFF,
		order: 1
	},
	AsphyxiativeResistance:
	{
		id: genId(),
		name: 'Asphyxiative Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'asphyxiative',
		description: 'Asphyxiative resistance: the Heimlich Maneuver of the tenth century.',
		icon: 'dmg_aphyxiative_resist',
		color: 0xFFFFFF,
		order: 1
	},
	BlastingResistance:
	{
		id: genId(),
		name: 'Blasting Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'blasting',
		description: 'Blasting resistance lets you go out with a bang.',
		icon: 'dmg_blast_resist',
		color: 0xFFFFFF,
		order: 1
	},
	ConflagratoryResistance:
	{
		id: genId(),
		name: 'Conflagratory Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'conflagratory',
		description: 'Conflagratory resistance is very useful if you\'re a witch, or are likely to be working near witches or other flammable objects. Caution: asbestos armour has been determined by the Dwarven Mountainhomes to cause an increase in lung cancer, beard rot, and Strange Moods.',
		icon: 'dmg_conflagratory_resist',
		color: 0xFFFFFF,
		order: 1
	},
	CrushingResistance:
	{
		id: genId(),
		name: 'Crushing Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'crushing',
		description: 'Crushing resistance allows you to successfully resist the impact of large, blunt objects like bricks.',
		icon: 'dmg_crushing_resist',
		color: 0xFFFFFF,
		order: 1
	},
	ExistentialResistance:
	{
		id: genId(),
		name: 'Existential Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'existential',
		description: 'Existential resistance: you think, therefore you resist.',
		icon: 'dmg_existential_resist',
		color: 0xFFFFFF,
		order: 1
	},
	HyperboreanResistance:
	{
		id: genId(),
		name: 'Hyperborean Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'hyperborean',
		description: 'Hyperborean resistance, common amongst the savage Viking hordes, helps you survive even the chilliest of winters or wintery attacks.',
		icon: 'dmg_hyperborean_resist',
		color: 0xFFFFFF,
		order: 1
	},
	NecromanticResistance:
	{
		id: genId(),
		name: 'Necromantic Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'necromantic',
		description: 'Necromantic resistance is very useful when dealing with any members of the undead, and the occasional politican.',
		icon: 'dmg_necromatic_resist',
		color: 0xFFFFFF,
		order: 1
	},
	PiercingResistance:
	{
		id: genId(),
		name: 'Piercing Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'piercing',
		description: 'Piercing resistance allows you to be stung by twenty thousand bees and not feel a thing! (Well, very little.)',
		icon: 'dmg_piercing_resist',
		color: 0xFFFFFF,
		order: 1
	},
	PutrefyingResistance:
	{
		id: genId(),
		name: 'Putrefying Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'putrefying',
		description: 'Putrefying resistance lets you survive attacks which may try to rot your skin off.',
		icon: 'dmg_putrefying_resist',
		color: 0xFFFFFF,
		order: 1
	},
	RighteousResistance:
	{
		id: genId(),
		name: 'Righteous Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'righteous',
		description: 'Righteous resistance helps protect you from being smote by Divine Powers. It will not, however, protect you from being eaten by bears, as befell the children who mocked the prophet Elisha.',
		icon: 'dmg_righteous_resist',
		color: 0xFFFFFF,
		order: 1
	},
	SlashingResistance:
	{
		id: genId(),
		name: 'Slashing Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'slashing',
		description: 'Slashing resistance protects you from attacks by weapons with bladed edges. It also helps reduce razor burn.',
		icon: 'dmg_slashing_resist',
		color: 0xFFFFFF,
		order: 1
	},
	ToxicResistance:
	{
		id: genId(),
		name: 'Toxic Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'toxic',
		description: 'Toxic resistance is highly praised by those gourmands wishing to dine on the finest in Goblin cuisine.',
		icon: 'dmg_toxic_resist',
		color: 0xFFFFFF,
		order: 1
	},
	TransmutativeResistance:
	{
		id: genId(),
		name: 'Transmutative Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'transmutative',
		description: 'Transmutative resistance helps you resist transmutation. Whatever that is.',
		icon: 'dmg_transmutative_resist',
		color: 0xFFFFFF,
		order: 1
	},
	VoltaicResistance:
	{
		id: genId(),
		name: 'Voltaic Resistance',
		category: Dredmor.Stat.Category.Resistance,
		index: 'voltaic',
		description: 'Voltaic resistance is best achieved by strapping frogs to your body. Their tough, thick conductive hides will help protect you from any electrical encounters. Failing that, we recommend magic rings or something.',
		icon: 'dmg_voltaic_resist',
		color: 0xFFFFFF,
		order: 1
	},
	Burliness:
	{
		id: genId(),
		name: 'Burliness',
		category: Dredmor.Stat.Category.Primary,
		index: 0,
		description: 'Burliness is the primary attribute of the Warrior and pertains to getting into trouble, hitting ones head on other people, and getting hit by large objects/limbs/pseudopods. It affects hitpoints, melee power, and block chance.',
		icon: 'stat_burliness',
		color: 0xFFFFFF,
		order: 2,
		LevelFormula: function(war, rog, wiz) { return war * 2 + rog + wiz; }
	},
	Sagacity:
	{
		id: genId(),
		name: 'Sagacity',
		category: Dredmor.Stat.Category.Primary,
		index: 1,
		description: 'Sagacity is the primary attribute of the wizard, and is mostly about being a know-it-all. It affects mana points and magic power.',
		icon: 'stat_sagacity',
		color: 0xFFFFFF,
		order: 2,
		LevelFormula: function(war, rog, wiz) { return war + rog + wiz * 2; }
	},
	Nimbleness:
	{
		id: genId(),
		name: 'Nimbleness',
		category: Dredmor.Stat.Category.Primary,
		index: 2,
		description: 'Nimbleness is the primary attribute of the Rogue and is the quality of swiftness, grace, and not getting hit by things. It affects dodge chance, sneakiness, enemy dodge reduction, and counter-attack chance. Nimbleness is pretty great.',
		icon: 'stat_nimbleness',
		color: 0xFFFFFF,
		order: 2,
		LevelFormula: function(war, rog, wiz) { return war + rog * 2 + wiz; }
	},
	Caddishness:
	{
		id: genId(),
		name: 'Caddishness',
		category: Dredmor.Stat.Category.Primary,
		index: 3,
		description: 'Caddishness is the primary attribute of the Pirate and revolves around not caring about the feelings of others. It affects critical hit and counter-attack chance.',
		icon: 'stat_caddishness',
		color: 0xFFFFFF,
		order: 2,
		LevelFormula: function(war, rog, wiz) { return war * 2 + rog * 2 + wiz; }
	},
	Stubborness:
	{
		id: genId(),
		name: 'Stubborness',
		category: Dredmor.Stat.Category.Primary,
		index: 4,
		description: 'Stubbornness is the primary attribute of the Monk and enhances self-righteousness and the ability to ignore mean things other people say about you. It affects magical resistance and block chance.',
		icon: 'stat_stubborness',
		color: 0xFFFFFF,
		order: 2,
		LevelFormula: function(war, rog, wiz) { return war * 2 + rog + wiz * 2; }
	},
	Savvy:
	{
		id: genId(),
		name: 'Savvy',
		category: Dredmor.Stat.Category.Primary,
		index: 5,
		description: 'Savvy is the primary attribute of the Bard and involves being clever while avoiding trouble. It affects magical haywire chance, sneakiness and magical spell cost.',
		icon: 'stat_savvy',
		color: 0xFFFFFF,
		order: 2,
		LevelFormula: function(war, rog, wiz) { return war + rog * 2 + wiz * 2; }
	},
	Life:
	{
		id: genId(),
		name: 'Life',
		category: Dredmor.Stat.Category.Secondary,
		index: 0,
		description: 'This number shows how not-dead you are. When it hits zero you cease to live. Try not to let that happen.',
		icon: 'stat_life',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return 5 + war * 4 + rog * 3 + wiz * 2; }
	},
	Mana:
	{
		id: genId(),
		name: 'Mana',
		category: Dredmor.Stat.Category.Secondary,
		index: 1,
		description: 'This number shows your capacity to cast magic spells, all of which cost mana to some degree or other.',
		icon: 'stat_mana',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return war * 2 + rog * 2 + wiz * 4; }
	},
	MeleePower:
	{
		id: genId(),
		name: 'Melee Power',
		category: Dredmor.Stat.Category.Secondary,
		index: 2,
		description: 'Melee Power affects how hard you hit with your weapons (or feet, if you don\'t have any). It\'s also how hard you throw stuff, but not how hard you shoot your crossbow bolts because that wouldn\'t make sense.',
		icon: 'stat_meleepower',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war * 2 + rog + wiz - 5)/3); }
	},
	MagicPower:
	{
		id: genId(),
		name: 'Magic Power',
		category: Dredmor.Stat.Category.Secondary,
		index: 3,
		description: 'Magic Power affects the power of your spells.',
		icon: 'stat_magicpower',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war + rog + wiz * 2)/2); }
	},
	Crit:
	{
		id: genId(),
		name: 'Crit',
		category: Dredmor.Stat.Category.Secondary,
		index: 4,
		description: 'Critical Chance affects how likely you are to land a particularly effective blow in combat, dealing double damage.',
		icon: 'stat_crit',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war * 2 + rog * 2 + wiz)/2); }
	},
	Haywire:
	{
		id: genId(),
		name: 'Haywire',
		category: Dredmor.Stat.Category.Secondary,
		index: 5,
		description: 'Haywire Chance affects how likely your spells are to trigger a highly unstable resonance cascade event.',
		icon: 'stat_haywire',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war + rog * 2 + wiz * 2)/2); }
	},
	Dodge:
	{
		id: genId(),
		name: 'Dodge',
		category: Dredmor.Stat.Category.Secondary,
		index: 6,
		description: 'Dodge Chance affects how likely you are to avoid the consequences of your actions and physical attacks.',
		icon: 'stat_dodge',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war + rog * 2 + wiz)/2); }
	},
	Block:
	{
		id: genId(),
		name: 'Block',
		category: Dredmor.Stat.Category.Secondary,
		index: 7,
		description: 'Block Chance affects how likely you are to (mostly) block what you deserve, at least so far as physical attacks go.',
		icon: 'stat_block',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war * 2 + rog + wiz)/6 + (war * 2 + rog + wiz * 2)/6); }
	},
	Counter:
	{
		id: genId(),
		name: 'Counter',
		category: Dredmor.Stat.Category.Secondary,
		index: 8,
		description: 'Counter Chance affects how likely you are to commit a vindictive act in melee combat by returning an enemy\'s attack with one of your own.',
		icon: 'stat_counter',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war + rog * 2 + wiz)/6 + (war * 2 + rog * 2 + wiz)/6); }
	},
	EDR:
	{
		id: genId(),
		name: 'Enemy Dodge Reduction',
		category: Dredmor.Stat.Category.Secondary,
		index: 9,
		description: 'Enemy Dodge Reduction affects how likely an enemy is to not dodge your attacks. Because heroes never miss - but sometimes their attacks are dodged.',
		icon: 'stat_edr',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war + rog * 2 + wiz)/3); }
	},
	ArmourAbsorption:
	{
		id: genId(),
		name: 'Armour Absorption',
		category: Dredmor.Stat.Category.Secondary,
		index: 10,
		description: 'Armour Absorption is how good your armor is at standing between you and inevitability. Each point of Armour Absorption removes one point of mundane damage types.',
		icon: 'stat_armourabsorption',
		color: 0xFFFFFF,
		order: 3
	},
	MagicResistance:
	{
		id: genId(),
		name: 'Magic Resistance',
		category: Dredmor.Stat.Category.Secondary,
		index: 11,
		description: 'Affects how intuitively you can (mostly) nullify a magical attack against you.',
		icon: 'stat_magicresistance',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { return Math.floor((war * 2 + rog + wiz * 2)/2); }
	},
	Sneakiness:
	{
		id: genId(),
		name: 'Sneakiness',
		category: Dredmor.Stat.Category.Secondary,
		index: 12,
		description: 'Sneakiness is how good you are at tip-toeing around your problems rather than facing them. Helps with sneaking by enemies, not waking sleeping enemies, and with avoiding traps.',
		icon: 'stat_sneakiness',
		color: 0xFFFFFF,
		order: 3,
		LevelFormula: function(war, rog, wiz) { var result = Math.floor((war * 2 + rog * 4 + wiz * 3) * 0.75) - 20; return result < 0 ? 0 : result; }
	},
	LifeRegen:
	{
		id: genId(),
		name: 'Life Regen',
		category: Dredmor.Stat.Category.Secondary,
		index: 13,
		description: 'Listen up, this one is tricky: This number is your health regeneration bonus. It is subtracted from the base health regeneration rate to determine the number of steps it takes for you to regenerate one point of health. A higher number is better.',
		icon: 'stat_liferegen',
		color: 0xFFFFFF,
		order: 3
	},
	ManaRegen:
	{
		id: genId(),
		name: 'Mana Regen',
		category: Dredmor.Stat.Category.Secondary,
		index: 14,
		description: 'Listen up, this one is tricky: This number is your mana regeneration bonus. It is subtracted from the base mana regeneration rate to determine the number of steps it takes for you to regenerate one point of mana. A higher number is better.',
		icon: 'stat_manaregen',
		color: 0xFFFFFF,
		order: 3
	},
	WandAffinity:
	{
		id: genId(),
		name: 'Wand Affinity',
		category: Dredmor.Stat.Category.Secondary,
		index: 15,
		description: '',
		icon: 'stat_wandburn',
		color: 0xFFFFFF,
		order: 3
	},
	TrapAffinity:
	{
		id: genId(),
		name: 'Trap Affinity',
		category: Dredmor.Stat.Category.Secondary,
		index: 16,
		description: 'Trap Affinity is a rating of your ability to avoid and disarm traps.',
		icon: 'stat_traplevel',
		color: 0xFFFFFF,
		order: 3
	},
	TrapSightRadius:
	{
		id: genId(),
		name: 'Trap Sight Radius',
		category: Dredmor.Stat.Category.Secondary,
		index: 17,
		description: 'Trap Sight Radius determines the distance at which you can spot and identify traps.',
		icon: 'stat_trapsense',
		color: 0xFFFFFF,
		order: 3
	},
	SightRadius:
	{
		id: genId(),
		name: 'Sight Radius',
		category: Dredmor.Stat.Category.Secondary,
		index: 18,
		description: 'Visual Sight Radius is how far you can see in the dark dungeon.',
		icon: 'stat_sight',
		color: 0xFFFFFF,
		order: 3
	},
	Smithing:
	{
		id: genId(),
		name: 'Smithing',
		category: Dredmor.Stat.Category.Secondary,
		index: 19,
		description: 'This is a rating of how good you are at smithery.',
		icon: 'stat_smithing',
		color: 0xFFFFFF,
		order: 3
	},
	Tinkering:
	{
		id: genId(),
		name: 'Tinkering',
		category: Dredmor.Stat.Category.Secondary,
		index: 20,
		description: 'This is a rating of how good you are at tinkering.',
		icon: 'stat_tinkerer',
		color: 0xFFFFFF,
		order: 3
	},
	Alchemy:
	{
		id: genId(),
		name: 'Alchemy',
		category: Dredmor.Stat.Category.Secondary,
		index: 21,
		description: 'This is a rating of how good you are at alchemizing.',
		icon: 'stat_alchemy',
		color: 0xFFFFFF,
		order: 3
	},
	MagicReflection:
	{
		id: genId(),
		name: 'Magic Reflection',
		category: Dredmor.Stat.Category.Secondary,
		index: 22,
		description: '',
		icon: 'stat_reflection',
		color: 0xFFFFFF,
		order: 3
	},
	WandCrafting:
	{
		id: genId(),
		name: 'Wand Crafting',
		category: Dredmor.Stat.Category.Secondary,
		index: 23,
		description: 'This is a rating of how good you are at wandcrafting.',
		icon: 'stat_wandburn',
		color: 0xFFFFFF,
		order: 3
	},
	XP:
	{
		id: genId(),
		name: 'Experience Points',
		category: Dredmor.Stat.Category.Secondary,
		index: 99,
		description: '',
		icon: 'xp_medal',
		color: 0xFFFFFF,
		order: 4
	}
};

/*
** Stat Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Stat.Section = Dredmor.Section.Add({
	Name: 'Stats',
	
	Parse: function(source, callback)
	{
		// Nothing to parse
		callback();
	},
	
	Link: function()
	{
		// Nothing to link
	},
	
	Render: function()
	{
		// Transform the data for displaying
		var data = [];
		var indexMap = [];
		
		// Iterate over data
		for (var i in Dredmor.Stat.Data) {
			var stat = Dredmor.Stat.Data[i];

			// Find the index for our display data
			var j = stat.category.id;
			indexMap[j] = indexMap[j] || data.length + 1;
			var index = indexMap[j] - 1;

			// Store in display data
			data[index] = data[index] || {};
			data[index].category = data[index].category || stat.category;
			data[index].stats = data[index].stats || [];
			data[index].stats.push(stat);
		}

		// Sort the display data
		data.sort(function(a,b) { return a.category.id - b.category.id });
		
		// Render the item types to build the tabs
		$('#stat').find('.tabs').html(
			$('#statTabsTemplate').render(data)
		);
		
		// Render items to build the content
		$('#stat').find('.content').html(
			$('#statContentTemplate').render(data)
		);
		
		// Apply Tabs (with queuing)
		Dredmor.Helper.Queue(null, function() {
			$('#stat').tabs();
		});
	}
});

/**
** ParseStats
**
** Parses common tags that buff your stats:
**     damagebuff, resistbuff, secondarybuff, primarybuff
*/
Dredmor.Stat.ParseStats = function(xml)
{
	// Lazy Initialisation
	if (!Dredmor.Stat.ParseStats.Initialised) {
		Dredmor.Stat.ParseStats.Initialised = true;

		// Build stat maps
		for (var i in Dredmor.Stat.Category) {
			Dredmor.Stat.Map[i] = [];

			for (var j in Dredmor.Stat.Data) {
				var stat = Dredmor.Stat.Data[j];

				if (stat.category === Dredmor.Stat.Category[i]) {
					Dredmor.Stat.Map[i][stat.index] = stat;
				}
			}
		}
	}

	// Build a set of stat values
	var stats = [];

	// Parse ourselves and our direct children
	var elements = xml.children().andSelf(); 
	
	// Damage
	elements.filter('damagebuff,damage,weapon,effect').each(function() {
		var statTypeMap = Dredmor.Stat.Map['Damage'];

		for (var i in statTypeMap) {
			var statType = statTypeMap[i];
			
			// Check if we have a stat for this type
			var amount = parseFloat($(this).attr(statType.index));
			var factorAmount = parseFloat($(this).attr(statType.index + 'F'));
			
			if (!isNaN(amount) || !isNaN(factorAmount)) {
				// Build the stat
				var stat = {};
				
				stat.type = statType;
				stat.amount = amount || 0;
				
				// Build the factor (if we have one)
				if (factorAmount) {
					var factor = {};

					factor.type = Dredmor.Stat.Map['Primary'][$(this).attr('primaryScale')];
					factor.type = factor.type || Dredmor.Stat.Map['Secondary'][$(this).attr('secondaryScale')]
					factor.type = factor.type || Dredmor.Stat.Data.MagicPower;
					
					factor.amount = factorAmount;
					
					// Combine
					stat.factor = factor;
				}
				
				// Add to stats
				stats.push(stat);
			}
		}
	});
	
	// Resist
	elements.filter('resistbuff,resistances').each(function() {
		var statTypeMap = Dredmor.Stat.Map['Resistance'];

		for (var i in statTypeMap) {
			var statType = statTypeMap[i];
			
			if ($(this).attr(statType.index)) {
				var stat = {};
				
				stat.type = statType;
				stat.amount = parseFloat($(this).attr(statType.index));
				
				stats.push(stat);
			}
		}
	});
	
	// Secondary
	elements.filter('secondarybuff').each(function() {
		var statId = $(this).attr('id');
		var statType = Dredmor.Stat.Map['Secondary'][statId];

		if (statType) {
			var stat = {};
				
			stat.type = statType;
			stat.amount = parseFloat($(this).attr('amount'));
			
			stats.push(stat);
		}
	});
	
	// Primary
	elements.filter('primarybuff').each(function() {
		var statId = $(this).attr('id');
		var statType = Dredmor.Stat.Map['Primary'][statId];

		if (statType) {
			var stat = {};
				
			stat.type = statType;
			stat.amount = parseFloat($(this).attr('amount'));
			
			stats.push(stat);
		}
	});
	
	// Special Case: Sight
	elements.filter('sightbuff').each(function() {
		var stat = {};
		
		stat.type = Dredmor.Stat.Data.SightRadius;
		stat.amount = parseFloat($(this).attr('amount'));
		
		stats.push(stat);
	});
	
	return stats;
};

/**
** MergeStats
**
** Merges stats in two stat arrays.
*/
Dredmor.Stat.MergeStats = function(aStats, bStats)
{
	var mergedStats = [];

	// Add A stats
	for (var i = 0; i < aStats.length; i++) {
		mergedStats.push({
			type: aStats[i].type,
			amount: aStats[i].amount
		});
	}

	// Merge B stats
	for (var i = 0; i < bStats.length; i++) {
		var j = 0;

		// Look for this stat in our merged stats
		for (j = 0; j < mergedStats.length; j++) {
			if (bStats[i].type === mergedStats[j].type) {
				// Merge it!
				mergedStats[j].amount += bStats[i].amount;
				break;
			}
		}

		// Check if we didn't find this stat in our merged stats
		if (j === mergedStats.length) {
			// Add to our merged stats
			mergedStats.push({
				type: bStats[i].type,
				amount: bStats[i].amount
			});
		}
	}

	return mergedStats;
};

/**
** InheritStats
**
** Inherits stats from a parent stat array to a child stat array. Entries in
** the child array override those in the parent.
*/
Dredmor.Stat.InheritStats = function(childStats, parentStats)
{
	var mergedStats = [];

	// Add parent stats
	if (parentStats) {
		for (var i = 0; i < parentStats.length; i++) {
			mergedStats.push({
				type: parentStats[i].type,
				amount: parentStats[i].amount
			});
		}
	}

	// Add child stats
	if (childStats) {
		for (var i = 0; i < childStats.length; i++) {
			var j = 0;

			for (j = 0; j < mergedStats.length; j++) {
				if (childStats[i].type === mergedStats[j].type) {
					break;
				}
			}

			// j will either be the index to replace or the end of the array
			mergedStats[j] = {
				type: childStats[i].type,
				amount: childStats[i].amount
			};
		}
	}

	return mergedStats;
};

/**
** CalculateLevelStats
**
** Calculates the stats gained from the given warrior, rogue and wizard levels.
*/
Dredmor.Stat.CalculateLevelStats = function(war, rog, wiz)
{
	var stats = [];

	for (var key in Dredmor.Stat.Data) {
		var statType = Dredmor.Stat.Data[key];

		// Check if this stat type has a level formula
		if (statType.LevelFormula) {
			// Apply formula
			var amount = statType.LevelFormula(war, rog, wiz);

			// Add to stats
			stats.push({
				type: statType,
				amount: amount
			});
		}
	}

	return stats;
};

/**
** GetTypeHtml
**
** Returns the image HTML for the given stat type.
*/
Dredmor.Stat.GetTypeImageHtml = function(type)
{
	return '<img src="data/ui/icons/' + type.icon + '.png" title="' + type.name + '" />';
};

/**
** Rendering Tags
**
** Tags for rendering data.
*/
$.views.tags({
	/**
	** renderStats
	**
	** Renders an array of stat values.
	*/
	renderStats: function( stats )
	{
		var ret = '';
		
		// Confirm we have an array of stats
		if (stats) {
			// Build rows of stats
			var rows = [];
			
			for (var i = 0; i < stats.length; i++) {
				var stat = stats[i];

				// Only show stats that have an amount or a factor with an amount
				if (stat.amount || (stat.factor && stat.factor.amount)) {
					// Build stat html
					var statHtml = Dredmor.Stat.GetTypeImageHtml(stat.type) + stat.amount;
					
					// Add our factor (if we have one)
					if (stat.factor && stat.factor.amount) {
						// Build factor html
						var factorHtml = '';

						factorHtml += (stat.factor.negative ? '&minus;' : '&plus;') + ' ' + stat.factor.amount + ' &times;';
						factorHtml += Dredmor.Stat.GetTypeImageHtml(stat.factor.type);

						// Add to stat html
						statHtml += ' (' + factorHtml + ')';
					}
					
					// Add our minimum (if we have one)
					if (stat.minimum) {
						// Build mininum html
						var minHtml = 'min' + Dredmor.Stat.GetTypeImageHtml(stat.type) + stat.minimum;

						// Add to stat html
						statHtml += ' (' + minHtml + ')';
					}

					// Wrap our stat html
					statHtml = '<span>' + statHtml + '</span>';
					
					// Add to the row that corresponds with our stat's order
					if (rows[stat.type.order]) {
						rows[stat.type.order] += statHtml;
					} else {
						rows[stat.type.order] = statHtml;
					}
				}
			}
			
			// Finally iterate over rows and output the html
			for (var i = 0; i < rows.length; i++) {
				if (rows[i]) {
					ret += rows[i] + '<br />';
				}
			}
		}
		
		return '<div class="stats">' + ret + '</div>';
	}
});