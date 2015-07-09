/*******************************************************************************
** Helper
**
** "Helper has always been super helpful"
*******************************************************************************/

Dredmor.Helper = {};

/**
** RecoverImageError
**
** Attempts to recover image errors by twiddling with the path of the image,
** as it may be located in a different data folder.
*/
Dredmor.Helper.RecoverImageError = function(img)
{
	// Initialise our error recovery
	var index = $(img).data('errorRecoveryIndex');

	if (!index) {
		index = 0;
	}

	// Determine if we've exhausted our recovery options
	if (index >= Dredmor.Source.GetActiveList().length - 1) {
		// Tried all data folders - can't find image
	} else {
		// Try next data folder
		
		// Split src into array of [before first slash, everything after]
		var splitSrc = $(img).attr('src').split(/\/(.+)?/);
		
		if (splitSrc.length > 1) {
			$(img).attr('src', Dredmor.Source.List[index].dir + '/' + splitSrc[1]);
			console.log('Attempting recovery of image ' + splitSrc[1] + ' by changing root from ' + splitSrc[0] + ' to ' + Dredmor.Source.List[index].dir);
		}
		
		// Store our index
		$(img).data('errorRecoveryIndex', index + 1);
	}
}
	
/**
** GoToHashReference
**
** Displays a part of Dredmorpedia by parsing the given hash.
*/
Dredmor.Helper.GoToHashReference = function(hash)
{
	var element = document.getElementById(hash);
	
	if (element) {
		// Find our section and sub-section
		var section = $(element).parents('div.section');
		var subSection = $(element).parents('div.subSection');
		
		// Select the tab for this section
		$('#page').tabs('select', section.attr('id'));
		
		// Select the tab for this sub-section
		$(section).tabs('select', subSection.attr('id'));
		
		// Scroll this element into view and highlight it
		element.scrollIntoView(true);
		$(element.tagName).removeClass('highlighted');
		$(element).addClass('highlighted');
	}
}
	
/**
** BlockUI
**
** Blocks the UI while we're busy.
*/
Dredmor.Helper.BlockUI = function(text)
{
	// Setup elements
	$('#loadingProgress').progressbar();
	if (text) {
		$('#loadingText').text(text);
	}
	
	// Block UI
	$.blockUI({ 
		message: $('#loading'), 
		css: { 
			top:  ($(window).height() - 72) /2 + 'px', 
			left: ($(window).width() - 72) /2 + 'px', 
			width: '72px',
			border: 0
		}
	});
}

/**
** UnblockUI
**
** Unblocks the UI.
*/
Dredmor.Helper.UnblockUI = function()
{
	$.unblockUI();
}

/**
** GetPath
**
** Gets the correct path for the given parsed relative path for the current source.
*/
Dredmor.Helper.GetPath = function(source, path)
{
	// If path is valid, prepend our route, otherwise return it
	if (path) {
		return source.dir + '/' + path;
	} else {
		return path;
	}
}

/**
** GetXMLPath
**
** Gets the correct path for the given XML file for the current source.
*/
Dredmor.Helper.GetXMLPath = function(source, file)
{
	// If path is valid, prepend our route, otherwise return it
	if (file) {
		return source.dir + '/' + (source.mod ? 'mod' : 'game') + '/' + file;
	} else {
		return file;
	}
}

/**
** Queue
**
** Queues the function to be run with the given argument some time in the future
** after all previously queued functions have been run. Functions are queued
** according to their priority (1-10). Defaults to a priority of 1 (highest).
*/
Dredmor.Helper.Queue = function(arg, func, priority)
{
	// Define self
	var self = Dredmor.Helper.Queue;

	// Initialise arguments
	priority = (priority > 10 ? 10 : priority < 1 ? 1 : priority) || 1;

	// Initialise if this is the first run
	if (!self.queue) {
		// Create our queue and set ourselves as inactive initially
		self.queue = [];
		self.active = false;

		// Define the function that runs when we dequeue
		self.queueFunc = function(startTime) {
			// Dequeue our function, argument and delay
			var queueItem = self.queue.pop();

			// Execute the function
			queueItem.func(queueItem.arg);

			// Check if we have anything else queued
			if (self.queue.length) {
				// Check if we have time to perform the next dequeue without our running time exceeding 1 second
				if ((new Date()).getTime() - startTime < 500) {
					// Still have time - dequeue and run the next function
					self.queueFunc(startTime);
				} else {
					// No time - schedule our dequeue later
					setTimeout(function() {
						self.queueFunc((new Date()).getTime());
					}, 0);
				}
			} else {
				// Exhausted the queue - set ourselves as inactive
				self.active = false;
			}
		}
	}

	// Find where to enqueue our function according to our priority
	for (var i = 0; i <= self.queue.length; i++) {
		var queueItem = self.queue[i];

		if (!queueItem || priority >= queueItem.priority) {
			self.queue.splice(i, 0, {
				func: func,
				arg: arg,
				priority: priority
			});
			break;
		}
	}

	// If we're already active (using the queue) then just wait
	// Otherwise, schedule our next dequeue and set ourselves as active
	if (!self.active) {
		self.active = true;

		setTimeout(function() {
			self.queueFunc((new Date()).getTime());
		}, 0);
	}
}

/**
** QueueLast
**
** Queues the function to be run with the given argument some time in the future
** after all previously queued functions have been run. This is a convenience
** function that simply calls Queue with a priority of 10.
*/
Dredmor.Helper.QueueLast = function(arg, func)
{
	Dredmor.Helper.Queue(arg, func, 10);
}

/**
** SortBySource
**
** Sort function that sorts a Dredmor.Object by its source and then its id.
*/
Dredmor.Helper.SortBySource = function(a, b)
{
	return ((a.id-b.id > 0)-(a.id-b.id < 0))+((a.source.id-b.source.id) << 1);
}

/**
** ParseSpellEffects
**
** Parses spell triggers in the xml and adds them as effects to the
** effects array.
*/
Dredmor.Helper.ParseSpellEffects = function(effects, xml)
{
	for (var i in Dredmor.Spell.Trigger) {
		var trigger = Dredmor.Spell.Trigger[i];
		
		if (trigger.selector) {
			xml.children(trigger.selector).each(function() {
				// Determine which attributes to use
				var name = $(this).attr('name');
				var chance = $(this).attr('percent');
				var delay = $(this).attr('type') == 'trigger' ? $(this).attr('amount') : 0;
				var duration = $(this).attr('type') == 'dot' ? $(this).attr('amount') : 0;
				var unresistable = ($(this).attr('resistable') == '0');
				var monsterTaxonomy = $(this).attr('taxa');
				
				// Inconsistent Gaslampers!
				name = name ? name : $(this).attr('spell');
				chance = chance ? chance : $(this).attr('percentage');
				
				// Add effect
				effects.push({
					link: true,
					spells: [
						name
					],
					trigger: trigger,
					chance: chance,
					delay: delay,
					duration: duration,
					unresistable: unresistable,
					monsterTaxonomy: monsterTaxonomy
				});
			});
		}
	}
}