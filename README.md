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

##Configuration
The plugin can be configured with any of the following options on setup.

###panel

- **REQUIRED**
- **Type:** String

The selector used to identify each slide

###animation 
- **Type:** String
- **Default:** 'fade'

The type of animation you want your feature panel to have, currently the two available values are **fade** and **slide**

###autoScroll
- **Type:** Boolean
- **Default:** true

If set to true, the feature panel will automatically cycle through on load

###hideArrowsAtEnd
- **Type:** Boolean
- **Default:** false

If set to true, it will hide the respective arrow when the feature panel reaches the first/last slide. This option is overriden to true if infinite scrolling is set to true.

###infinite
- **Type:** Boolean
- **Default:** false

**Only applies to the 'slide' animation.** If set to true, will stop the feature panel from sliding back to the start, after the last slide is reached.

###leftArrowClass
- **Type:** String
- **Default:** 'arrowLeft'

CSS class to be applied to the left arrow

###leftArrowImage
- **Type:** String
- **Default:** ''

URL of the image to be used for the left arrow, if set to a blank string, no image will be shown.

###markerClass
- **Type:** String
- **Default:** ''

CSS class to be applied to each individual slide marker

###markerHolderClass
- **Type:** String
- **Default:** ''

CSS class to be applied to the slide markers container

###markerPosition
- **Type:** String
- **Default:** 'sw'

The location you want the markers to appear in. These are given as compass co-ordinates. Possible values are: 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'

###onSetupComplete
- **Type:** Function
- **Default:** function(element, slide) { }

A function that is called once the feature panel is set up for the first time. Two parameters are passed into the function; element and slide. element is the whole feature panel object, slide is the object of the current slide

###onSlideChange
- **Type:** Function
- **Default:** function(element, slide) { }

A function that is called each time the feature panel changes slide. Two parameters are passed into the function; element and slide. element is the whole feature panel object, slide is the object of the current slide

###panelsPerScreen
- **Type:** Number
- **Default:** 1

The number of slides the feature panel shows at any one time

###panelsToMove
- **Type:** Number
- **Default:** 1

The number of slides to move the feature panel along on change

###responsive
- **Type:** Boolean
- **Default:** true

If set to true, the feature panel will be set to 100% width and will resize itself on window resize

###resumeOnClick
- **Type:** Boolean
- **Default:** true

Whether to pause the feature panel or continue scrolling through once the user has clicked to go to a different slide either through the arrows or markers

###rightArrowClass
- **Type:** String
- **Default:** 'arrowRight'

CSS class to be applied to the right arrow

###rightArrowImage
- **Type:** String
- **Default:** ''

URL of the image to be used for the left arrow, if set to a blank string, no image will be shown.

###showArrows
- **Type:** Boolean
- **Default:** false

If set to true, navigational arrows will be shown, allowing the user to cycle through the slides

###showMarkerNumbers
- **Type:** Boolean
- **Default:** false

If set to true, the markers will have the slide number inside them

###showMarkers
- **Type:** Boolean
- **Default:** false

If set to true, a marker for each slide will be shown, clicking on a marker will take the user to that slide

###speed
- **Type:** Number
- **Default:** 2000

The speed (in ms) of the animation effect

###start
- **Type:** Number
- **Default:** 0

The slide number to be shown at the start

###vertical
- **Type:** Boolean
- **Default:** true

If set to true, the feature panel will slide vertically rather than horizontally. This only affects feature panels where the animation is set to 'slide'

###wait
- **Type:** Number
- **Default:** 6000

The time (in ms) to wait before changing slide
