(function($, Backbone) {
  "use strict";

  const $doc = $(document);
  const $win = $(window);
  const $body = $("body");

  const Models = {};
  const Views = {};

  const families = {
    "Material Icons": 'regular',
    "Material Icons Outlined": 'outlined',
    "Material Icons Round": 'round',
    "Material Icons Sharp": 'sharp',
    "Material Icons Two Tone": 'two-tones'
  };

  let activeFont = "Material Icons";

  const renderData = function (dataIcons) {
    let icons = [];
    const categories = {};
    dataIcons.forEach(function(icon) {
      (icon.categories || []).forEach(function(category) {
        const name = icon.name || '';
        if (icon.unsupported_families.indexOf(activeFont) !== -1) return;
        categories[category] || (categories[category] = []);
        categories[category] = categories[category].concat({
          category: category,
          caption: name.replace(/_/g, ' '),
          highlighted: name.replace(/_/g, ' '),
          className: name.replace(/_/g, '-'),
          content: name,
          tags: icon.tags || [],
          version: icon.version,
          unsupported: icon.unsupported_families.map(family => families[family]),
          font: activeFont
        });
      })
    });
    const keys = Object.keys(categories);
    keys.sort();
    keys.forEach(category => {
      icons = icons.concat(categories[category]);
    })
    const view = new Views.Icons({collection: new Models.Icons(icons)});
    view.render();
  };

  Models.Icon = Backbone.Model.extend();

  Models.Icons = Backbone.Collection.extend({
    model: Models.Icon
  });

  Views.Icon = Backbone.View.extend({
    tagName: 'div',
    className: 'item-container',
    template: _.template($('#grid-item').html()),
    events : {
      "click" : "showSnackBar"
    },

    initialize: function (options) {
      this.listenTo(this.model, 'hideSnackBar', this.hideSnackBar);
      _.bindAll(this, 'render', 'hideSnackBar');
    },

    render: function () {
      $(this.el).html(this.template(this.model.attributes));
      return this;
    },

    showSnackBar: function() {
      $body.click();
      this.model.trigger('hideSnackBar');
      $(this.el).addClass("selected");
      const view = new Views.snackbarView({model: this.model});
      navigate(this.model.attributes.className);
      view.render();
      return false;
    },

    hideSnackBar: function() {
      $(this.el).removeClass("selected");
      navigate();
    }
  });

  Views.snackbarView = Backbone.View.extend({
    container: $('#snackbar'),
    template: _.template($('#snackbar-template').html()),

    initialize: function (options) {
      this.collection = options.collection;
      $body.on("click.snackbar focus.snackbar", $.proxy(this.hide, this));
      this.container.on('click', ".container", e => {
        if (e.target.tagName == 'A') {
          window.open($(e.target).attr('href'), '_blank')
        }
        e.preventDefault();
        return false;
      });
      this.container.on('click', '.clear-icon', $.proxy(this.hide, this));
    },

    render: function () {
      let hidden = !this.container.children(".container:not(:hidden)").length;
      this.container.empty();
      this.container.append(this.template(this.model.attributes));
      if (hidden) {
        this.container.children(".container").hide().slideDown('fast');
      } else {
        this.container.children(".container").stop(0, 0).slideDown('fast');
      }
    },

    hide: function() {
      this.model.trigger('hideSnackBar');
      this.container.children(".container").slideUp('fast');
      $body.off("click.snackbar focus.snackbar");
      this.container.off('click');
    }
  });

  Views.Icons = Backbone.View.extend({
    container: $('#grid-container'),
    empty_content: $('#empty-grid').html(),
    search_input: $('#search'),
    search_clear: $('#search-panel .clear-icon'),

    initialize: function (options) {
      this.collection = options.collection;
      this.search_input.bind('keyup', $.proxy(this.search, this));
      this.search_clear.bind('click', $.proxy(this.clear_search, this));
      _.bindAll(this, 'render');
    },

    clear_search : function() {
      this.search_input.val('');
      this.search_input.focus();
      this.search();
      return this;
    },

    search: function () {
      let str = this.search_input.val();
      if (str.length > 0) {
        this.search_clear.show();
      } else {
        this.search_clear.hide();
      }
      str = str.replace(/[\-_]+/g, ' ').replace(/\s+/, ' ').trim().toLowerCase();

      if (str.length > 0) {
        let models = this.collection.filter(function (item) {
          let caption = item.get("caption");
          if (caption.indexOf(str) > -1) {
            item.set("highlighted", '<span>' + caption.replace(str, '</span><i>' + str + '</i><span>').replace(/\s/g, '&nbsp;') + '</span>');
            return true;
          }
          return false;
        });
        this.render(models);
      } else {
        let models = this.collection.each(function (item) {
          item.set("highlighted", item.get("caption"));
        });
        this.render(models);
      }
      $('body, html').animate({scrollTop: this.container.offset().top - 64}, 0);
      return this;
    },

    render: function (searchCollection) {
      let category = null;
      let grid = $("<div/>", {"class" : "grid"});
      let self = this;
      let models = searchCollection || this.collection;
      this.container.empty();

      models.forEach(function (item) {
        let itemView = new Views.Icon({model: item});
        if (category === null) {
          category = item.get('category');
        }
        if (category !== item.get('category')) {
          $("<h2/>").html(category.charAt(0).toUpperCase() + category.slice(1)).
            appendTo(self.container);
          grid.appendTo(self.container);

          category = item.get('category');
          grid = $("<div/>", {"class" : "grid"});
          grid.append(itemView.render().el);
        } else {
          grid.append(itemView.render().el);
        }
      });

      if (category !== null) {
        $("<h2/>").html(category.charAt(0).toUpperCase() + category.slice(1)).appendTo(this.container);
        grid.appendTo(this.container);
      } else {
        this.container.html(self.empty_content);
      }

      return this;
    }
  });

  let Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ":query": "item",
    },
    index: function() {
      renderData(window.metadata.icons);
    },

    item: function(query) {
      renderData(window.metadata.icons);
      setTimeout(function() {
        let item = $(".item-container > .item > .mdi.mdi-" + query.replace(/[^0-9a-zA-Z]/g, '-'))
          .closest(".item-container");
        if (item.length) {
          item.trigger("click");
          $('body, html').animate({scrollTop: item.offset().top - 74}, 0);
        }
      }, 50);
    }
  });

  const navigate = function(hash) {
    const scrollTop = $win.scrollTop();
    Backbone.history.navigate(hash, false);
    $('body, html').animate({scrollTop: scrollTop}, 0);
  };

  $doc.ready(function () {
    let is_fixed_search = false;
    const search_panel = $("#search-panel");
    const header_panel = $("#head-panel");

    $win.on("scroll resize", function () {
      if ($win.scrollTop() > header_panel.outerHeight()) {
        if (!is_fixed_search) {
          is_fixed_search = true;
          search_panel.addClass("top-fixed");
        }
      } else {
        if (is_fixed_search) {
          is_fixed_search = false;
          search_panel.removeClass("top-fixed");
        }
      }
    });

    $body.on("focus", "textarea.code", function() {
      const $this = $(this);
      $this.select();
      window.setTimeout(function() {
        $this.select();
      }, 1);
      function mouseUpHandler() {
        $this.off("mouseup", mouseUpHandler);
        return false;
      }
      $this.mouseup(mouseUpHandler);
    });

    $("#snackbar").on("click focus", function(e) {
      e.preventDefault();
      return false;
    });

    new Router;
    Backbone.history.start();

  });
}) (jQuery, Backbone);
