# clicklight.js

Clicklight is an event driven jQuery plugin that highlights HTML image
maps using HTML 5 canvasing. Clicklight was built after being unable
to find a comparably small plugin with similar functionality. Focused only
on highlighting and providing callbacks, clicklight retains a small
footprint while allowing endless unique uses.

## Dependencies

Clicklight has not yet been browser tested, however, it operates off
HTML 5's canvasing which means all the latest browsers with such
support should be fine. As testing is done over the coming days, a more formal
list will be put here.

Clicklight was designed around jQuery 3.1 but is compatible as far
back as jQuery 1.7

## Basic usage and setup

Clicklight only expects a few things to be done prior to
instantiation:
* jQuery 1.7 or newer

* clicklight.js file

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
Now call the clicklight function on the image

```javascript
$(function() {

  $('#thisImg').clicklight();

});
```
## Configuration

Here are the various config options you can pass to clicklight.
Becuase area's can be grouped via their `data-cl-uid` attribute,
executed functions operate on their group, not just the element
that fired the event. Any of the following can be overwritten.

#### Primary Call's
* `clicked`    - will set `clickColor`
* `mouseOver`  - will temporarily set `hoverColor`
* `mouseLeave` - will reset back to last `set` color or blank

All functions above are called with the same arguments where `this` is
the element that fired the event, `inst` is the active instance and
`id` is the id of the group the element is a part of
* `onClick : function(inst, id) { /*logic*/ }`

#### Call order

|   Event   |Primary Call|call back|
|:---------:|:----------:|:-------:|
|   click   |  clicked   | onClick |
|mouse enter| mouseOver  | onHover |
|mouse leave| mouseLeave | noHover |

All callbacks are initialized to null and if defined, will be called
by their respective primary functions.

The final callback is `onConfigured`, as you may have guessed, is
called when a new instance has been built. `this` will point to the
image it was instatiated on while one argument `inst` is provided
* `onConfigured : function(inst) { /*logic*/ }`

#### Properties

The final pieces available for edit in the config are `alpha`,
`hoverColor` and `clickColor`:

* `alpha` is used to changed opacity of a color by setting a value
   between 0.0 and 1.0
* `clickColor` is the default color used when setting colors on click
  events
* `hoverColor` is the default color used when setting colors on hover
  events
  
As of right now, `hoverColor` and `clickColor` only accept strings of
RGB as color codes

### Basic usage with a config object

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
	}
  });

});
```

#### Default config object

For those interested, this is the actual definition of the default
config object. The API is described below and will give more context
as to how our default functionality is achieved through the primary
calls.

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

## The API

there are some methods and you can use them
