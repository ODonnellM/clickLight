# Clicklight.js
##About
Clicklight is a	jQuery plugin developed	for use	with image maps	where highlighting is necessary. Using a simple and modular api, a clicklight instance can hook onto any image with an associated map and immediatley start providing functionality. For those wanting a more customized use case, digging deeper into the plugin through callbacks and overwrites of default behavior is also possible.

##Dependancies
Clicklight has not yet been tested on all browsers but should function without incident on any browser with support for HTML 5's canvasing.

This plugin was built over jQuery 3.1.1. Any issues with other versions will be noted here as issues are discovered.

##Using the plugin
Using clicklight.js is fairly simple in most cases, but can also be built into just about any ecosystem where it's needed. Walking through the more basic functionality of the plugin should give you an idea as to how you can incorporate this open design into your own project on a more personlized use case.
####Some Expectations
Using clicklight is as simple as calling it on the image you want to apply it to.

However, clicklight expects the image in question to be wrapped in `<div></div>` tags so it can apply CSS and insert a canvas into the webpage. The image must also have an associated map through the images 'usemap' attribute. In addition to this, an ID `data-cl-uid="some_id"` needs to be placed on every area element that clicklight will be responsible for. Every area without this ID will raise an exception and be ignored by clicklight. Prior to instantiation, this would be considered proper setup
  ```html
   <div>
     <img src="/some/img/src" usemap="#mapName" class="toSelect">
   </div>
   
   <map name="mapName">
     <area shape="rect" alt="" coords="x1,y1,x2,y2" href="" data-cl-uid="id" title="Some Title">
   </map>
   ```
   
####Instantiation
Assuming we are working with the above HTML as our webpage, we can now look into instantiating the plugin. This would

  ```javascript
  $(function() {
    $('.toSelect').clicklight();
  });
  ```



####Configuration
Clicklight provides a fairly simple settings object that can be set during instantiation as well as at any point during runtime assuming you have a named instance to access. The default settings are as follows:

```javascript
var defaults = {
  clicked : function (inst, id) {
    if (inst.group[id].is_set)
      inst.resetState(id);
    else
      inst.set(id, inst.settings.clickColor);
    inst.group[id].is_set = !inst.group[id].is_set;

    if (typeof inst.settings.onClick === 'function')
      inst.settings.onClick.call(this, inst, id);
  },
  mouseOver : function (inst, id) {
    inst.setTransient(id, inst.settings.hoverColor);

    if (typeof inst.settings.onHover === 'function')
      inst.settings.onHover.call(this, inst, id);
  },
  mouseLeave : function (inst, id) {
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
This is where all configuration for a given instance lives, any and all of these can be overwritten to fit any situation needed. With default settings, `clicked`, `mouseOver` and `mouseLeave` act as our primary functions within the event handlers, these in turn look at their respective callbacks (also in this settings object) `onClick`, `onHover` and `noHover`. This allows for a few levels of complexity. First and foremost you can change the color and opacity of the different highlighting options on a click and hover event through `clickColor`, `hoverColor` and `alpha`. Go a level deeper and you can provide a callback to be fired after any default highlighting has happened. Want even more control? You can overwrite the primary event functions and have the clicklight act however you feel it should for your application. When working with anf of these functions, `this` will always represent the element the event fired on, `inst` will be the current instance you are working with and `id` will be the ID of the element that points to a group within a given instance for accessing different method calls keying into some other user defined obj/array/etc...
