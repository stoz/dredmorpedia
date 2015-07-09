/*******************************************************************************
** Monster
**
** All of the creepy critters that inhabit the dungeon.
*******************************************************************************/

Dredmor.Monster = {};

/**
** Monster Data
**
** A map of the form:
**     monster name -> [Parsed Monster]
**
** A [Parsed Monster] is of the form:
**     name:			(String)						Name
**     taxonomy:		(Dredmor.Monster.Type)			Type of monster
**     iconFile:		(String)						Path of icon file from Dredmor's base directory
**     description:		(String)						Description
**     price:			(Integer)						Price
**     quality:			(Integer)						Quality (# of stars in-game)
**     spellTriggers:	(Array<[Parsed Spell Trigger]>)	Array of spell triggers for this monster
**     bonusStats:		(Array<[Parsed Stat]>)			Array of this monster's bonus stats (i.e. the human defined stats)
**     totalStats:		(Array<[Parsed Stat]>)			Array of this monster's total stats (including bonus)
**
** A [Parsed Spell Trigger] is of the form:
**     spell:		([Parsed Spell])				Spell (see Spell Data)
**     delay:		(String)						Delay before spell is triggered, as a String
**     amount:		(String)						Number of turns the spell is triggered on, as a String (for DOTs)
**     chance:		(String)						Probability of this spell being triggered, as a String
**     trigger:		(Dredmor.Spell.Trigger)			How the spell is triggered (e.g. On Use)
** 
** A [Parsed Stat] is of the form:
**     type:		(Dredmor.Stat)			Type of Stat (e.g. Burliness)
**     amount:		(String)				Value of Stat
**     factor:		([Parsed Stat Factor])	Factor that should be added to our value (typically magic power)
**     minimum:		(String)				Minimum value of the stat (after applying the factor)
**
** A [Parsed Stat Factor] is of the form:
**     type:		(Dredmor.Stat)			Type of Stat (e.g. Burliness)
**     amount:		(String)				Value of Stat
**     negative:	(Boolean)				Is this factor subtracted from the main stat's value?
*/
Dredmor.Monster.Data = {};

/*
** Monster Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Monster.Section = Dredmor.Section.Add({
	Name: 'Monsters',

	Parse: function(source, callback)
	{
		// Get the monster data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'monDB.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse monster XML
				Dredmor.Monster.Parse(source, xml);
					
				// Parsing complete!
				callback();
			},
			error: function() {
				// Parsing complete!
				callback();
			}
		});
	},
	
	Link: function()
	{
		// Nothing to link
	},
	
	Render: function()
	{
		// Transform data for displaying
		var data = [];
		var indexMap = {};
		
		for (var i in Dredmor.Monster.Data) {
			var monster = Dredmor.Monster.Data[i];

			// Find the index for our display data
			var j = monster.category.id;
			indexMap[j] = indexMap[j] || data.length + 1;
			var index = indexMap[j] - 1;

			// Store in display data
			data[index] = data[index] || {};
			data[index].category = data[index].category || monster.category;
			data[index].monsters = data[index].monsters || [];
			data[index].monsters.push(monster);
		}

		// Sort the display data
		data.sort(function(a,b) { return a.category.id - b.category.id });
		for (var i = 0; i < data.length; i++) {
			data[i].monsters.sort(Dredmor.Helper.SortBySource);
		}

		// Render the monster types to build the tabs
		$('#monster').find('.tabs').html(
			$('#monsterTabsTemplate').render(data)
		);
		
		// Render monsters to build the content
		$('#monster').find('.content').html(
			$('#monsterContentTemplate').render(data)
		);
		
		// Apply Tabs (with queuing)
		Dredmor.Helper.Queue(null, function() {
			$('#monster').tabs();
		});
	}
});

/**
** Parse
**
** Parses monDB.xml.
*/
Dredmor.Monster.Parse = function(source, xml)
{
	// Wrap xml object in jQuery
	xml = $(xml);
	
	// Find each monster entry and parse it
	xml.find('monster').each(function(xmlIndex, xmlMonster) {
		// Wrap xml object in jQuery
		xmlMonster = $(xmlMonster);
		
		// Parse the monster
		var monster = Dredmor.Monster.ParseMonster(source, xmlMonster);
		
		// Update our data
		Dredmor.Monster.Data[monster.name] = monster;
	});
}

/**
** Parse Monster
**
** Parses an XML <monster />.
*/
Dredmor.Monster.ParseMonster = function(source, xmlMonster)
{
	// Parse XML and build monster
	var monster = new Dredmor.Object(source);
	
	// Look up our parent monster (if it exists)
	var parentMonster = {};
	xmlMonster.parent('monster').each(function() {
		parentMonster = Dredmor.Monster.Data[$(this).attr('name')];
	});
	
	// General - may come from parent
	monster.name = xmlMonster.attr('name') || parentMonster.name;
	monster.description = xmlMonster.children('info').attr('text') || parentMonster.description;
	monster.taxonomy = xmlMonster.attr('taxa') || parentMonster.taxonomy;

	// Depth - may come from parent
	monster.depth = parseInt(xmlMonster.attr('level')) + 1 || parentMonster.depth;

	// Category - based on depth
	monster.category = Dredmor.Monster.Category.Unknown;

	for (var key in Dredmor.Monster.Category) {
		var category = Dredmor.Monster.Category[key];

		if (monster.depth === category.depth) {
			monster.category = category;
		}
	}

	if (xmlMonster.attr('special') === '1') {
		// Special monsters are in a special category, regardless of depth
		monster.category = Dredmor.Monster.Category.Special;
	}

	
	// Icon - may come from parent
	monster.iconFile = Dredmor.Helper.GetPath(source, xmlMonster.children('idleSprite').attr('down')) || parentMonster.iconFile;
	monster.iconTint = xmlMonster.children('palette').attr('tint') || parentMonster.iconTint;
	
	// Hack to change .spr/.xml into .png paths
	if (monster.iconFile && monster.iconFile.match(/(spr|xml)$/)) {
		monster.iconFile = monster.iconFile.substr(0, monster.iconFile.length - 4);
		monster.iconFile += '_00.png';
	}
	
	// Level
	var stats = xmlMonster.children('stats');
	var numFig = parseInt(stats.attr('numFig'));
	var numRog = parseInt(stats.attr('numRog'));
	var numWiz = parseInt(stats.attr('numWiz'));
	
	monster.warLevel = numFig || 0;
	monster.rogLevel = numRog || 0;
	monster.wizLevel = numWiz || 0;
	
	// Effects -------------------------------------------------------------
	monster.effects = [];

	// Stats - Bonus

	// Parse our bonus stats
	monster.bonusStats = Dredmor.Stat.ParseStats(xmlMonster);

	// Inherit parent bonus stats
	monster.bonusStats = Dredmor.Stat.InheritStats(monster.bonusStats, parentMonster.bonusStats);

	// Add effect
	monster.effects.push({
		name: 'Bonus Stats',
		stats: monster.bonusStats
	});

	// Stats - Total

	// Calculate our level stats
	monster.totalStats = Dredmor.Stat.CalculateLevelStats(monster.warLevel, monster.rogLevel, monster.wizLevel);

	// Merge our bonus stats
	monster.totalStats = Dredmor.Stat.MergeStats(monster.bonusStats, monster.totalStats);

	// Add effect
	monster.effects.push({
		name: 'Total Stats',
		stats: monster.totalStats
	});

	// Spells - On Hit
	xmlMonster.children('onhit').each(function() {
		// Spell name
		var spellName = $(this).attr('spell');

		// Convert 'one chance in' to a percent string
		var chance = 100/(parseInt($(this).attr('onechancein')) || 1);
		chance = chance.toFixed(0).toString();

		// Add effect
		monster.effects.push({
			spells: [
				spellName
			],
			chance: chance,
			trigger: Dredmor.Spell.Trigger.MonsterHit
		});
	});

	// Spells - Casting
	monster.spellChance = xmlMonster.children('ai').attr('spellPercentage') || parentMonster.spellChance;
	monster.spellChance = xmlMonster.children('ai').attr('spellpercentage') || monster.spellChance;

	xmlMonster.children('spell').each(function() {
		// Spell name
		var spellName = $(this).attr('name');

		// Add effect
		monster.effects.push({
			spells: [
				spellName
			],
			chance: monster.spellChance,
			trigger: Dredmor.Spell.Trigger.MonsterAware
		});
	});

	// Drops
	xmlMonster.children('drop').each(function() {
		monster.effects.push({
			name: 'Drops an Item on Death',
			chance: $(this).attr('percent') || '100',
			items: [ $(this).attr('name') ]
		});
	});
	
	return monster;
}

/**
** Monster Category
**
** Set of monster categories.
*/
Dredmor.Monster.Category =
{
	Special:
	{
		id: genId(),
		name: 'Special',
		description: 'Special Monsters that do not spawn normally'
	},
	Level1:
	{
		id: genId(),
		name: '1',
		depth: 1,
		description: 'Dungeon Level 1'
	},
	Level2:
	{
		id: genId(),
		name: '2',
		depth: 2,
		description: 'Dungeon Level 2'
	},
	Level3:
	{
		id: genId(),
		name: '3',
		depth: 3,
		description: 'Dungeon Level 3'
	},
	Level4:
	{
		id: genId(),
		name: '4',
		depth: 4,
		description: 'Dungeon Level 4'
	},
	Level5:
	{
		id: genId(),
		name: '5',
		depth: 5,
		description: 'Dungeon Level 5'
	},
	Level6:
	{
		id: genId(),
		name: '6',
		depth: 6,
		description: 'Dungeon Level 6'
	},
	Level7:
	{
		id: genId(),
		name: '7',
		depth: 7,
		description: 'Dungeon Level 7'
	},
	Level8:
	{
		id: genId(),
		name: '8',
		depth: 8,
		description: 'Dungeon Level 8'
	},
	Level9:
	{
		id: genId(),
		name: '9',
		depth: 9,
		description: 'Dungeon Level 9'
	},
	Level10:
	{
		id: genId(),
		name: '10',
		depth: 10,
		description: 'Dungeon Level 10'
	},
	Level11:
	{
		id: genId(),
		name: '11',
		depth: 11,
		description: 'Dungeon Level 11'
	},
	Level12:
	{
		id: genId(),
		name: '12',
		depth: 12,
		description: 'Dungeon Level 12'
	},
	Level13:
	{
		id: genId(),
		name: '13',
		depth: 13,
		description: 'Dungeon Level 13'
	},
	Level14:
	{
		id: genId(),
		name: '14',
		depth: 14,
		description: 'Dungeon Level 14'
	},
	Level15:
	{
		id: genId(),
		name: '15',
		depth: 15,
		description: 'Dungeon Level 15'
	},
	Unknown:
	{
		id: genId(),
		name: '?',
		description: 'Unknown'
	}
}

/**
** Rendering Tags
**
** Tags for rendering data.
*/
$.views.tags({
	
	/**
	** derefMonster
	**
	** Dereferences a monster.
	*/
	derefMonster: function( monsterName )
	{
		var monster = Dredmor.Monster.Data[monsterName];

		return this.tmpl.render( monster, this.tmpl );
	}
});

/*
** Dredmor.Initialised
**
** When the Dredmorpedia has initialised.
*/
$(document).bind('Dredmor.Initialised', function() {
	// Tint images
	$('img.tint').each(function() {
		// Queue it
		Dredmor.Helper.Queue($(this), function(image) {
			// Give ourselves a unique id
			var id = genId();
			image.attr('id', 'tintedImage' + id);
			
			// Parse our tint (converting from [-180, 180] to [0, 100])
			var tint = parseInt(image.data('tint'));
			tint = tint < 0 ? tint + 360 : tint;
			tint = tint/360*100;
			
			// Apply our tint
			Caman('#tintedImage' + id, function() {
				this.hue(tint).render();
			});
		});
	});
});