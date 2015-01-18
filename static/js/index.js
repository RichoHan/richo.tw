$('.ui.sticky')
	.sticky({
		// bottomOffset : 0
		// context: '#example1'
	})
;

$('.content .resumepage').hide();
$('.content .contactpage').hide();

var currentpage = $('.content .homepage');

$('.home_btn').click(function() {

	if( currentpage.is($('.content .homepage')) )
		return;	

	currentpage
		.transition({
			animation  : 'fade down',
			duration   : '500ms',
			onComplete : function() {
				$('.content .homepage')
					.transition('fade up', '500ms')
				;
				currentpage = $('.content .homepage');
			}
		})
	;

});

$('.resume_btn').click(function() {
	
	if( currentpage.is($('.content .resumepage')) )
		return;

	currentpage
		.transition({
			animation  : 'fade down',
			duration   : '500ms',
			onComplete : function() {
				$('.content .resumepage')
					.transition('fade up', '500ms')
				;
				currentpage = $('.content .resumepage');
			}
		})
	;

});

$('.contact_btn').click(function() {
	
	if( currentpage.is($('.content .contactpage')) )
		return;

	currentpage
		.transition({
			animation  : 'fade down',
			duration   : '500ms',
			onComplete : function() {
				$('.content .contactpage')
					.transition('fade up', '500ms')
				;
				currentpage = $('.content .contactpage');
			}
		})
	;

});