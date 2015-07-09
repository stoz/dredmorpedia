/*******************************************************************************
** Dredmor
**
** Heart of Dredmorpedia.
*******************************************************************************/

Dredmor = {};

/**
** Initialise
**
** Initialises Dredmorpedia.
*/
Dredmor.Initialise = function()
{
	// Block the UI until we're ready
	Dredmor.Helper.BlockUI();
	
	// Initialise Tabs
	$('#page').tabs();
	$('#home').tabs();
	
	// Load our sections
	var startTime = (new Date()).getTime();

	Dredmor.Section.Load(function() {
		// Callback for when loading has finished
		console.log('Loaded in ' + ((new Date()).getTime() - startTime) + ' ms');
		
		// Initialise Hash History
		$.history.init(Dredmor.Helper.GoToHashReference);
		
		// Apply tooltips to references
		$('a.ref').each(function() {
			// Queue it
			Dredmor.Helper.Queue($(this), function(ref) {
				// Apply tooltip
				ref.tooltip({
					bodyHandler: function() {
						// Get the element we're referencing
						var element = $($(this).attr('href'));
						
						// Build HTML - checking if we need to wrap
						var html = element.html();
						
						if (element.is('tr')) {
							html = '<table><tbody><tr>' + html + '</tr></tbody></table>';
						}
						
						return html;
					},
					showURL: false
				});
			});
		});
		
		// Handle references
		$('a.ref').live('click', function() {
			// Push our container's hash onto our history stack, so we can come back to it
			var conHash = $(this).parents('.dataRow:first').attr('id');
			$.history.push(conHash);

			// Load our reference's hash
			var refHash = $(this).attr('href').replace(/^.*#/, '');
			$.history.load(refHash);
			
			return false;
		});
		
		// Done - unblock UI
		Dredmor.Helper.UnblockUI();

		// Trigger initialised event for document
		$(document).trigger('Dredmor.Initialised');
	});
}
	
/**
** Object
**
** Type for parsed Dredmor data.
*/
Dredmor.Object = function(source)
{
	// Give ourselves a unique ID
	this.id = genId();
	
	// Store our data source
	this.source = source;

	return this;
}

/**
** Object.GetHTML
**
** Finds our associated element and returns its html, or null.
*/
Dredmor.Object.prototype.GetHTML = function()
{
	// Find element
	var element = $('#' + this.id);

	// Return html
	if (element) {
		return '<table><tbody><tr>' + element.html() + '</tr></tbody></table>';
	} else {
		return null;
	}
}

/**
** ready
**
** Handler for when the document is ready.
*/
$(document).ready(Dredmor.Initialise);

/**
** Rendering Tags
**
** Tags for rendering data.
*/
$.views.tags({

	/* General ****************************************************************/
	
	/**
	** renderIcon
	**
	** Renders the given icon path.
	*/
	renderIcon: function( iconFile ) {
		var ret = '';
		
		// Determine source
		var src = iconFile || 'img/placeholder.png';
		
		// Determine classes
		var classes = 'icon';
		classes += this.props.tint ? ' tint' : '';
		
		// Build the icon HTML
		ret = '<img src="' + src + '" class="' + classes + '"';
		ret += ' onerror="Dredmor.Helper.RecoverImageError(this)"';
		ret += this.props.tint ? ' data-tint="' + this.props.tint + '"' : '';
		ret += this.props.size ? ' width="' + this.props.size + '" height="' + this.props.size + '"' : '';
		ret += '/>'

		// Link
		if (this.props.link) {
			// Link to the given id
			ret = '<a class="ref" href="#' + this.props.link + '">' + ret + '</a>';
		}

		return ret;
	},
	
	/**
	** renderNameDesc
	**
	** Renders name and description.
	*/
	renderNameDesc: function( name, description ) {
		var nameRet = '';
		var descRet = '';
		
		if (name) {
			nameRet = name;
		}
		
		if (description) {
			descRet = description;
		}
		
		nameRet = '<div class="name">' + nameRet + '</div>';
		descRet = '<div class="description">' + descRet + '</div>';
		
		return '<div class="nameDescription">' + nameRet + descRet + '</div>';
	},
	
	/**
	** renderLinkTag
	**
	** Renders a tag that links to the given data.
	*/
	renderLinkTag: function( data ) {
		var ret = '';
		
		if (data) {
			ret = '<div><a href="#' + data.id + '" title="Link to this"><img src="img/link.png" /></a></div>';
		}

		return ret;
	},
	
	/**
	** renderDataSourceTag
	**
	** Renders the tag of the given data source.
	*/
	renderDataSourceTag: function( source ) {
		var ret = '';
		
		if (source && source.tag) {
			ret = '<div><a href="' + source.href + '" title="' + source.title + '" target="_blank">' + source.tag + '</a></div>';
		}

		return ret;
	},
	
	/**
	** renderItem
	**
	** Given an item name, renders the item's icon.
	*/
	renderItem: function( itemName ) {
		var ret = '';
		
		// Get item
		var item = Dredmor.Item.Data[itemName];
		
		if (item && item.iconFile) {
			// Render icon
			ret = '<img src="' + item.iconFile + '" class="icon" onerror="Dredmor.Helper.RecoverImageError(this)" />';

			// Link
			if (this.props.link === false) {
				// Do not link
			} else if (this.props.link) {
				// Link to given id
				ret = '<a class="ref" href="#' + this.props.link + '">' + ret + '</a>';
			} else {
				// Link to our item
				ret = '<a class="ref" href="#' + item.id + '">' + ret + '</a>';
			}
		}
		
		return ret;
	},
	
	/**
	** renderSpells
	**
	** Renders an array of spell references.
	*/
	renderSpells: function( spells ) {
		var ret = '';
		
		if (spells) {
			for (var i = 0; i < spells.length; i++) {
				var spell = Dredmor.Spell.Data[spells[i]];
				
				// Confirm we have a valid spell
				if (spell) {
					// Spell Reference
					ret += '<a class="ref" href="#' + spell.id + '">' + spell.name + '</a><br />';
				} else {
					console.log('Warning: Failed to deference spell <' + spells[i] + '>');

					// Just print the spell name
					ret += spells[i];
				}
			}
		}
		
		return '<div class="spellTriggers">' + ret + '</div>';
	},
	
	/**
	** renderCheckbox
	**
	** Renders a checkbox.
	*/
	renderCheckbox: function( value ) {
		var ret = '';
		
		ret = '<img src="data/ui/panel_quest_checkbox_' + (value ? 'crossed' : 'blank') + '.png" />';
		
		if (this.label) {
			ret += this.label;
		}
		
		return '<div class="checkbox">' + ret + '</div>';
	},
	
	/* Items *****************************************************************/
	
	/**
	** renderPrice
	**
	** Renders a price.
	*/
	renderPrice: function( price ) {
		var ret = '';
		
		if (!price) {
			price = 0;
		}
		
		ret = '<img src="data/items/cash1.png" />' + price;
		
		return '<div class="price">' + ret + '</div>';
	},
	
	/**
	** renderQuality
	**
	** Renders quality stars.
	*/
	renderQuality: function( quality ) {
		var ret = '';
		
		if (quality) {
			for (var i = 0; i < 10; i++) {
				if (i < quality) {
					ret += '<img src="data/ui/quality_star_full.png" />';
				} else {
					ret += '<img src="data/ui/quality_star_empty.png" />';
				}
			}
		}
		
		return '<div class="quality">' + ret + '</div>';
	}
});