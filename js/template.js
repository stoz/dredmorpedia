/*******************************************************************************
** Template
**
** The templates that define the AOE for spells.
*******************************************************************************/

Dredmor.Template = {};

/**
** Template Data
**
** A map of the form:
**     template name -> [Parsed Template]
**
** A [Parsed Template] is of the form:
**     name:			(String)		Name
**     data:			(Array<String>)	Template Data
**     affectsPlayer:	(String)		Is the player included in the affected area?
*/
Dredmor.Template.Data = {};

/*
** Template Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Template.Section = Dredmor.Section.Add({
	Name: 'Templates',

	Parse: function(source, callback)
	{
		// Get the template data
		$.ajax({
			type: 'GET',
			url: Dredmor.Helper.GetXMLPath(source, 'manTemplateDB.xml'),
			cache: false,
			dataType: 'xml',
			success: function(xml) {
				// Parse template XML
				Dredmor.Template.Parse(source, xml);
				
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
		
		for (var i in Dredmor.Template.Data) {
			var template = Dredmor.Template.Data[i];

			data.push(template);
		}

		// Sort the data
		data.sort(Dredmor.Helper.SortBySource);

		// Render templates
		$('#template').find('.content').html(
			$('#templateContentTemplate').render(data)
		);
	}
});

/**
** Parse
**
** Parses manTemplateDB.xml.
*/
Dredmor.Template.Parse = function(source, xml)
{
	// Wrap xml object in jQuery
	xml = $(xml);
	
	// Find each template and parse it
	xml.find('template').each(function(xmlIndex, xmlTemplate) {
		// Wrap xml object in jQuery
		xmlTemplate = $(xmlTemplate);
		
		// Parse template and build object
		var template = new Dredmor.Object(source);
		
		// Name
		template.name = xmlTemplate.attr('name');
		
		// Data
		template.data = [];
		
		xmlTemplate.find('row').each(function() {
			template.data.push($(this).attr('text'));
		});
		
		// Affects anchor
		template.affectsAnchor = (xmlTemplate.attr('affectsPlayer') == '1');
		
		// Insert into data
		Dredmor.Template.Data[template.name] = template;
	});
}

/**
** Rendering Tags
**
** Tags for rendering data.
*/
$.views.tags({

	/**
	** renderTemplate
	**
	** Renders a (parsed) template.
	*/
	renderTemplate: function( templateName, anchorPlayer ) {
		var ret = '';
		
		if (templateName) {
			var template = Dredmor.Template.Data[templateName];
			
			for (var i in template.data) {
				var row = template.data[i];
				
				// Replace characters in row with their representations
				row = row.replace(/\./g, '<span class="empty"></span>');
				row = row.replace(/@/g,  '<span class="fill"></span>');
				
				// Determine classes for anchor
				var anchorClass = anchorPlayer ? 'anchorPlayer' : 'anchorTarget';
				
				if (template.affectsAnchor) {
					anchorClass += ' fill';
				}
				
				// Replace anchor characters
				row = row.replace(/#/g,  '<span class="' + anchorClass + '"></span>');

				// Finish row
				ret += row + '<br />';
			}
		}
		
		return '<div class="template">' + ret + '</div>';
	}

});