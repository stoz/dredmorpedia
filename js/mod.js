/*******************************************************************************
** Mod
**
** User-created mods.
*******************************************************************************/

Dredmor.Mod = {};

/**
** Mod Data
**
** A map of the form:
**     mod directory name -> [Parsed Mod]
**
** A [Parsed Mod] is of the form:
**     name:			(String)		Name
**     revision:		(String)		Revision
**     author:			(String)		Author
**     description:		(String)		Description
*/
Dredmor.Mod.Data = [];

/*
** Mod Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Mod.Section = Dredmor.Section.Add({
	Name: 'Mods',

	UseAllSources: true,

	Parse: function(source, callback)
	{
		// Get the mod data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'mod.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse the mod data
				var xmlMod = $(xml).find('dredmormod');

				// Build mod
				var mod = new Dredmor.Object(source);

				mod.name = xmlMod.find('name').attr('text');
				mod.revision = xmlMod.find('revision').attr('text');
				mod.author = xmlMod.find('author').attr('text');
				mod.description = xmlMod.find('description').attr('text');

				// Add to data
				Dredmor.Mod.Data.push(mod);
				
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
		// Render the mods
		$('#mod').find('.content').html(
			$('#modContentTemplate').render(Dredmor.Mod.Data)
		);
	}
});

/*
** Dredmor.Initialised
**
** When the Dredmorpedia has initialised.
*/
$(document).bind('Dredmor.Initialised', function() {
	// Set initial checkbox values
	$('#mod').find('input').each(function() {
		// Get our source
		var source = Dredmor.Mod.Data[$(this).data('index')].source;

		// Check ourselves if our source is active (or required)
		this.checked = source.active || source.required;

		// Disable ourselves if our source is required
		$(this).prop('disabled', source.required);
	});
	
	// Set up apply button
	$('#modApply').click(function() {
		// Save our checkbox values as cookies
		$('#mod').find('input').each(function() {
			// Get our source
			var source = Dredmor.Mod.Data[$(this).data('index')].source;

			// Set cookie
			$.cookie(source.dir, this.checked ? 'active' : '');
		});

		// Restart the page
		window.location.reload();
	});
});