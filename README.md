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

### Basic Usage

#### Recquirements

* image with an assoicated image map
* `<img>` wrapped in `<div>` tag
* `<area>` tags you want managed by clicklight are recquired to have a
  `data-cl-uid="userSetID"` on each.
#### Usage

HTML:
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
Javascript/jQuery:
```javascript
$(function() {

  $('#thisImg').clicklight();

});
```

### Configuration

Clicklight config can be used as default or overwritten via the
provided callbacks.

#### Properties

* `alpha` opacity of colors between 0.0 and 1.0
* `clickColor` default color used on click events
* `hoverColor` default color used on hover events

`hoverColor` and `clickColor` only accept RGB strings

#### Callbacks

when defined, the following callbacks will be fired on their respective events
* `onClick`
* `onHover`
* `noHover`
* `onConfigured`

Callbacks on mouse events are called with the same arguments where
* `this` element that fired event/callback
* `inst` active instance
* `id` group of the element

`onConfigured` works slightly different in that `this` will point to
the image it was instatiated on while one argument `inst` is provided

If you want to define your own behavior to work in place of the defined default
behavior, simply overwrite the following callbacks in your config
default behavior is achieved through a seperatecallbacks and basic behavior

* `clicked`
* `mouseOver`
* `mouseLeave`

### Using the config

To give our config object to clicklight, pass it in while
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
	  console.log(inst, 'was just instantiated on', this);
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
Anything in this object can be redefined to fit virtually any level of functionality.

## API

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

## Limitations

* Color's need to be RGB string values
* no method for deletion of an instance
* only area tags of type 'rectangle' will work
