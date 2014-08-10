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
| `panel`      | String | null | A string selector for all the slides of the feature panel. If the value is null, all children nodes will be used.

