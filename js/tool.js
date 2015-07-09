/*******************************************************************************
** Tool
**
** Stuff you can use.
*******************************************************************************/

/*
** Dredmor.Initialised
**
** When the Dredmorpedia has initialised.
*/
$(document).bind('Dredmor.Initialised', function() {
	$('#useTool').downloadify({
		filename: function(){
			return 'itemDB.xml';
		},
		data: function(){ 
			return (new XMLSerializer()).serializeToString(Dredmor.Item.Output[0]);
		},
		onComplete: function(){ 
			alert('Your File Has Been Saved!'); 
		},
		onCancel: function(){ 
			alert('You have cancelled the saving of this file.');
		},
		onError: function(){ 
			alert('You must put something in the File Contents or there will be nothing to save!'); 
		},
		transparent: false,
		swf: 'swf/downloadify.swf',
		downloadImage: 'img/download.png',
		width: 100,
		height: 30,
		transparent: true,
		append: false
	});
});