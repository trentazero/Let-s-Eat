/* Additional code from the Magnific Popup API
source: http://dimsemenov.com/plugins/magnific-popup/ */
// Magnific Popup v1.1.0 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=inline+image+ajax+iframe+gallery+retina+imagezoom
$(document).ready(function() {
	$('.konami_popup').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false
	});
});

$(document).ready(function() {
  $(".konami_popup").trigger("click");
});

var myCallback = function(){
  $(".konami_popup").trigger("click");
};

$(document).konami_code({ callback: myCallback })
