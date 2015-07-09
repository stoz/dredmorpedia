/*
 * jQuery Cookie plugin - Default Addition
 * 
 * Supports having a default value for a cookie that is automatically set if the cookie doesn't exist.
 */

$.cookie.default = function(key, value, options) {
	// Get the cookie's value
	var cookieValue = $.cookie(key);

	// Check if the cookie hasn't been set
	if (cookieValue === null) {
		// Set the cookie
		$.cookie(key, value, options);
		cookieValue = value;
	}

	// Return the value
	return cookieValue;
};