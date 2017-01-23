;(function($, undefined) {
  'use strict';
  var pluginName   = 'clicklight';
  var cl_container = { 'position': 'relative' };
  var cl_image     = { 'position': 'relative', 'z-index': '1', 'top': '0', 'left': '0' };
  var cl_canvas    = { 'position': 'absolute', 'z-index': '2', 'top': '0', 'left': '0', 'pointer-events': 'none' }

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

  function Clicklight(img, options) {
    this.settings = $.extend({}, defaults, options);
    this.group = {};

    _init_inst(img, this);
  }

  function _val_arguments (numArgs, name) {
    var args = [].splice.call(arguments, 2);
    for (var i = 0; i < numArgs; i++) {
      if (!args[i]) {
        console.log("ERROR: '"+name+"' recieved "+i+" of "+numArgs+" expected arguments");
        return false;
      }
    } return true;
  }

  function _val_id (id, inst) {
    if (!inst.group[id]) {
      console.log("ERROR: no group '"+id+"' found in instance '"+ inst.id||"anonymous" +"'");
      return false;
    } return true;
  }

  var public_api = {
    set : function(id, style) {
      if (_val_arguments(2, 'set', id, style) && _val_id(id, this)) {
        this.group[id]._update(style);
        this.group[id]._apply();
      }
    },
    reset : function(id) {
      if (_val_arguments(1, 'reset', id) && _val_id(id, this))
        this.group[id]._apply();
    },
    setTransient : function (id, style) {
      if (_val_arguments(2, 'setTransient', id, style) && _val_id(id, this))
        this.group[id]._apply(style);
    },
    resetState : function (id) {
      if (_val_arguments(1, 'resetState', id) && _val_id(id, this)) {
        this.group[id]._update();
        this.group[id]._apply();
      }
    },
    updateConfig : function (config) {
      if (_val_arguments(1, 'updateConfig', config))
        $.extend(this.settings, config);
    }
  };

  function _init_inst (img, inst) {
    var $img = $(img);

    if (!$img.parent().is('div'))
      console.log('ERROR:', $img, 'is not located within a div');
    else {
      var mapName   = $img.attr('usemap').slice(1);
      var map       = $('map[name="'+ mapName +'"]');
      var container = $img.parent().append('<canvas id="cl-cvs-'+mapName+'"></canvas>');
      var canvas    = document.getElementById('cl-cvs-'+mapName+'');
      var ctx       = canvas.getContext('2d');

      container.css(cl_container);
      $img.css(cl_image);
      $(canvas).css(cl_canvas);

      ctx.canvas.width  = $img.width();
      ctx.canvas.height = $img.height();

      map.children('area').each(function() {
          _init_areas($(this), inst, ctx);
      });
    }
  }

  function _init_areas ($area, inst, ctx) {
    var group = [];
    var id    = $area.attr('data-cl-uid') || null;
    if (!id) {
      console.log('ERROR: no `data-cl-uid` found on area\n', $area, 'will be skipped');
      return undefined;
    }

    $area.on('click.'  + pluginName, function (event) {
      event.preventDefault();
      inst.settings.clicked.call($area, inst, id);
    }).on('mouseenter.'+ pluginName, function () {
      $area.css('cursor', 'pointer');
      inst.settings.mouseOver.call($area, inst, id);
    }).on('mouseleave.'+ pluginName, function() {
      $area.css('cursor', 'default');
      inst.settings.mouseLeave.call($area, inst, id);
    });

    if (!inst.group[id])
      inst.group[id] = _generate_node(inst);

    inst.group[id]._add($area);

    function _generate_node (inst) {
      var color  = null;
      return {
        is_set  : false,
        _update : function (style) {
          color = style || null;
        },
        _apply : function (style) {
          for (var i in group)
            ctx.clearRect(group[i].x, group[i].y, group[i].w, group[i].h);
          if (style || color) {
            style = style || color;
            ctx.fillStyle = 'rgba('+ style +', '+ inst.settings.alpha + ')';
            for (var i in group)
              ctx.fillRect(group[i].x, group[i].y, group[i].w, group[i].h);
          }
        },
        _add : function ($area) {
          if (!$area.data('cl-is-built')) {
            $area.data('cl-is-built', true);
            group.push(_calc_coords($area));
          } else
            console.log('ERROR:', $area, 'has already been built on an instance');
        }
      };
    }
  }

  function _calc_coords ($area) {
    var coords = $area.attr('coords').split(',');
    return {
      'x' : coords[0],
      'y' : coords[1],
      'w' : coords[2] - coords[0],
      'h' : coords[3] - coords[1]
    };
  }

  $.extend(Clicklight.prototype, public_api);
  $.fn[pluginName] = function () {
    var args = arguments?[].slice.call(arguments):null, inst;

    if (!args[0] || typeof args[0] === 'object') {
      this.each(function() {
        if (!$(this).is('img'))
          console.log('ERROR: Clicklight can only be instantiated on images\n', this, 'will be skipped');
        else
          $.data(this, 'cl-instance') ?
            console.log('ERROR: Clicklight cannot be instantiated twice on', this) :
            $.data(this, 'cl-instance', new Clicklight(this, args[0]||null));
      });
    } else if (typeof args[0] === 'string') {
      if (args[0] in public_api) {
        this.each(function() {
          var inst = $.data(this, 'cl-instance')||null;
          if (!inst)
            console.log('ERROR: no Clicklight instance found on', this);
          else
            inst[args[0]].apply(inst, args.slice(1));
        });
      } else
        console.log('ERROR: Unknown method call', args[0]);
    } else
      console.log('ERROR: unknown call on clicklight with argument', args[0]);

    return this;
  }
})(jQuery, undefined);