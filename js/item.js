/*******************************************************************************
** Item
**
** All of the items you can find in the dungeon.
*******************************************************************************/

Dredmor.Item = {};

/**
** Item Data
**
** A map of the form:
**     item name -> [Parsed Item]
**
** A [Parsed Item] is of the form:
**     name:			(String)						Name
**     type:			(Dredmor.Item.Type)				Type of item
**     iconFile:		(String)						Path of icon file from Dredmor's base directory
**     description:		(String)						Description
**     price:			(Integer)						Price
**     quality:			(Integer)						Quality (# of stars in-game)
**     spellTriggers:	(Array<[Parsed Spell Trigger]>)	Array of spell triggers for this item
**     effects:			(Array<[Parsed Effect]>)		Array of effects for this item
**     inputCrafts:		(Array<[Parsed Craft]>)			Array of crafts that this item is an input for
**     outputCrafts:	(Array<[Parsed Craft]>)			Array of crafts that this item is an output for
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
Dredmor.Item.Data = {};

/*
** Item Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Item.Section = Dredmor.Section.Add({
	Name: 'Items',

	Parse: function(source, callback)
	{
		// Get the item data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'itemDB.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse item XML
				Dredmor.Item.Parse(source, xml);
					
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
		// Link with Craft -----------------------------------------------------
		for (var i = 0; i < Dredmor.Craft.Data.length; i++) {
			var craft = Dredmor.Craft.Data[i];

			// Link inputs
			for (var j = 0; j < craft.inputs.length; j++) {
				var input = craft.inputs[j];
				var item = Dredmor.Item.Data[input.item];

				if (item) {
					if (item.inputCrafts.indexOf(craft) == -1) {
						item.inputCrafts.push(craft);
					}
				}
			}

			// Link outputs
			for (var j = 0; j < craft.outputs.length; j++) {
				var output = craft.outputs[j];
				var item = Dredmor.Item.Data[output.item];

				if (item) {
					if (item.outputCrafts.indexOf(craft) == -1) {
						item.outputCrafts.push(craft);
					}
				}
			}
		}

		// Add effects for each link
		for (var key in Dredmor.Item.Data) {
			var item = Dredmor.Item.Data[key];

			if (item.inputCrafts.length) {
				item.effects.push({
					link: true,
					inputCrafts: item.inputCrafts
				});
			}

			if (item.outputCrafts.length) {
				item.effects.push({
					link: true,
					outputCrafts: item.outputCrafts
				});
			}
		}
	},
	
	Render: function()
	{
		// Transform data for displaying
		var data = [];
		var indexMap = {};
		
		for (var i in Dredmor.Item.Data) {
			var item = Dredmor.Item.Data[i];

			// Find the index for our display data
			var j = item.type.id;
			indexMap[j] = indexMap[j] || data.length + 1;
			var index = indexMap[j] - 1;

			// Store in display data
			data[index] = data[index] || {};
			data[index].type = data[index].type || item.type;
			data[index].items = data[index].items || [];
			data[index].items.push(item);
		}

		// Sort the display data
		data.sort(function(a,b) { return a.type.id - b.type.id });
		for (var i = 0; i < data.length; i++) {
			data[i].items.sort(Dredmor.Helper.SortBySource);
		}
		
		// Set icons for each of the item types, for the tabs
		for (var i = 0; i < data.length; i++) {
			data[i].type.iconFile = data[i].items[0].iconFile;
		}

		// Render the item types to build the tabs
		$('#item').find('.tabs').html(
			$('#itemTabsTemplate').render(data)
		);
		
		// Render items to build the content (with queuing)
		$('#item').find('.content').empty();

		for (var i = 0; i < data.length; i++) {
			Dredmor.Helper.Queue(i, function(i) {
				$('#item').find('.content').append(
					$('#itemContentTemplate').render(data[i])
				);
			});
		}
		
		// Apply Tabs (with queuing)
		Dredmor.Helper.Queue(null, function() {
			$('#item').tabs();
		});
	}
});

/**
** Parse
**
** Parses itemDB.xml.
*/
Dredmor.Item.Parse = function(source, xml)
{
	// Wrap xml object in jQuery
	xml = $(xml);
	
	// Find each item entry and parse it
	xml.find('item').each(function(xmlIndex, xmlItem) {
		// Wrap xml object in jQuery
		xmlItem = $(xmlItem);
		
		// Parse item
		var item;
		
		// Iterate over all our item types
		for (var key in Dredmor.Item.Type) {
			// Get the item type
			var itemType = Dredmor.Item.Type[key];
			
			// If the item type matches this xml item, use it to parse the xml item
			if (itemType.Matches(xmlItem)) {
				item = itemType.Parse(source, xmlItem);
				break;
			}
		}
		
		// Update our data
		Dredmor.Item.Data[item.name] = item;
	});
}

/**
** Type
**
** Defines attributes and parsing functions for the various types of items.
*/
Dredmor.Item.Type =
{
	Sword:
	{
		id: genId(),
		name: 'Sword Class Weapon',
		// Note: Odd case due to 'Three-Pronged Sword' not having a type in the XML
		Matches: function(xml) { return xml.find('weapon').length && (xml.attr('type') == 0 || !xml.attr('type')) },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Axe:
	{
		id: genId(),
		name: 'Axe Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 1 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Mace:
	{
		id: genId(),
		name: 'Mace Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 2 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Staff:
	{
		id: genId(),
		name: 'Staff Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 3 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Crossbow:
	{
		id: genId(),
		name: 'Crossbow Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 4 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Thrown:
	{
		id: genId(),
		name: 'Throwing Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 5 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Bolt:
	{
		id: genId(),
		name: 'Ammunition',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 6 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Dagger:
	{
		id: genId(),
		name: 'Dagger Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 7 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Polearm:
	{
		id: genId(),
		name: 'Polearm Class Weapon',
		Matches: function(xml) { return xml.find('weapon').length && xml.attr('type') == 8 },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericWeapon.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Head:
	{
		id: genId(),
		name: 'Armor (Head)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'head' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Torso:
	{
		id: genId(),
		name: 'Armor (Torso)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'chest' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Pants:
	{
		id: genId(),
		name: 'Armor (Pants)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'legs' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Gloves:
	{
		id: genId(),
		name: 'Armor (Gloves)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'hands' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Shoes:
	{
		id: genId(),
		name: 'Armor (Shoes)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'feet' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Belt:
	{
		id: genId(),
		name: 'Armor (Belt)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'waist' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Shield:
	{
		id: genId(),
		name: 'Armor (Shield)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'shield' && !xml.attr('overrideClassName') },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Ring:
	{
		id: genId(),
		name: 'Armor (Ring)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'ring' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			
			// Random Stats
			if (xml.find('armour').attr('randoms') != 0) {
				item.effects.push({
					name: 'Random Stats',
				});
			}
			
			return item;
		}
	},
	Amulet:
	{
		id: genId(),
		name: 'Armor (Amulet)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'neck' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			
			// Random Stats
			if (xml.find('armour').attr('randoms') != 0) {
				item.effects.push({
					name: 'Random Stats',
				});
			}
			
			return item;
		}
	},
	Orb:
	{
		id: genId(),
		name: 'Orb',
		Matches: function(xml) { return xml.attr('overrideClassName') === 'Orb' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Tome:
	{
		id: genId(),
		name: 'Tome',
		Matches: function(xml) { return xml.attr('overrideClassName') === 'Tome' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Food:
	{
		id: genId(),
		name: 'Food',
		Matches: function(xml) { return xml.find('food').length && xml.find('food').attr('hp') },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Food
			xml.find('food').each(function() {
				// Recovery
				item.effects.push({
					name: 'Food',
					stats: [
						{
							type: Dredmor.Stat.Data.Life,
							amount: $(this).attr('hp')
						}
					]
				});
				
				// Spell
				if ($(this).attr('effect')) {
					item.effects.push({
						link: true,
						spells: [
							$(this).attr('effect')
						],
						trigger: Dredmor.Spell.Trigger.Eaten
					});
				}
			});
			
			return item;
		}
	},
	Booze:
	{
		id: genId(),
		name: 'Booze',
		Matches: function(xml) { return xml.find('food').length && xml.find('food').attr('mp') },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Booze
			xml.find('food').each(function() {
				// Recovery
				item.effects.push({
					name: 'Booze',
					stats: [
						{
							type: Dredmor.Stat.Data.Mana,
							amount: $(this).attr('mp')
						}
					]
				});
				
				// Spell
				if ($(this).attr('effect')) {
					item.effects.push({
						link: true,
						spells: [
							$(this).attr('effect')
						],
						trigger: Dredmor.Spell.Trigger.Drunk
					});
				}
			});

			return item;
		}
	},
	Trap:
	{
		id: genId(),
		name: 'Trap',
		Matches: function(xml) { return xml.find('trap').length },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Trap
			xml.find('trap').each(function() {
				// Quality
				item.quality = $(this).attr('level');
				
				// Spell
				item.effects.push({
					link: true,
					spells: [
						$(this).attr('casts')
					],
					trigger: Dredmor.Spell.Trigger.SteppedOn
				});
			});
			
			return item;
		}
	},
	Wand:
	{
		id: genId(),
		name: 'Wand',
		Matches: function(xml) { return xml.find('wand').length },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Wand
			xml.find('wand').each(function() {
				// Charges
				item.effects.push({
					name: 'Wand',
					description: $(this).attr('mincharge') + ' - ' + $(this).attr('maxcharge') + ' charges'
				});
				
				// Spell
				item.effects.push({
					link: true,
					spells: [
						$(this).attr('spell')
					],
					trigger: Dredmor.Spell.Trigger.Zapped
				});
			});
			
			return item;
		}
	},
	Potion:
	{
		id: genId(),
		name: 'Potion',
		Matches: function(xml) { return xml.find('potion').length },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Spell
			item.effects.push({
				link: true,
				spells: [
					xml.find('potion').attr('spell')
				],
				trigger: Dredmor.Spell.Trigger.Quaffed
			});
			
			return item;
		}
	},
	Mushroom:
	{
		id: genId(),
		name: 'Mushroom',
		Matches: function(xml) { return xml.find('mushroom').length },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Spell
			item.effects.push({
				link: true,
				spells: [
					xml.find('casts').attr('spell')
				],
				trigger: Dredmor.Spell.Trigger.Munched
			});
			
			return item;
		}
	},
	Gem:
	{
		id: genId(),
		name: 'Gem',
		Matches: function(xml) { return xml.find('gem').length },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Toolkit:
	{
		id: genId(),
		name: 'Toolkit',
		Matches: function(xml) { return xml.attr('alchemical') && xml.find('toolkit').length },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Reagent:
	{
		id: genId(),
		name: 'Reagent',
		Matches: function(xml) { return xml.attr('alchemical') },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	Sleeve:
	{
		id: genId(),
		name: 'Armor (Sleeve)',
		Matches: function(xml) { return xml.find('armour').length && xml.find('armour').attr('type') == 'sleeve' },
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericArmour.Parse(source, xml);
			item.type = this;
			return item;
		}
	},
	GenericWeapon:
	{
		id: genId(),
		name: 'Weapon',
		Matches: function(xml) { return xml.find('weapon').length } ,
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Quality
			item.quality = xml.attr('level');
			
			// Weapon-specific
			xml.find('weapon').each(function() {
				// On-hit spell
				if ($(this).attr('hit')) {
					// Check if we can target the floor
					if ($(this).attr('canTargetFloor')) {
						// Target
						item.effects.push({
							name: 'Can target the floor'
						});
						
						// Recovery
						item.effects.push({
							name: 'Cannot be recovered'
						});
					}
					
					// Spell
					item.effects.push({
						link: true,
						spells: [
							$(this).attr('hit')
						],
						trigger: Dredmor.Spell.Trigger.ItemHit
					});
				}
			});

			return item;
		}
	},
	GenericArmour:
	{
		id: genId(),
		name: 'Armour',
		Matches: function(xml) { return xml.find('armour').length } ,
		Parse: function(source, xml)
		{
			var item = Dredmor.Item.Type.GenericItem.Parse(source, xml);
			item.type = this;
			
			// Quality
			item.quality = xml.find('armour').attr('level');
			
			return item;
		}
	},
	GenericItem:
	{
		id: genId(),
		name: 'Item',
		Matches: function(xml) { return true } ,
		Parse: function(source, xml)
		{
			var item = new Dredmor.Object(source);
			item.type = this;
			
			// General -----------------------------------------------------
			item.name = xml.attr('name');
			item.description = xml.find('description').attr('text');
			item.price = xml.find('price').attr('amount');
			item.quality = 0;
			item.iconFile = Dredmor.Helper.GetPath(source, xml.attr('iconFile'));

			// Crafts ------------------------------------------------------
			item.inputCrafts = [];
			item.outputCrafts = [];
			
			// Effects -----------------------------------------------------
			item.effects = [];
			
			// Stats
			var stats = Dredmor.Stat.ParseStats(xml);
			if (stats.length) {
				item.effects.push({
					stats: stats
				});
			}

			// Artifact
			$(xml).find('artifact').each(function() {
				item.effects.push({
					name: 'Artifact',
					description: 'Quality ' + $(this).attr('quality')
				});
			});
			
			// Spells
			Dredmor.Helper.ParseSpellEffects(item.effects, xml);
			
			return item;
		}
	}
}