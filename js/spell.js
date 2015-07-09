/*******************************************************************************
** Spell
**
** Magic, abilities and other stuff.
*******************************************************************************/

Dredmor.Spell = {};

/**
** Spell Data
**
** An array of [Parsed Spell]
**
** A [Parsed Spell] is of the form:
**     name:		(String)						Name
**     description:	(String)						Description
**     iconFile:	(String)						Path of icon file from Dredmor's base directory
**     type:		(Dredmor.Spell.Type)			Spell Type (e.g. self, target)
**     stats:		(Array<[Parsed Stat]>)			Stats that the spell gives you
**     effects:		(Array<[Parsed Effect]>)		Effects of the spell
**
** A [Parsed Effect] is of the form:
**     description:	(String)				Description
**     chance:		(String)				Chance
**     duration:	(String)				Duration (in turns)
**     delay:		(String)				Delay (in turns)
**     stats:		(Array<[Parsed Stat]>)  Stats for this effect, including recovered life, recovered mana and damage
**     monster:		(String)				Monster type affected
**	   burn:		(Boolean)				Is the target ignited?
**     self:		(Boolean)				Is the caster affected?
**     removable:	(Boolean)				Is this effect removable?
**     upkeep:		(String)				# of turns before you must pay mana to keep this effect
**     stacksize:	(String)				# of times this effect can be stacked
**     brittle:		(String)				# of hits this attack lasts for
**     attacks:		(String)				# of attacks this effect lasts for
*/
Dredmor.Spell.Data = [];

/*
** Spell Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Spell.Section = Dredmor.Section.Add({
	Name: 'Spells',

	Parse: function(source, callback)
	{
		// Fetch data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'spellDB.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse and callback
				Dredmor.Spell.Parse(source, xml, callback);
			},
			error: function() {
				// Parsing failed!
				callback(Dredmor.Spell.Data);
			}
		});
	},
	
	Link: function()
	{
		// Nothing to link
	},
	
	Render: function()
	{
		// Transform the data for displaying
		var data = [];
		var indexMap = {};
		
		// Iterate over data
		for (var i in Dredmor.Spell.Data) {
			var spell = Dredmor.Spell.Data[i];

			// Find the index for our display data
			var j = spell.category.id;
			indexMap[j] = indexMap[j] || data.length + 1;
			var index = indexMap[j] - 1;

			// Store in display data
			data[index] = data[index] || {};
			data[index].category = data[index].category || spell.category;
			data[index].spells = data[index].spells || [];
			data[index].spells.push(spell);
		}

		// Sort the display data
		data.sort(function(a,b) { return a.category.id - b.category.id });

		// Render the tabs
		$('#spell').find('.tabs').html(
			$('#spellTabsTemplate').render(data)
		);

		// Render the content (with queuing)
		$('#spell').find('.content').empty();

		for (var i = 0; i < data.length; i++) {
			Dredmor.Helper.Queue(i, function(i) {
				$('#spell').find('.content').append(
					$('#spellContentTemplate').render(data[i])
				);
			});
			
		}
		
		// Apply Tabs (with queuing)
		Dredmor.Helper.Queue(null, function() {
			$('#spell').tabs();
		});
	}
});

/**
** Parse
**
** Parses spellDB.xml.
*/
Dredmor.Spell.Parse = function(source, xml, callback)
{
	// Wrap xml object in jQuery
	xml = $(xml);
	
	// Find each spell and parse it
	xml.find('spell').each(function() {
		// Add to queue to be parsed later
		Dredmor.Helper.Queue($(this), function(xmlSpell) {
			// Parse spell and build object
			var spell = new Dredmor.Object(source);
			
			// General
			spell.name = xmlSpell.attr('name');
			spell.description = xmlSpell.find('description').attr('text');
			
			// Category
			var character = spell.name.toUpperCase().charAt(0);
			spell.category = Dredmor.Misc.AlphanumericCategory[character];
			
			// Icon
			spell.iconFile = Dredmor.Helper.GetPath(source, xmlSpell.attr('icon'));
			
			xmlSpell.find('buff').each(function() {
				spell.iconFile = Dredmor.Helper.GetPath(source, $(this).attr('icon'));
			});
			
			// Type ------------------------------------------------------------
			spell.type = Dredmor.Spell.Type.Unknown;
			
			for (var i in Dredmor.Spell.Type) {
				var type = Dredmor.Spell.Type[i];
				
				if (type.name == xmlSpell.attr('type')) {
					spell.type = type;
					break;
				}
			}
			
			// Effects ---------------------------------------------------------
			spell.effects = [];
			
			// Parse ourselves and our descendents sequentially
			var effectElements = xmlSpell.find('*').andSelf();

			for (var i in Dredmor.Spell.Effect) {
				var effectType = Dredmor.Spell.Effect[i];

				effectElements.filter(effectType.selector).each(function() {
					// Parse
					var effect = effectType.Parse($(this));
					
					// Add to effects list if successful
					if (effect) {
						spell.effects.push(effect);
					}
				});
			}
			
			// Insert into data
			Dredmor.Spell.Data[spell.name] = spell;
		});
	});

	// Queue callback as we use queues while parsing
	Dredmor.Helper.Queue(null, callback);
};

/**
** Trigger
**
** The various ways a spell can be triggered.
*/
Dredmor.Spell.Trigger =
{
	SteppedOn:		{ id: genId(),	description: 'stepped on',				selector: ''						},
	Zapped:			{ id: genId(),	description: 'zapped',					selector: ''						},
	Quaffed:		{ id: genId(),	description: 'quaffed',					selector: ''						},
	Munched:		{ id: genId(),	description: 'munched',					selector: ''						},
	ItemHit:		{ id: genId(),	description: 'the item hits',			selector: '' 						},
	MeleeTarget:	{ id: genId(),	description: 'you hit in melee',		selector: 'targetHitEffectBuff' 	},
	CrossbowTarget:	{ id: genId(),	description: 'your bolts hit',			selector: 'crossbowShotBuff'		},
	ThrownTarget:	{ id: genId(),	description: 'your thrown weapon hits',	selector: 'thrownBuff'				},
	KillTarget:		{ id: genId(),	description: 'you kill an enemy',		selector: 'targetKillBuff'			},
	MeleeSelf:		{ id: genId(),	description: 'you are hit in melee',	selector: 'playerHitEffectBuff'		},
	Dodge:			{ id: genId(),	description: 'you dodge',				selector: 'dodgeBuff'				},
	Crit:			{ id: genId(),	description: 'you crit',				selector: 'criticalBuff'			},
	Counter:		{ id: genId(),	description: 'you counter',				selector: 'counterBuff'				},
	Block:			{ id: genId(),	description: 'you block',				selector: 'blockBuff'				},
	Cast:			{ id: genId(),	description: 'you cast a spell',		selector: 'triggeroncast'			},
	Activated:		{ id: genId(),	description: 'activated',				selector: 'spell'					},
	Eaten:			{ id: genId(),	description: 'eaten',					selector: ''						},
	Drunk:			{ id: genId(),	description: 'drunk',					selector: ''						},
	TriggerOnce:	{ id: genId(),	description: null,						selector: 'effect[type="trigger"]'	},
	TriggerRepeat:	{ id: genId(),	description: null,						selector: 'effect[type="dot"]'		},
	TriggerList:	{ id: genId(),	description: null,						selector: 'effect[type="triggerfromlist"]'	},
	MonsterHit:		{ id: genId(),	description: 'it hits',					selector: ''						},
	MonsterAware:	{ id: genId(),	description: 'it is aware',				selector: ''						}
}

/**
** Target
**
** The various ways a spell can be targeted.
*/
Dredmor.Spell.Target =
{
	Creature:		{ id: genId(),	description: 'A creature'			},
	Self:			{ id: genId(),	description: 'The caster'			},
	Floor:			{ id: genId(),	description: 'A floor tile'			},
	EmptyFloor:		{ id: genId(),	description: 'An empty floor tile'	}
}

/**
** Type
**
** The various types of spell.
*/
Dredmor.Spell.Type =
{
	Self:			{ id: genId(),	name: 'self'					},
	Missile:		{ id: genId(),	name: 'missile'					},
	Template:		{ id: genId(),	name: 'template' 				},
	Adjacent:		{ id: genId(),	name: 'adjacent'				},
	Target:			{ id: genId(),	name: 'target'					},
	TargetFloor:	{ id: genId(),	name: 'targetfloor'				},
	TargetCorpse:	{ id: genId(),	name: 'targetcorpse'			},
	TargetCorpseAd:	{ id: genId(),	name: 'targetadjacentcorpse'	},
	Item:			{ id: genId(),	name: 'item'					},
	Fireball:		{ id: genId(),	name: 'fireball'				},
	KnightlyLeap:	{ id: genId(),	name: 'knightlyleap'			},
	Unknown:		{ id: genId(),	name: 'unknown'					}
}
	
/**
** Effect
**
** Defines attributes and parsing functions for the various types of effects.
*/
Dredmor.Spell.Effect = 
{
	// Spell ---------------------------------------------------------------
	
	Cooldown:
	{
		id: genId(),
		selector: 'spell[downtime]',
		Parse: function(xml)
		{
			var effect = {};
			
			// Description
			effect.name = 'Cooldown';
			
			// Duration
			effect.duration = xml.attr('downtime');
			
			return effect;
		}
	},
	
	ManaCost:
	{
		id: genId(),
		selector: 'requirements',
		Parse: function(xml)
		{
			var effect = {};
			
			// Description
			effect.name = 'Mana Cost';
			
			// Stats
			effect.stats = [{
				type: Dredmor.Stat.Data.Mana,
				amount: parseFloat(xml.attr('mp')),
				factor: {
					type: Dredmor.Stat.Data.Savvy,
					amount: parseFloat(xml.attr('savvyBonus')),
					negative: true
				},
				minimum: xml.attr('mincost')
			}];
			
			return effect;
		}
	},
	
	Attack:
	{
		id: genId(),
		selector: 'spell[attack]',
		Parse: function(xml)
		{
			// Confirm attack is valid
			if (xml.attr('attack') != '0') {
				var effect = {};
			
				// Description
				effect.name = 'Performs Melee Attack';
				
				return effect;
			} else {
				return null;
			}
		}
	},
	
	// Spell Types ---------------------------------------------------------
	
	Template:
	{
		id: genId(),
		selector: 'spell[type="template"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Affects Area';
			
			// Template & Anchored
			effect.template = xml.attr('templateID');
			effect.anchorPlayer = (xml.attr('anchored') == '1');
			
			return effect;
		}
	},
	
	// Major Effects -------------------------------------------------------
	
	Buff:
	{
		id: genId(),
		selector: 'buff',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Buff';
			
			// Duration, Upkeep, Brittle, Attacks
			effect.duration = xml.attr('time');
			effect.upkeep = xml.attr('manaUpkeep');
			effect.brittle = xml.attr('brittle');
			effect.attacks = xml.attr('attacks');
			effect.removable = (xml.attr('removable') === '1');
			
			// Stacksize (if stacking is allowed)
			if (xml.attr('stackable') != '0' &&
					xml.attr('allowstacking') != '0' &&
					xml.attr('stacksize') != '1') {
				effect.stackSize = xml.attr('stacksize');
			}
			
			// Stats
			effect.stats = Dredmor.Stat.ParseStats(xml);
			
			return effect;
		}
	},
	
	Mine:
	{
		id: genId(),
		selector: 'spell[mine="1"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Mine';
			
			// Radius (if it's greater than 1)
			var radius = xml.attr('mineradius');
			if (radius > 1) {
				effect.radius = radius;
			}
			
			// Duration 
			effect.duration = xml.attr('mineTimer');
			
			// Brittle (if it's not permanent)
			if (!xml.attr('minePermanent')) {
				effect.brittle = 1;
			}
			
			return effect;
		}
	},
	
	// Spell Triggers ------------------------------------------------------
	
	Trigger:
	{
		id: genId(),
		selector: 'effect[type="trigger"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('spell') || xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.TriggerOnce;
			
			// Delay
			var delay = xml.attr('amount');
			if (delay && delay != '0') {
				effect.delay  = delay;
			}
			
			return effect;
		}
	},
	
	Dot:
	{
		id: genId(),
		selector: 'effect[type="dot"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('spell') || xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.TriggerRepeat;
			
			// Duration
			effect.duration = xml.attr('amount');
			
			return effect;
		}
	},
	
	MeleeTarget:
	{
		id: genId(),
		selector: 'targetHitEffectBuff',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.MeleeTarget;
			
			return effect;
		}
	},
	
	CrossbowTarget:
	{
		id: genId(),
		selector: 'crossbowShotBuff',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.CrossbowTarget;
			
			return effect;
		}
	},
	
	ThrownTarget:
	{
		id: genId(),
		selector: 'thrownBuff',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.ThrownTarget;
			
			return effect;
		}
	},
	
	KillTarget:
	{
		id: genId(),
		selector: 'targetKillBuff',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.KillTarget;
			
			return effect;
		}
	},
	
	MeleeSelf:
	{
		id: genId(),
		selector: 'playerHitEffectBuff',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.spells = [ xml.attr('name') ];
			effect.trigger = Dredmor.Spell.Trigger.MeleeSelf;
			
			return effect;
		}
	},

	// Life and Mana -------------------------------------------------------
	
	RecoverLife:
	{
		id: genId(),
		selector: 'effect[type="heal"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Heals';
			
			// Stats
			effect.stats = [{
				type: Dredmor.Stat.Data.Life,
				amount: parseFloat(xml.attr('amount')),
				factor: {
					type: Dredmor.Stat.Data.MagicPower,
					amount: parseFloat(xml.attr('amountF'))
				}
			}];
			
			return effect;
		}
	},
	
	RecoverMana:
	{
		id: genId(),
		selector: 'effect[type="spellpoints"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Recovers';
			
			// Stats
			effect.stats = [{
				type: Dredmor.Stat.Data.Mana,
				amount: parseFloat(xml.attr('amount')),
				factor: {
					type: Dredmor.Stat.Data.MagicPower,
					amount: parseFloat(xml.attr('amountF'))
				}
			}];
			
			return effect;
		}
	},
	
	DrainLife:
	{
		id: genId(),
		selector: 'effect[type="drain"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Drains Life';
			
			// Stats
			effect.stats = Dredmor.Stat.ParseStats(xml);
			
			return effect;
		}
	},
	
	DrainMana:
	{
		id: genId(),
		selector: 'effect[type="drainMana"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Drains Mana';
			
			// Stats
			effect.stats = Dredmor.Stat.ParseStats(xml);
			
			// Drain Percentage
			effect.stats.push({
				type: Dredmor.Stat.Data.Mana,
				amount: 0,
				factor: {
					type: Dredmor.Stat.Data.Mana,
					amount: (parseInt(xml.attr('amount')) || 0)/100
				}
			});
			
			return effect;
		}
	},
	
	// Combat --------------------------------------------------------------
	
	Damage:
	{
		id: genId(),
		selector: 'effect[type="damage"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Damages';
			
			// Stats
			effect.stats = Dredmor.Stat.ParseStats(xml);
			
			// Additional damage for 'attack' spells
			var attack = parseInt(xml.parents('spell').attr('attack'));
			if (attack) {
				effect.stats.push({
					type: Dredmor.Stat.Data.CrushingDamage,
					amount: 0,
					factor: {
						type: Dredmor.Stat.Data.MeleePower,
						amount: attack
					}
				});
			}
			
			return effect;
		}
	},
	
	Bleed:
	{
		id: genId(),
		selector: 'effect[type="bleed"],effect[bleed="1"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Starts Bleeding';
			
			return effect;
		}
	},
	
	Knockback:
	{
		id: genId(),
		selector: 'effect[type="knock"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Knocks back';
			
			return effect;
		}
	},
	
	Shout:
	{
		id: genId(),
		selector: 'effect[type="shout"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Aggravates';
			
			return effect;
		}
	},
	
	// Status Effects ------------------------------------------------------
	
	Uncurse:
	{
		id: genId(),
		selector: 'effect[type="uncurse"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Removes Curses';
			
			return effect;
		}
	},
	
	Paralyze:
	{
		id: genId(),
		selector: 'effect[type="paralyze"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Paralyzes';
			
			// Chance
			var chance = 100/(parseInt(xml.attr('amount')) || 1);
			effect.chance = chance.toFixed(0).toString();
			
			// Duration
			effect.duration = xml.attr('turns');
			
			return effect;
		}
	},
	
	Sleep:
	{
		id: genId(),
		selector: 'effect[type="sleep"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Puts to Sleep';
			
			return effect;
		}
	},
	
	Confuse:
	{
		id: genId(),
		selector: 'effect[type="confuse"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Confuses';
			
			return effect;
		}
	},
	
	Charm:
	{
		id: genId(),
		selector: 'effect[type="charm"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Charms';
			
			return effect;
		}
	},
	
	Fear:
	{
		id: genId(),
		selector: 'effect[type="fear"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Scares Away';
			
			return effect;
		}
	},
	
	Pacify:
	{
		id: genId(),
		selector: 'effect[type="pacify"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Pacifies';
			
			return effect;
		}
	},
	
	Lockdown:
	{
		id: genId(),
		selector: 'effect[type="lockdown"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Prevents movement';
			
			return effect;
		}
	},
	
	Invisibility:
	{
		id: genId(),
		selector: 'invisible',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Invisibility';
			
			return effect;
		}
	},
	
	RemoveInvisibility:
	{
		id: genId(),
		selector: 'effect[type="removeinvisibility"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Removes Invisibility';
			
			return effect;
		}
	},
	
	Mute:
	{
		id: genId(),
		selector: 'mute',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Prevents Casting';
			
			return effect;
		}
	},

	Polymorph:
	{
		id: genId(),
		selector: 'polymorph',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);

			effect.name = 'Polymorph';

			// Monster Type
			effect.monster = xml.attr('name');

			return effect;
		}
	},
	
	// Teleporting ---------------------------------------------------------
	
	Teleport:
	{
		id: genId(),
		selector: 'effect[type="teleport"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Teleports';
			
			return effect;
		}
	},
	
	Blink:
	{
		id: genId(),
		selector: 'effect[type="blink"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Randomly Teleports';
			
			return effect;
		}
	},
	
	TargetBlink:
	{
		id: genId(),
		selector: 'effect[type="targetblink"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Randomly Teleports';
			
			return effect;
		}
	},
	
	Displace:
	{
		id: genId(),
		selector: 'effect[type="displace"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Displaces';
			
			return effect;
		}
	},
	
	// Spawning ------------------------------------------------------------
	
	Spawn:
	{
		id: genId(),
		selector: 'effect[type="spawn"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Spawns an Item';
			
			// Items
			effect.items = [ xml.attr('itemname') ];
			
			return effect;
		}
	},
	
	SpawnItemFromList:
	{
		id: genId(),
		selector: 'effect[type="spawnitemfromlist"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Spawns an Item'
			
			// Items
			effect.items = [];
			
			xml.find('option').each(function() {
				effect.items.push($(this).attr('name'));
			});
			
			return effect;
		}
	},
	
	SpawnItemAtLocation:
	{
		id: genId(),
		selector: 'effect[type="spawnitematlocation"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Spawns an Item on tile';

			// Items
			effect.items = [ xml.attr('itemname') ];
			
			return effect;
		}
	},
	
	Summon:
	{
		id: genId(),
		selector: 'effect[type="summon"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Summons';
			
			// Quantity
			effect.quantity = xml.attr('amount') || 1;
			
			// Monster Type
			effect.monster = xml.attr('monsterType');
			
			return effect;
		}
	},
	
	Resurrection:
	{
		id: genId(),
		selector: 'effect[type="resurrection"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Resurrects a Monster';
			
			return effect;
		}
	},
	
	// Artifacts -----------------------------------------------------------
	
	Corrupt:
	{
		id: genId(),
		selector: 'effect[type="corrupt"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Corrupts Artifacts';
			
			return effect;
		}
	},
	
	SacrificeArtifact:
	{
		id: genId(),
		selector: 'effect[type="sacrificeartifact"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Sacrifices an Artifact';
			
			return effect;
		}
	},
	
	RandomizeArtifact:
	{
		id: genId(),
		selector: 'effect[type="randomizeartifact"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Randomizes an Artifact';
			
			return effect;
		}
	},
	
	CleanseArtifact:
	{
		id: genId(),
		selector: 'effect[type="cleanseartifact"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Cleanses Corruption from an Artifact';
			
			return effect;
		}
	},
	
	// Burglary ------------------------------------------------------------
	
	VendingMachineSteal:
	{
		id: genId(),
		selector: 'effect[type="vendingmachinesteal"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Steals from a Vending Machine';
			
			return effect;
		}
	},
	
	StealItem:
	{
		id: genId(),
		selector: 'effect[type="stealitem"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Steals from Brax';
			
			return effect;
		}
	},
	
	// Dungeon Renovation --------------------------------------------------

	Dig:
	{
		id: genId(),
		selector: 'effect[type="dig"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Destroys Walls';
			
			return effect;
		}
	},
	
	Create:
	{
		id: genId(),
		selector: 'effect[type="create"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Creates a Wall';
			effect.duration = xml.attr('turns');
			
			return effect;
		}
	},
	
	// Misc ----------------------------------------------------------------

	RechargeAnvil:
	{
		id: genId(),
		selector: 'effect[type="rechargeanvil"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			effect.name = 'Recharges an Anvil of Krong';
			
			return effect;
		}
	},
	
	GrantXP:
	{
		id: genId(),
		selector: 'effect[type="grantxp"]',
		Parse: function(xml)
		{
			var effect = Dredmor.Spell.Effect.GenericEffect.Parse(xml);
			
			// Description
			effect.name = 'Grants XP';
			
			// Stats
			effect.stats = [{
				type: Dredmor.Stat.Data.XP,
				amount: xml.attr('amount')
			}];
			
			return effect;
		}
	},
	
	GenericEffect:
	{
		id: genId(),
		selector: '',
		Parse: function(xml)
		{
			var effect = {};
			
			// Chance
			var chance = xml.attr('percent');
			chance = chance ? chance : xml.attr('percentage');
			
			if (chance != '100') {
				effect.chance = chance;
			}
			
			// Affects Caster
			effect.affectsCaster = (xml.attr('affectscaster') == '1' || xml.attr('affectsCaster') == '1');
			
			// Self
			effect.self = (xml.attr('self') == '1');
			
			// Burn
			effect.burn = (xml.attr('burn') == '1');
			
			// Unresistable
			effect.unresistable = (xml.attr('resistable') == '0');
			
			// Monster Taxonomy
			effect.monsterTaxonomy = xml.attr('taxa');
			
			return effect;
		}
	}
}