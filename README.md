# clicklight.js

Clicklight is a jQuery plugin to work with HTML image maps.

The plugin provides hover and click event handlers as well as
callbacks to manipulate the color and opacity of mapped areas.

The plugin has a small footprint and has no dependencies other than
jQuery 1.7+ and a browser that supports HTML5 canvas.

Clicklight was specifically designed to be small and nimble, hiding
the gory details of HTML5 canvas under a small, clean API. It has very
little built-in functionality. If you need a more featureful solution,
you may want to have a look at the venerable ImageMapster plugin.

Clicklight can exist in one of two states

1. Instantiation where nothing or a config object is passed in to
build an instance
2. Method calls via passing string identifiers followed by arguments

## Setup

Clicklight expects

* image with an assoicated image map
* `<img>` tags needs to be wrapped in `<div>` tags
* `<area>` tags to be managed are recquired to have a
  `data-cl-uid="userSetID"` on each.

```html
<div>
  <img src="some/img/src" usemap="#mapName" id="thisImg">
</div>

<map name="mapName">
  <area shape="rect" alt="" coords="x1,y1,x2,y2" href="#" data-cl-uid="1" title="example">
  <area shape="rect" alt="" coords="x1,y1,x2,y2" href="#" data-cl-uid="2" title="example">
  <area shape="rect" alt="" coords="x1,y1,x2,y2" href="#" data-cl-uid="2" title="example">
</map>
```
Call the clicklight function on the image

```javascript
$(function() {

  $('#thisImg').clicklight();

});
```

## The API

Clicklight provides methods that can be called through clicklight by
passing string identifiers into an instance.  Each instance is tied to
the image it was built on, to get back at it, just call clicklight on
the image you want the instance of.

```javascript
$('#thisImg').clicklight('set', 'ID', 'COLOR');
// set takes a group id and color to set the given group to. Current
// color will be set to the passed color internally

$('#thisImg').clicklight('reset', 'ID');
// reset takes a group id and sets the color to whatever is internally
// saved as current color

$('#thisImg').clicklight('setTransient', 'ID', 'COLOR');
// setTransient takes a group id and color to set the given group to.
// Current color is not changed internally

$('#thisImg').clicklight('resetState', 'ID');
// resetState takes a group id to remove color from as well as clear
// the current color saved internally

$('#thisImg').clicklight('updateConfig', {/*new config object*/});
// updateConfig takes the very same config object described above in
// case something needs to be changed during runtime
```

## Configuration

Clicklight config can be used as default or overwritten via the
provided callbacks.

#### Properties

* `alpha` opacity of colors between 0.0 and 1.0
* `clickColor` default color used on clicks
* `hoverColor` default color used on mouse over

`hoverColor` and `clickColor` only accept RGB strings

#### Callbacks

the default callbacks and basic behavior
* `clicked`    - sets a color
* `mouseOver`  - temporarily sets `hoverColor`
* `mouseLeave` - resets to last `set` color or clears

if defined, above callbacks will fire secondary callbacks below
* `onClick`
* `onHover`
* `noHover`

listed callbacks are called with the same arguments where
* `this` element that fired event/callback
* `inst` active instance
* `id` group of the element

which looks like so in when defining
* `onClick : function(inst, id) { /*logic*/ }`

The last callback is `onConfigured` where `this` will point to the
image it was instatiated on while one argument `inst` is provided
* `onConfigured : function(inst) { /*logic*/ }`

### Using the config

To give our config object to clicklight, we just pass it in while
instantiating

```javascript
$(function() {

  $('#thisImg').clicklight({
    clickColor : '255, 255, 0',
	alpha      : '0.6',
	clickColor : '255, 200, 0',
	onClick    : function (inst, id) {
	  console.log(this, 'was just clicked and is in group', id);
	},
	onConfigured : function (inst) {
	  console.log(inst, 'is ready for operation!');
	}
  });

});
```

#### Config object

For those interested, this is the definition of the config object.

```javascript
var defaults = {
  clicked      : function (inst, id) {
    if (inst.group[id].is_set)
      inst.resetState(id);
    else
      inst.set(id, inst.settings.clickColor);
    inst.group[id].is_set = !inst.group[id].is_set;

    if (typeof inst.settings.onClick === 'function')
      inst.settings.onClick.call(this, inst, id);
  },
  mouseOver    : function (inst, id) {
    inst.setTransient(id, inst.settings.hoverColor);

    if (typeof inst.settings.onHover === 'function')
      inst.settings.onHover.call(this, inst, id);
  },
  mouseLeave   : function (inst, id) {
    inst.reset(id);

    if (typeof inst.settings.noHover === 'function')
      inst.settings.noHover.call(this, inst, id);
  },
  onConfigured : null,
  onClick      : null,
  onHover      : null,
  noHover      : null,
  alpha        : '0.4',
  hoverColor   : '0, 255, 255',
  clickColor   : '255, 0, 0'
};
```

## Limitations

* Color's need to be RGB string values
* no method for deletion of an instance
* only area tags of type 'rectangle' will work
