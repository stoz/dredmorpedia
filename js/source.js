/*******************************************************************************
** Source
**
** The source(s) of Dredmorpedia's data.
*******************************************************************************/

Dredmor.Source = {};

/**
** Current
**
** The current source.
*/
Dredmor.Source.Current = null;

/**
** Source List
**
** List of sources.
*/
Dredmor.Source.List =
[
	{
		id:     genId(),
		dir:	'data',
		title:  'Base Game',
		href:   'http://dungeonsofdredmor.com/',
		active: true,
		required: true
	},
	{
		id:     genId(),
		dir: 	'expansion',
		tag: 	'RotDG',
		title: 	'Realm of the Diggle Gods',
		href: 	'http://store.steampowered.com/app/98820/',
		active: true
	},
	{
		id:     genId(),
		dir: 	'expansion2',
		tag: 	'YHTNTEP',
		title: 	'You Have To Name The Expansion Pack',
		href: 	'http://www.gaslampgames.com/2012/04/30/free-dlc-for-dungeons-of-dredmor-you-have-to-name-the-expansion-pack/',
		active: true
	},
	{
		id:     genId(),
		dir: 	'expansion3',
		tag: 	'CotW',
		title: 	'Conquest of the Wizardlands',
		href: 	'http://www.gaslampgames.com/2012/07/05/conquest-of-the-wizardlands-august-1st/',
		active: true
	},
	{
		id:     genId(),
		dir: 	'windmagic',
		tag: 	'WM Mod',
		title: 	'Wind Magic Mod',
		href: 	'http://community.gaslampgames.com/threads/1-08-wind-magic.1591/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir: 	'essential1',
		tag: 	'E1 Mod',
		title: 	'Essential DoD Mod',
		href: 	'http://community.gaslampgames.com/threads/essential-dod-skills-i-and-ii-finally-game-ready.1770/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir: 	'essential2',
		tag: 	'E2 Mod',
		title: 	'Essential DoD II Mod',
		href: 	'http://community.gaslampgames.com/threads/essential-dod-skills-i-and-ii-finally-game-ready.1770/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir: 	'swiftstriker',
		tag: 	'SS Mod',
		title: 	'Swift Striker Mod',
		href: 	'http://community.gaslampgames.com/threads/swiftstriker-skill-line-released.1944/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir: 	'interiordredmorating',
		tag: 	'ID Mod',
		title: 	'Interior Dredmorating Mod',
		href: 	'http://community.gaslampgames.com/threads/interior-dredmorating-1-0.2158/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir: 	'runecaster',
		tag: 	'RC Mod',
		title: 	'Rune Caster Mod',
		href: 	'http://community.gaslampgames.com/threads/runecaster-mod-craft-runes-and-destroy-your-enemies.2283/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir:	'diregourmand',
		tag:	'DG Mod',
		title:  'Dire Gourmand Mod',
		href:   'http://community.gaslampgames.com/threads/dire-gourmand-0-5-revision.2173/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir:	'roguishrenovation',
		tag:	'RR Mod',
		title:  'Roguish Renovation Mod',
		href:   'http://community.gaslampgames.com/threads/roguish-renovation.2561/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir:	'faxpax',
		tag:	'FP Mod',
		title:  'FaxPax Mod',
		href:   'http://community.gaslampgames.com/threads/faxpax-a-thing-what-fax-made.2397/',
		active: false,
		mod:    true
	},
	{
		id:     genId(),
		dir:	'chronomancy',
		tag:	'C Mod',
		title:  'Chronomancy Mod',
		href:   'http://community.gaslampgames.com/threads/chronomancy-time-manipulation-skill.2642/',
		active: false,
		mod:    true
	}
];

/**
** Get Source List
**
** Returns a list of all sources (including inactive).
*/
Dredmor.Source.GetList = function()
{
	return Dredmor.Source.List;
}

/**
** Get Active Source List
**
** Returns a list of active sources.
*/
Dredmor.Source.GetActiveList = function()
{
	if (!Dredmor.Source.GetActiveList.cache) {
		var activeList = [];

		for (var i = 0; i < Dredmor.Source.List.length; i++) {
			var source = Dredmor.Source.List[i];
			
			// Check if this source is active (if not, uses source's default active state)
			var active = $.cookie.default(source.dir, source.active ? 'active' : '');

			// Add to active list if it is (or if the source is required always)
			if (active || source.required) {
				activeList.push(source);
			}

			// Save active as boolean value
			source.active = !!active;
		}

		Dredmor.Source.GetActiveList.cache = activeList;
	}

	return Dredmor.Source.GetActiveList.cache;
}