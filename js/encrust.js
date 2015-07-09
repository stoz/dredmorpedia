/*******************************************************************************
** Encrust
**
** The encrusting recipes.
*******************************************************************************/

Dredmor.Encrust = {};

/**
** Encrust Data
**
** An array of [Encrust Entry]
**
** A [Encrust Entry] is of the form:
**     tool:		(Dredmor.Craft.Tool)		Encrusting tool
**     encrusts:	(Array<[Parsed Encrust]>)	Array of encrusts for the given tool
**
** A [Parsed Encrust] is of the form:
**     tool:		(Dredmor.Craft.Tool)				Tool for this craft
**     inputs:		(Array<[Parsed Encrust Component]>)	Array of input crafting components for this craft 
**     outputs:		(Array<[Parsed Encrust Component]>)	Array of output crafting components for this craft
** 
** A [Parsed Encrust Component] is of the form:
**     craft:		([Parsed Encrust])				The craft that this component belongs to
**     item:		(String)						Name of Item that is an output
**     amount:		(Integer)						Amount of the item that is produced (if this is an output component)
**     stats:		(Array<[Parsed Stat]>)			Required stats for this craft (if this is an output component)
*/
Dredmor.Encrust.Data = [];

/*
** Encrust Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Encrust.Section = Dredmor.Section.Add({
	Name: 'Encrusts',

	Parse: function(source, callback)
	{
		// Get the craft data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'encrustDB.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse craft XML
				Dredmor.Encrust.Parse(source, xml);
				
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
		// Transform the data for displaying
		var data = [];
		var indexMap = {};
		
		for (var i = 0; i < Dredmor.Encrust.Data.length; i++) {
			var craft = Dredmor.Encrust.Data[i];

			// Find the index for our data
			var j = craft.tool.id;
			indexMap[j] = indexMap[j] || data.length + 1;
			var index = indexMap[j] - 1;

			// Store in display data
			data[index] = data[index] || {};
			data[index].tool = data[index].tool || craft.tool;
			data[index].encrusts = data[index].encrusts || [];
			data[index].encrusts.push(craft);
		}

		// Sort the display data
		data.sort(function(a,b) { return a.tool.id - b.tool.id });
		for (var i = 0; i < data.length; i++) {
			data[i].encrusts.sort(Dredmor.Helper.SortBySource);
		}

		// Render the encrusts types to build the tabs
		$('#craft').find('.tabs').html(
			$('#craftTabsTemplate').render(data)
		);
		
		// Render items to build the content
		$('#craft').find('.content').empty();

		for (var i = 0; i < data.length; i++) {
			Dredmor.Helper.Queue(i, function(i) {
				$('#craft').find('.content').append(
					$('#craftContentTemplate').render(data[i])
				);
			});
			
		}
		
		// Apply Tabs (with queuing)
		Dredmor.Helper.Queue(null, function() {
			$('#craft').tabs();
		});
	}
});

/**
** Encrust Parse
**
** Parses the given XML to build the Encrust data.
*/
Dredmor.Encrust.Parse = function(source, xml)
{
	// Wrap xml object in jQuery
	xml = $(xml);
	
	// Find each craft entry and parse it
	xml.find('craft').each(function(xmlIndex, xmlItem) {
		// Wrap xml object in jQuery
		xmlItem = $(xmlItem);
		
		// Parse craft and build object
		var craft = new Dredmor.Object(source);
		
		// Tool
		var tag = xmlItem.children('tool').attr('tag');
		craft.tool = Dredmor.Encrust.LookupTool(tag);

		// Hidden
		craft.hidden = (xmlItem.attr('hidden') == 1);
		
		// Inputs ----------------------------------------------------------
		craft.inputs = [];
		
		xmlItem.children('input').each(function() {
			// Build input
			var input = {};

			input.craft = craft;
			input.item = $(this).attr('name');

			// Add to inputs
			craft.inputs.push(input);
		});
		
		// Outputs ---------------------------------------------------------
		craft.outputs = [];
		
		xmlItem.children('output').each(function() {
			// Build output
			var output = {};
			
			output.craft = craft;
			output.item = $(this).attr('name');
			output.amount = parseInt($(this).attr('amount')) || 1;

			// Stats
			output.stats = [];

			for (var i in craft.tool.statTypes) {
				// Build stat
				var stat = {};

				stat.type = craft.tool.statTypes[i];
				stat.amount = parseInt($(this).attr('skill'));
				
				output.stats.push(stat);
			}
			
			// Add to outputs
			craft.outputs.push(output);
		});

		// Insert into data
		Dredmor.Encrust.Data.push(craft);
	});
}

/**
** LookupTool
**
** Looks up the crafting tool with the given tag.
*/
Dredmor.Encrust.LookupTool = function(tag)
{
	// Initialise
	if (!Dredmor.Encrust.LookupTool.Initialised) {
		Dredmor.Encrust.LookupTool.Initialised = true;

		// Build map
		var map = {};

		for (var i in Dredmor.Encrust.Tool) {
			var tool = Dredmor.Encrust.Tool[i];

			map[tool.tag] = tool;
		}

		Dredmor.Encrust.LookupTool.map = map;
	}

	// Lookup
	return Dredmor.Encrust.LookupTool.map[tag];
}

/**
** Encrust Tools
**
** Tools that are used to perform Encrusts.
*/
Dredmor.Encrust.Tool =
{
	Lathe:
	{
		id: genId(),
		name: 'n-Dimensional Lathe',
		tag: 'lathe',
		statTypes: [Dredmor.Stat.Data.WandEncrusting],
		toolIcon: 'tool_n-dimensional_lathe'
	},

	Grinder:
	{
		id: genId(),
		name: 'Elven Ingot Grinder',
		tag: 'grinder',	
		statTypes: [Dredmor.Stat.Data.Alchemy, Dredmor.Stat.Data.Tinkering],
		toolIcon: 'tool_grinder'
	},

	Alchemy:
	{
		id: genId(),
		name: 'Modular Alchemy Box',
		tag: 'alchemy',	
		statTypes: [Dredmor.Stat.Data.Alchemy],
		toolIcon: 'tool_alchemy_kit'
	},

	Still:
	{
		id: genId(),
		name: 'Porta-Still',
		tag: 'still',	
		statTypes: [Dredmor.Stat.Data.Alchemy],
		toolIcon: 'tool_distilling_kit'
	},

	Ingot:
	{
		id: genId(),
		name: 'Disposable Ingot Press',
		tag: 'ingot',	
		statTypes: [Dredmor.Stat.Data.Smithing, Dredmor.Stat.Data.Tinkering],
		toolIcon: 'tool_ingot_press'
	},

	Smithing:
	{
		id: genId(),
		name: 'My Little Anvil Junior Smithing Kit',
		tag: 'smithing',
		statTypes: [Dredmor.Stat.Data.Smithing],
		toolIcon: 'tool_travel_anvil'
	},

	Tinkerer:
	{
		id: genId(),
		name: 'Tinkerer Parts',
		tag: 'tinkerer',
		statTypes: [Dredmor.Stat.Data.Tinkering],	
		toolIcon: 'tool_tinkerer_kit'
	}
};