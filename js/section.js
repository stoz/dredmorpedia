/*******************************************************************************
** Section
**
** The sections of Dredmorpedia.
*******************************************************************************/

Dredmor.Section = {};

/**
** Section List
**
** List of sections.
*/
Dredmor.Section.List = [];

/**
** Load
**
** Loads our added sections and calls back when finished. 
*/
Dredmor.Section.Load = function(callback)
{
	// Get our section and source lists
	var sectionList = Dredmor.Section.List;
	var sourceList = [];
	for (var i = 0; i < sectionList.length; i++) {
		if (sectionList[i].UseAllSources) {
			sourceList[i] = Dredmor.Source.GetList();
		} else {
			sourceList[i] = Dredmor.Source.GetActiveList();
		}
	}

	// Parse -------------------------------------------------------------------

	// Define our callback for when parsing has finished
	var parseCallback;

	// Keep track of how many sections and sources we have left to parse
	var parseSecLeft = sectionList.length;
	var parseSrcLeft = [];
	for (var i = 0; i < sectionList.length; i++) { parseSrcLeft[i] = sourceList[i].length; }

	// Parse each section and source
	for (var secNum = 0; secNum < sectionList.length; secNum++) {
		for (var srcNum = 0; srcNum < sourceList[secNum].length; srcNum++) {
			// Queue parsing this section and source
			Dredmor.Helper.Queue([secNum, srcNum], function(secSrc) {
				// Get section and source
				var secNum = secSrc[0];
				var srcNum = secSrc[1];

				var section = sectionList[secNum];
				var source = sourceList[secNum][srcNum];

				// Call section's Parse function with callback
				section.Parse(source, function(data) {
					// Indicate progress
					$('#loadingText').text('Digglin\'');
					$('#loadingProgress').progressbar('value', 40);

					// Decrement num of sources left to parse
					parseSrcLeft[secNum]--;

					// Check if we have parsed all our sources for this section
					if (!parseSrcLeft[secNum]) {
						// Decrement num of sections left to parse
						parseSecLeft--;
					}

					// Check if we have parsed all sections
					if (!parseSecLeft) {
						// Done! - callback
						parseCallback();
					}
				});
			});
		}
	}

	// Link & Render -----------------------------------------------------------

	parseCallback = function() {
		// Call each section's Link function
		for (var i = 0; i < sectionList.length; i++) {
			Dredmor.Helper.Queue(i, function(i) {
				// Link
				sectionList[i].Link();
			});
		}

		// Call each section's Render function
		for (var i = 0; i < sectionList.length; i++) {
			Dredmor.Helper.Queue(i, function(i) {
				// Indicate progress
				$('#loadingText').text('Reticulating Splines');
				$('#loadingProgress').progressbar('value', 80);

				// Render
				sectionList[i].Render();
			});
		}

		// Finish
		Dredmor.Helper.QueueLast(null, callback);
	};
}

/**
** Add
**
** Adds the given section to our section list.
*/
Dredmor.Section.Add = function(section)
{
	// Add to our section list
	Dredmor.Section.List.push(section);

	return section;
}