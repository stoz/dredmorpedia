/*******************************************************************************
** Data
**
** All of the crafty recipes.
*******************************************************************************/

Dredmor.Section.Add({
	name: 'Data',
	
	Parse: function(callback)
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
		// Render the data sources
		$('#data').find('.content').html(
			$('#dataContentTemplate').render(Dredmor.Source.List)
		);
	}
});