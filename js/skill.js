/*******************************************************************************
** Skill
**
** The skills that determine what sort of Hero you are.
*******************************************************************************/

Dredmor.Skill = {};

/**
** Skill Data
**
** An array of [Parsed Skill]
**
** A [Parsed Skill] is of the form:
**     name:		(String)					Name
**     description:	(String)					Description
**     iconFile:	(String)					Path of icon file from Dredmor's base directory
**     archetype:	(Dredmor.Skill.Archetype)	Skill Archetype (e.g. Warrior)
**     loadouts:	(Array<[Parsed Loadout]>)	Array of loadouts for the given skill
**     abilities:	(Array<[Parsed Ability]>)	Array of abilities for the given skill
**
** A [Parsed Loadout] is of the form:
**     item:		([Parsed Item])				Item you start with
**     amount:		(String)					Amount of the item you start with
**     always:		(Boolean)					Whether or not you always start with this loadout
** 
** A [Parsed Ability] is of the form:
**     name:			(String)						Name
**     description:		(String)						Description
**     iconFile:		(String)						Path of icon file from Dredmor's base directory
**     stats:			(Array<[Parsed Stat]>)			Stats that the ability gives you
**     spellTriggers:	(Array<[Parsed Spell Trigger])	Spells that the ability gives you
*/
Dredmor.Skill.Data = [];

/*
** Skill Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Skill.Section = Dredmor.Section.Add({
	Name: 'Skills',

	Parse: function(source, callback)
	{
		// Get the skill data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'skillDB.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse XML
				Dredmor.Skill.Parse(source, xml);
					
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
		// TODO: Link with spells
	},
	
	Render: function()
	{
		// Sort the data
		Dredmor.Skill.Data.sort(Dredmor.Helper.SortBySource);

		// Render the crafts types to build the tabs
		$('#skill').find('.tabs').html(
			$('#skillTabsTemplate').render(Dredmor.Skill.Data)
		);
		
		// Render items to build the content
		$('#skill').find('.content').html(
			$('#skillContentTemplate').render(Dredmor.Skill.Data)
		);
		
		// Apply Tabs (with queuing)
		Dredmor.Helper.Queue(null, function() {
			$('#skill').tabs();
		});
	}
});

/**
** Parse
**
** Parses skillDB.xml.
*/
Dredmor.Skill.Parse = function(source, xml)
{
	// Wrap xml object in jQuery
	xml = $(xml);
	
	// Find each skill and parse it
	xml.find('skill').each(function() {
		// Wrap xml object in jQuery
		xmlSkill = $(this);

		// Add to queue to be parsed later
		Dredmor.Helper.Queue(xmlSkill, function(xmlSkill) {
			// Parse skill and build object
			var skill = new Dredmor.Object(source);
			
			// General
			skill.name = xmlSkill.attr('name');
			skill.description = xmlSkill.attr('description');
			skill.iconFile = Dredmor.Helper.GetPath(source, xmlSkill.find('art').attr('icon'));
			
			// Archetype
			for (var i in Dredmor.Skill.Archetype) {
				var archetype = Dredmor.Skill.Archetype[i];
				
				if (archetype.type == xmlSkill.attr('type')) {
					skill.archetype = archetype;
					break;
				}
			}
			
			// Loadout
			skill.loadouts = [];
			
			xmlSkill.find('loadout').each(function() {
				var loadout = {};
				
				// Always
				loadout.always = $(this).attr('always') ? true : false;
				
				// Amount
				var amount = $(this).attr('amount');
				loadout.amount = amount ? amount : '1';
				
				// Try to find the item
				var itemName = $(this).attr('subtype');
				
				if (itemName) {
					loadout.item = itemName;
				} else {
					loadout.itemType = $(this).attr('type');
				}
				
				skill.loadouts.push(loadout);
			});
			
			// Abilities
			skill.abilities = [];
			
			// Find each ability and parse it
			xmlSkill.parent().find('ability').each(function() {
				// Wrap xml object in jQuery
				xmlAbility = $(this);
				
				// Check if this ability matches our skill
				if (xmlAbility.attr('skill') == xmlSkill.attr('id')) {
					// Parse ability and build object
					var ability = new Dredmor.Object();
					
					// General ------------------------------------------------
					ability.name = xmlAbility.attr('name');
					ability.description = xmlAbility.find('description').attr('text');
					ability.iconFile = Dredmor.Helper.GetPath(source, xmlAbility.attr('icon'));
					
					// Effects ------------------------------------------------
					ability.effects = [];
					
					// Stats
					ability.effects.push({
						stats: Dredmor.Stat.ParseStats(xmlAbility)
					});
					
					// Spells
					Dredmor.Helper.ParseSpellEffects(ability.effects, xmlAbility);
					
					// Add to skill's ability list
					skill.abilities.push(ability);
				}
			});
			
			// Insert into data
			Dredmor.Skill.Data.push(skill);
		});
	});
}
	
/**
** Archetype
**
** The skill archetypes.
*/
Dredmor.Skill.Archetype =
{
	Warrior:	{ id: genId(),	type: 'warrior',	name: 'Warrior'	},
	Rogue:		{ id: genId(),	type: 'rogue',		name: 'Rogue'	},
	Wizard:		{ id: genId(),	type: 'wizard',		name: 'Wizard'	}
}