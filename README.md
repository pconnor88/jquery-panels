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

###panel (string, required)
The selector used to identify each slide.

###animation 
- **Type:** String
- **Default:** 'fade'

###speed (string, required)

###wait (string, required)

###start (string, required)

###resumeOnClick (string, required)

###autoScroll (string, required)

###infinite (string, required)

###panelsPerScreen (string, required)

###panelsToMove (string, required)

###vertical (string, required)

###responsive (string, required)

###showArrows (string, required)

###hideArrowsAtEnd (string, required)

###leftArrowClass (string, required)

###leftArrowImage (string, required)

###rightArrowClass (string, required)

###rightArrowImage (string, required)

###showMarkers (string, required)

###markerHolderClass (string, required)

###markerClass (string, required)

###markerPosition (string, required)

###showMarkerNumbers (string, required)

###onSetupComplete (string, required)

###onSlideChange (string, required)
