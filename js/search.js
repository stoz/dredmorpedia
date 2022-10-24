/*******************************************************************************
** Search
**
** Find what you're lookin' for.
*******************************************************************************/

Dredmor.Search = {};

/**
** Init
**
** Initialises search.
*/
Dredmor.Search.Init = function()
{
	// Text
	Dredmor.Search.InitText();

	// Stats
	Dredmor.Search.InitStats();

	// Results
	$('#searchResults').tabs();

	$('#searchResultItemTab').hide();
	$('#searchResultCraftTab').hide();
	$('#searchResultSkillTab').hide();
	$('#searchResultSpellTab').hide();
	$('#searchResultMonsterTab').hide();
};

/**
** InitText
**
** Initialises the text search.
*/
Dredmor.Search.InitText = function()
{
	var performSearch;

	// Setup search text and link to search after the user stops typing
	var searchTimer;
	$('#searchText').keyup(function() {
		clearTimeout(searchTimer);
    	searchTimer = setTimeout(performSearch, 1000);
	});

	// Performs a text search
	performSearch = function() {
		Dredmor.Helper.BlockUI('Searching');

		// Get our search value
		var search = $('#searchText').val().toLowerCase();

		// Item ----------------------------------------------------------------
		$('#searchResultItem').empty();
		$('#searchResultItemTab').hide();

		for (var name in Dredmor.Item.Data) {
			// Check name
			if (name.toLowerCase().indexOf(search) != -1) {
				var item = Dredmor.Item.Data[name];

				$('#searchResultItem').append(item.GetHTML());
				$('#searchResultItemTab').show();
			}
		}

		// Skill ---------------------------------------------------------------
		$('#searchResultSkill').empty();
		$('#searchResultSkillTab').hide();

		for (var i = 0; i < Dredmor.Skill.Data.length; i++) {
			// Get skill
			var skill = Dredmor.Skill.Data[i];

			// Check abilities
			for (var j = 0; j < skill.abilities.length; j++) {
				// Get ability
				var ability = skill.abilities[j];

				// Check name
				if (ability.name.toLowerCase().indexOf(search) != -1) {
					$('#searchResultSkill').append(ability.GetHTML());
					$('#searchResultSkillTab').show();
				}
			}
		}

		// Spell ---------------------------------------------------------------
		$('#searchResultSpell').empty();
		$('#searchResultSpellTab').hide();

		for (var name in Dredmor.Spell.Data) {
			// Check name
			if (name.toLowerCase().indexOf(search) != -1) {
				var spell = Dredmor.Spell.Data[name];

				$('#searchResultSpell').append(spell.GetHTML());
				$('#searchResultSpellTab').show();
			}
		}

		Dredmor.Helper.UnblockUI();
	};
};

/**
** InitStats
**
** Initialises the stats search.
*/
Dredmor.Search.InitStats = function()
{
	var performSearch;

	// Add stat icons to page and link with search function
	var statCategory;

	for (var typeName in Dredmor.Stat.Data) {
		// Get the stat type and build an element for it
		var statType = Dredmor.Stat.Data[typeName];
		var statHtml = Dredmor.Stat.GetTypeImageHtml(statType);
		var statElement = $('<span>' + statHtml + '</span>');

		// Add a break when we start a new stat category
		if (statCategory != statType.category && statCategory) {
			$('#searchStats').append('<br />');
		}
		statCategory = statType.category;

		// Setup the element and add it
		statElement.click((function(statType) {
			return function() {
				performSearch(statType);
			}
		})(statType));
		$('#searchStats').append(statElement);
	}

	// Performs a stats search
	performSearch = function(statType) {
		Dredmor.Helper.BlockUI('Searching');

		// Build results
		var results;

		// Item ----------------------------------------------------------------
		$('#searchResultItem').empty();
		$('#searchResultItemTab').hide();

		// Find items that have our stat type
		var results = [];

		for (var name in Dredmor.Item.Data) {
			var item = Dredmor.Item.Data[name];

			for (var i = 0; item.effects && i < item.effects.length; i++) {
				var effect = item.effects[i];

				for (var j = 0; effect.stats && j < effect.stats.length; j++) {
					var stat = effect.stats[j];

					if (stat.type == statType) {
						results.push([stat.amount, item]);
					}
				}
			}
		}

		// Sort results by the stat amount
		results.sort(function(a, b) { return b[0] - a[0]; });

		// Populate results
		for (var i = 0; i < results.length; i++) {
			var item = results[i][1];

			$('#searchResultItem').append(item.GetHTML());
			$('#searchResultItemTab').show();
		}

		// Skill ---------------------------------------------------------------
		$('#searchResultSkill').empty();
		$('#searchResultSkillTab').hide();

		// Find skills that have our stat type
		results = [];

		for (var i = 0; i < Dredmor.Skill.Data.length; i++) {
			var skill = Dredmor.Skill.Data[i];

			for (var j = 0; j < skill.abilities.length; j++) {
				var ability = skill.abilities[j];

				for (var k = 0; ability.effects && k < ability.effects.length; k++) {
					var effect = ability.effects[k];

					for (var m = 0; effect.stats && m < effect.stats.length; m++) {
						var stat = effect.stats[m];

						if (stat.type == statType) {
							results.push([stat.amount, ability]);
						}
					}
				}
			}
		}

		// Sort results by the stat amount
		results.sort(function(a, b) { return b[0] - a[0]; });

		// Populate results
		for (var i = 0; i < results.length; i++) {
			var ability = results[i][1];

			$('#searchResultSkill').append(ability.GetHTML());
			$('#searchResultSkillTab').show();
		}

		// Spell ---------------------------------------------------------------
		$('#searchResultSpell').empty();
		$('#searchResultSpellTab').hide();

		// Find spells that have our stat type
		results = [];

		for (var name in Dredmor.Spell.Data) {
			var spell = Dredmor.Spell.Data[name];

			for (var i = 0; spell.effects && i < spell.effects.length; i++) {
				var effect = spell.effects[i];

				for (var j = 0; effect.stats && j < effect.stats.length; j++) {
					var stat = effect.stats[j];

					if (stat.type == statType) {
						results.push([stat.amount, spell]);
					}
				}
			}
		}

		// Sort results by the stat amount
		results.sort(function(a, b) { return b[0] - a[0]; });

		// Populate results
		for (var i = 0; i < results.length; i++) {
			var spell = results[i][1];

			$('#searchResultSpell').append(spell.GetHTML());
			$('#searchResultSpellTab').show();
		}

		Dredmor.Helper.UnblockUI();
	};
};

/*
** Dredmor.Initialised
**
** When the Dredmorpedia has initialised.
*/
$(document).bind('Dredmor.Initialised', function() {
	Dredmor.Search.Init();
});