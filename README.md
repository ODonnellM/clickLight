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
With the HTML reflecting what clicklight will expect, we can now instantiate the plugin. We have a few approaches to this depending on what the plugin will be specifically in control of and how you want it to act. Each instance is considered anonymous or named, building an anonymous default instance would look like this

  ```javascript
  $(function() {
    $('.toSelect').clicklight();
  });
  ```  
Just that would fully instatiate a plugin onto the selected image, if however, you were planning on getting back at a given instance of the plugin to make method calls or whatever your purposes are, you will need a named instance. To do this, we simply give the clicklight call an ID to file the instance under like this
  
```javascript
  $(function() {
    $('.toSelect').clicklight('ID'); //where id is the name of the instance
  });
  ```  
Moving forward, when instantiating, clicklight will always take the first string it finds, before the config object, as the name to be assigned to that instance. If something is incorrectly passed, an exception will be raised to make you aware of what's gone wrong.

####Configuration
Clicklight provides a fairly simple settings object that can be set during instantiation as well as at any point during runtime assuming you have a named instance to access. The default settings are as follows

```javascript
var defaults = {
  clicked : function (inst, id) {
    if (inst.group[id].is_set)
      inst.resetState(id);
    else
      inst.set(id, '255, 0, 255');
    inst.group[id].is_set = !inst.group[id].is_set;
  },
  mouseOver : function (inst, id) {
    inst.setTransient(id, inst.settings.rgb);
  },
  mouseLeave : function (inst, id) {
    inst.reset(id);
  },
  onConfigured : null,
  onClick      : null,
  onHover      : null,
  noHover      : null,
  alpha        : '0.4',
  rgb          : '0, 255, 255'
};
```  
