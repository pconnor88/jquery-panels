#jQuery Panels Plugin

##Usage
jQuery panels can be setup by including jQuery and the jQuery.panels javascript files in the head of your document, then adding the following code to the bottom of your page.

```javascript
$(function() {
    $('#feature-panel').panels({ panel: '.slide' });
});
```

The HMTL structure should be as follows, where slideclass is each individual panel:
```html
<div id="feature-panel">
	<div class="slide"></div>
	<div class="slide"></div>
</div>
```

animation: 'fade',
            speed: 2000,
			wait: 6000,
			start: 0,
			resumeOnClick: true,
			autoScroll: true,
			infinite: false,
			panelsPerScreen: 1,
			panelsToMove: 1,
			vertical: false,
			responsive: false,	
			showArrows: false,
			hideArrowsAtEnd: false,
			leftArrowClass: 'arrowLeft',
			leftArrowImage: '',
			rightArrowClass: 'arrowRight',
			rightArrowImage: '',
			showMarkers: false,
			markerHolderClass: '',
			markerClass: '',
			markerPosition: 'sw',
			showMarkerNumbers: false,
			onSetupComplete: function(element, slide) { },
			onSlideChange: function(element, slide) { }


##Configuration
The plugin can be configured with any of the following options on setup.

###panel

- **REQUIRED**
- **Type:** String

The selector used to identify each slide.

###animation 
- **Type:** String
- **Default:** 'fade'

###autoScroll
- **Type:** Boolean
- **Default:** true

###hideArrowsAtEnd
- **Type:** Boolean
- **Default:** false

###infinite
- **Type:** Boolean
- **Default:** true

###leftArrowClass
- **Type:** String
- **Default:** 'arrowLeft'

###leftArrowImage
- **Type:** String
- **Default:** ''

###markerClass
- **Type:** String
- **Default:** ''

###markerHolderClass
- **Type:** String
- **Default:** ''

###markerPosition
- **Type:** String
- **Default:** 'sw'

###onSetupComplete
- **Type:** Function
- **Default:** function(element, slide) { }

###onSlideChange
- **Type:** Function
- **Default:** function(element, slide) { }

###panelsPerScreen
- **Type:** Number
- **Default:** 1

###panelsToMove
- **Type:** Number
- **Default:** 1

###responsive
- **Type:** Boolean
- **Default:** true

###resumeOnClick
- **Type:** Boolean
- **Default:** true

###rightArrowClass
- **Type:** String
- **Default:** 'arrowRight'

###rightArrowImage
- **Type:** String
- **Default:** ''

###showArrows
- **Type:** Boolean
- **Default:** false

###showMarkerNumbers
- **Type:** Boolean
- **Default:** false

###showMarkers
- **Type:** Boolean
- **Default:** false

###speed
- **Type:** Number
- **Default:** 2000

###start
- **Type:** Number
- **Default:** 0

###vertical
- **Type:** Boolean
- **Default:** true

###wait
- **Type:** Number
- **Default:** 6000
