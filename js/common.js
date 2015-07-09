/**
** Common
**
** Common functions, data and such.
*/

/**
** genId
**
** Returns a unique id.
*/
function genId() {
	if (!genId.next) {
		genId.next = 1;
	}
	return genId.next++;
}

/**
** Rendering Tags
**
** Tags for rendering data.
*/
$.views.tags({

	/**
	** first
	**
	** Renders the first element of the given list.
	*/
	first: function(list)
	{
		return this.tmpl.render( list[0] );
	},

	/**
	** renderJustInTime
	**
	** Compiles the given template string and uses it to render the result of the given data function.
	*/
	renderJustInTime: function(dataFunc, templateString)
	{
		// Compile
		$.templates('dataTemplate', {
			markup: templateString,
			layout: true
		});

		// Render
		return $.render['dataTemplate']( dataFunc() );
	}
});

/**
** Rendering Helpers
**
** Helper functions for rendering data.
*/
$.views.helpers({

	/**
	** cookie
	**
	** Returns the value of the cookie with the given name.
	*/
	cookie: function(name)
	{
		return $.cookie(name);
	}
});