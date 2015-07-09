/*******************************************************************************
** Meta
**
** Info about the info!
*******************************************************************************/

Dredmor.Meta = {};

/**
** Meta Data
**
** An array of:
**     [Meta]
**
** A [Meta] is of the form:
**     name:			(String)		Name
**     iconFile:		(String)		Path to icon representing this meta info
**     description:		(String)		Description
**     info: 			(String)		Meta info. Initially empty, filled by the info function during rendering.
**     infoFunc: 		(Function)		Function that, when run, returns a HTML string containing the meta info.
*/
Dredmor.Meta.Data =
[
	{
		id: genId(),
		iconFile: 'data/skills/warrior/armourer0_64.png',
		name: 'Required Armour by Monster',
		description: 'How much armour is required to completely nullify the mundane damage inflicted by a (non-crit) Monster melee hit.',
		dataFunc: function() {
			var result = '';
			var monDmg = [];

			for (var key in Dredmor.Monster.Data) {
			    var monster = Dredmor.Monster.Data[key];
				var dmg = Math.floor((monster.warLevel*2 + monster.rogLevel + monster.wizLevel - 5)/3);
				
				for (var i in monster.totalStats) {
					var stat = monster.totalStats[i];
					
					if (stat.type == Dredmor.Stat.Map['Damage']['crushing'] ||
							stat.type == Dredmor.Stat.Map['Damage']['slashing'] ||
							stat.type == Dredmor.Stat.Map['Damage']['blasting']) {
						dmg += stat.amount;
					}
				}

				var stats = [{
					type: Dredmor.Stat.Data['ArmourAbsorption'],
					amount: dmg
				}];
				
			    monDmg.push({
			    	monster: monster.name,
			    	stats: stats
			    });
			}

			monDmg.sort(function(a, b) { return b.stats[0].amount - a.stats[0].amount; });

			return monDmg.slice(0, 10);
		},
		templateString: '\
			<table class="innerTable">\
				{{for #data}}\
					<tr>\
						<td>{{renderStats stats /}}</td>\
						<td>Vs.</td>\
						<td>\
							{{derefMonster monster}}\
								{{renderIcon iconFile tint=iconTint size=32 link=id /}}\
							{{/derefMonster}}\
						</td>\
					</tr>\
				{{/for}}\
			</table>\
		'
	}
];

/*
** Meta Section Loader
**
** Handles loading the section from the parsed data.
*/
Dredmor.Meta.Section = Dredmor.Section.Add({
	Name: 'Meta',
	
	Parse: function(source, callback)
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
		// Render the content
		$('#metaContentTemplate').layout = true;
		$('#meta').find('.content').html(
			$('#metaContentTemplate').render(Dredmor.Meta.Data)
		);
	}
});