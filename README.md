# Clicklight.js
##About

Clicklight is a jQuery plugin developed for use with image maps where
highlighting is necessary. Using a simple and modular api, a
clicklight instance can hook into any image with an associated map and
immediatley start providing functionality. For those wanting a more
customized use case, digging deeper into the plugin through callbacks
and overwrites of default behavior is also available.

##Dependancies

Clicklight has not yet been tested on all browsers but should function
without incident on any browser with support for HTML 5's canvasing.

This plugin was built over jQuery 3.1.1. Any issues with other
versions will be noted here as they are discovered.

##Using the plugin

Using clicklight.js is fairly simple in most cases, and can still be
easily built into just about any ecosystem where it's functionality is
needed. Walking through the basics should give you an idea of how you
can incorporate this open design into your own project dealing with a
more personalized use case.

###Some Expectations

Using clicklight is as simple as calling it on the image or collection
of images you want to apply it to. The system expects these images to
be passed in via the jQuery selector used when calling clicklight.

In addition, clicklight expects each image in question to be wrapped
in it's own `<div></div>` tags allowing the instance to apply CSS and
insert canvas'. Beyond this, the image must also have an associated
map via the images 'usemap' attribute. Lastly, an ID, denoted by
`data-cl-uid="some_id"` needs to be placed on every area element that
clicklight will be responsible for. Every area without this ID will
raise an exception and be ignored by clicklight.

Prior to instantiation, this would be considered proper setup:

  ```html
   <div>
     <img src="/some/img/src" usemap="#mapName" class="toSelect">
   </div>
   
   <map name="mapName">
     <area shape="rect" alt="" coords="x1,y1,x2,y2" href="" data-cl-uid="id" title="Some Title">
   </map>
   ```
   
###Instantiation

Working with the above HTML as our webpage, we can now look into
instantiating the plugin. This is fairly simple and can be done in
only one of two ways, either with or without a configuration
object. How you set up this config is up to you, I will do a fully
default instance as well as a simple configured instance to show both
approaches.

A fully default instantiation would look like this:

  ```javascript
  $(function() {
    $('.toSelect').clicklight();
  });
  ```

While adding in some of our own config options would look like this:

  ```javascript
  $(function() {
    $('.toSelect').clicklight({
	  onClick : function(inst, id) {
	    console.log(this, 'was just clicked!');
	  },
	  hoverColor : '150, 150, 150'
	});
  });
  ```

As simply as that, there is now a fully functional instance on our webpage.

###Configuration

Clicklight provides a simple config object that can be set during
instantiation and reset at any point during runtime. For those curious
what the actual code looks like, the default config is as follows:

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

This is where all user configurable settings for a given instance
lives, any and all of these can be overwritten to fit any
situation. With default settings, `clicked`, `mouseOver` and
`mouseLeave` act as our primary callbacks within the event handlers.
This means that when an event fires like a mouse over/leave or click,
these are the functions that will initially be executed and contain
the plugin's default behavior. These initial callbacks then turn to
their own respective callbacks `onClick`, `onHover` and `noHover`, and
execute them. These extra callbacks are strictly for your use and
changing them will not effect the plugin's default behavior. This
leaves us with one last callback, `onConfigured`. This is fairly
self-explanatory but I'll go into it anyway. This callback will be
fired on each instance after each has finished its setup. Anything you
the user may need or want to do alongside the plugin's instantiation
can be done here.

Turning now to the few remaining properties of this object, we see
`alpha`, `hoverColor` and `clickColor`. These are the properties used
by the defaults to actually decide what color , and how much of said
color, to use when a given event is fired. When overriding defaults,
you do not have to use these values and can instead provide your
own. What these properties do show is what the clicklight structure
expects in terms of 'color syntax'. Because of the way canvasing
works, the RGB color scheme was chosen as the plugins standard. Any
defined functionality will have to adhere to this standard.

This config structure allows for a few levels of complexity. First and
foremost you can change the color and opacity of the different
highlighting options on a click and hover event through `clickColor`,
`hoverColor` and `alpha` used by the default callbacks. Go a level
deeper and you can provide a callback to be fired after any default
highlighting has happened. Want even more control? You can overwrite
the primary event callbacks and have the clicklight act however you
feel it should for your application. When working with any of these
functions, `this` will always represent the element the event fired
on, `inst` will be the current instance you are working with and `id`
will be the ID of the element that fired the event which can be used
when calling into an instance through the API.

###The API

Finally, we have arrived at clicklight's API. Clicklight provides a
very small and simple interface that I believe covers most if not all
of this plugin's use cases. Calling available methods is done through
the clicklight instance similar to the way it was instantiated. This
would be an example method call: `$('toSelect').clicklight('set',
'group1', '255,0,0');` 

The jQuery selector is used to select any images that have already
been instantiated and are of the collection you would like to apply a
given method to, in this case, 'set'. The selector can be one image in
particular, or every image that's been instantiated on a page. The
methods themselves are called through a string identifier passed into
the clicklight object. Any method you want to call can be called in
this way and it is expected that you do so. Let's actually look at the
API now and the above call should make more sense:

1. `clicklight('set', id, color);`
  * Set accepts two arguments, an ID representing an existing group
    and an RGB color value to set that group to.
  * The color passed to set is saved as the 'current' color in the
    groups state for access later by other methods.
2. `clicklight('setTransient', id, color);`
  * SetTransient accepts the same two arguments as set and applies
    them in the same exact way, on the webpage the two methods will
    appear to be acting the same.
  * The color passed to setTransient is **not** saved to the groups
    state however, it simply applies the color.
3. `clicklight('reset', id);`
  * Reset accepts only one argument, the ID of the group you would
    like to reset. Reset will look at the groups 'current' color in
    state and apply that color onto the group.
  * Unlike set, reset does not change the state of the group, it only
    applies the color that a group's state has as 'current'.
4. `clicklight('resetState', id);`
  * ResetState accepts only one argument just like reset. The ID of
    the group you would like to reset the state of.
  * First, resetState will set the 'current' color in state to
    null. Then, it will clear any color currently on the canvas.
5. `clicklight('updateConfig', config);`
  * If at any point you want to update the configuration of an
    instance during run time, this is the method that'll help you do
    so.
  * It works by simple re-extending the settings object internally
    which is referenced throughout the plugin's lifecycle including
    all callbacks and default color references.

##Examples

Here I will be providing a few example code blocks and link showcasing
uses of the plugin ranging from very simple to more involved use cases.
