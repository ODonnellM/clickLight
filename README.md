# Clicklight.js

Clicklight is a small event driven jQuery plugin that allows images to
be highlighted through the use of HTML 5 image maps and canvasing. By
providing a clean and open API, it is easy to use and doesn't get in
the way of any project it is built into.

Clicklight was built after being unable to find an equivalently small
plugin that allows images to be higlighted and used as hooks into a
sites functionality. Focused only on highlighting and providing
callbacks, clicklight retains a small footprint while still
allowing for endless unique uses.

## Demo's

Coming soon

## Dependencies

Clicklight has not yet been browser tested, however, it operates off
HTML 5's canvasing which means all the latest browsers with such
support will be fine. As testing is done, a more formal list will be
put here.

Clicklight was designed around jQuery 3.1 but is compatible as far
back as jQuery 1.7

## Basic usage and setup

Clicklight only expects a few things to be done prior to
instantiation:
* the Clicklight.js file needs to be included within a script tag via
  this github or by downloading the file locally

* an image with an assoicated image map has to be present on the page
	
* `<img>` tags needs to be wrapped in a `<div>` tags

* Each `<area>` tag to be managed is recquired to have a
  `data-cl-uid="userSetID"` on it.


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
Then we can call the clicklight function on the image like so:

```javascript
$(function() {

  $('#thisImg').clicklight({
    hoverColor : '255, 0, 0',
	alpha      : '0.6',
	onClick    : function (inst, id) {
	  console.log(this, 'is being highlighted!');
	}
  });

});
```
## Configuration

Here are the various config options you can pass to clicklight broken
into 3 sections based on their use. Becuase area's can be grouped via
their `cl-uid` attribute, executed functions operate on their group,
not just the element that fired the event. Any of the following can be
overwritten.

#### Default Functionality
* `clicked`    - will set `clickColor`
* `mouseOver`  - will temporarily set `hoverColor` 
* `mouseLeave` - will reset back to last `set` color or blank

#### Callbacks 
All callbacks are initialized to null and will be called by their
respective default functions if defined.

* `onClick` - called by `clicked`
* `onHover` - called by `mouseOver`
* `noHover` - called by `mouseLeave`

All the above functions are all called with the same arguments where
`this` is the element that fired the event, `inst` is the active
instance and `id` is the id of the group the element is a part of,
structured like so: 

   `onClick : function(inst, id) { /*logic*/ }`

The final callback is `onConfigured`, as you may have guessed, is
called when a new instance has been built. `this` will point to the
image it was instatiated on and one argument `inst` is provided as
well :

   `onConfigured : function(inst) { /*logic* }`
   
#### Properties

The final peices available for edit in the config are `alpha`,
`hoverColor` and `clickColor`.

   `alpha` is used to changed opacity of a color by setting a value
   between 0.0 and 1.0
  
   `clickColor` is the default color used when setting colors on click events

   `hoverColor` is the default color used when setting colors on hover events
