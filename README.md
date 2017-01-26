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
