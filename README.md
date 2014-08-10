#jQuery Panels Plugin

##Usage
jQuery panels can be setup by including jQuery and the jQuery.panels javascript files in the head of your document, then adding the following code to the bottom of your page.

```javascript
$(function() {
    $('#feature-panel').panels();
});
```

The HMTL structure should be as follows, where the divs with the class of slide is each individual panel:
```html
<div id="feature-panel">
	<div class="slide"></div>
	<div class="slide"></div>
</div>
```

##Configuration
The plugin can be configured with any of the following options on setup.

###Options

| Name | Type | Default | Description
| ------------- | ----------- | ------------- | ----------- |
| **`panel`** | `string` | `null` | A string selector for all the slides of the feature panel. If the value is `null`, all children nodes will be used.
| **`animation`** | `string` - `fade` or `slide` | `fade` | Specify the type of animation you want for the feature panel
| **`easing`** | `string` - `linear` or `swing` | `swing` | Specify the type of easing for the animation. If you want to use other easing options than `linear` or `swing` you will have to include an external library.
| **`speed`** | `number` | `2000` | The time in ms the animation takes to complete.
| **`wait`** | `number` | `6000` | The time in ms a slide is displayed for before moving on to the next one.
| **`startSlide`** | `number` | `0` | The slide number to start on.
| **`resumeOnClick`** | `boolean` - `true` or `false` | `true` | If set to `true` the feature panel will begin auto scrolling after an user click interaction (the pagination or next/previous arrows).
| **`pauseOnHover`** | `boolean` - `true` or `false` | `false` | Specifies whether to pause the plugin on mouse hover.
| **`autoScroll`** | `boolean` - `true` or `false` | `true` | Specifies whether to allow the feature panel to scroll through the slides automatically.
| **`responsive`** | `boolean` - `true` or `false` | `false` | Use this for responsive sites if you would like the feature panel to be responsive.
| **`touchSwipe`** | `boolean` - `true` or `false` | `true` | Allows swipe gestures on mobiles and tables to navigate between the slides.
| **`infinite`** | `boolean` - `true` or `false` | `false` | If `true` the feature panel will never slide back to the start when the last slide is reached. If your `animation` value is `fade` then the slider is infinite by default.
| **`panelsPerScreen`** | `number` | `1` | The number of slides that are in shown in the default view in the feature panel. This option only applies when `animation` is set to `slide`.
| **`panelsToMove`** | `number` | `1` | The number of slides for the feature panel to move when the next/previous buttons are clicked.
| **`vertical`** | `boolean` - `true` or `false` | `false` | If `true` the scroller will scroll vertically otherwise it will scroll horizontally.
| **`showArrows`** | `boolean` - `true` or `false` | `false` | Specifies whether to show the navigational arrows.
| **`hideArrowsAtEnd`** | `boolean` - `true` or `false` | `false` | Specifies whether the necessary arrows should be hidden when you can't scroll in that direction anymore. _(i.e. if you are on the first slide, the left arrow will be disabled)._ **Note: If `infinite` is set to `true` or `animation` is set to `fade` this option will have no effect.**
| **`leftArrowClass`** | `string` | `''` | Allows a user defined class to be placed on the left arrow.
| **`leftArrowImage`** | `string` | `null` | The filepath to an image to be used for the left arrow, if `null` then no image will be shown.
| **`rightArrowClass`** | `string` | `''` | Allows a user defined class to be placed on the right arrow.
| **`rightArrowImage`** | `string` | `null` | The filepath to an image to be used for the right arrow, if `null` then no image will be shown.
| **`showMarkers`** | `boolean` - `true` or `false` | `true` | Specifies whether to show the marker pagination.
| **`markerHolderClass`** | `string` | `''` | Allows a user defined class to be placed on the pagination holder (_&lt;ul&gt; node_).
| **`markerClass`** | `string` | `''` | Allows a user defined class to be placed on the pagination markers (_&lt;li&gt; node_).
| **`markerPosition`** | `string` - `'n'`, `'ne'`, `'e'`, `'se'`, `'s'`, `'sw'`, `'w'` or `'nw'` | `'sw'` | Specifies where the pagination markers should be placed. Only accepts a string that is a compass point.
| **`showMarkerNumbers`** | `boolean` - `true` or `false` | `false` | Specifies whether to show numbers inside the pagination markers.
| **`onSetupComplete`** | `function` | `function(element, index) { }` | A function that is called once the plugin has initialised. `element` is the jQuery selected plugin, `index` is the current slide number.
| **`onSlideBegin`** | `function` | `function(element, index) { }` | A function that is called once the feature panel begins animating to the next slide. `element` is the jQuery selected plugin, `index` is the current slide number.
| **`onSlideComplete`** | `function` | `function(element, index) { }` | A function that is called once the feature panel has finished animating to the next slide. `element` is the jQuery selected plugin, `index` is the current slide number.

###Methods

Any of methods below allow you to interact with the plugin from your code after is has been initialised. These functions can be called by passing the string of the function name into the plugin.

```javascript
$('#feature-panel').panels('pause');
```

If you need to pass in additional parameters, these are passed in after the function name.

```javascript
$('#feature-panel').panels('gotoSlide', 3);
```


| Name | Parameters | Description
| ------------- | ------------- | ----------- |
| **`play`** | `none` | Starts the feature panel auto playing if its current status is paused.
| **`pause`** | `none` | Pauses the feature panel and stops it auto playing.
| **`next`** | `none` | Moves the feature panel on to the next slide.
| **`previous`** | `none` | Moves the feature panel on to the previous slide.
| **`gotoSlide`** | `number` | Moves the feature panel on to the number specified in the parameters. **Note this is a 0-based number, so 0 will be the first slide not 1.**
| **`destroy`** | `none` | Destroys the plugin and returns it to its initial state.
