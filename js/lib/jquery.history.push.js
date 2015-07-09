/*
 * jQuery history plugin - Push Addition
 * 
 * Supports pushing history without calling the loading callback.
 */

$.history.push = function(hash) {
	// Save callback & remove it
	var callback = $.history.callback;
	$.history.callback = function() { };
	
	// Load
	$.history.load(hash);
	
	// Replace callback
	$.history.callback = callback;
};