(function($, Backbone) {
  "use strict";

  const $doc = $(document);
  const $win = $(window);
  const $body = $("body");

  const Models = {};
  const Views = {};
  const Icons = {};

  const themes = {
    'REGULAR': "Material Icons",
    'OUTLINED': "Material Icons Outlined",
    'ROUND': "Material Icons Round",
    'SHARP': "Material Icons Sharp",
    'TWO_TONE': "Material Icons Two Tone",
  };

  const themesArr = Object.keys(themes);

  const fonts =_.invert(themes)

  const mdiClasses = {
    "REGULAR": 'mdi',
    "OUTLINED": 'mdi-outlined',
    "ROUND": 'mdi-round',
    "SHARP": 'mdi-sharp',
    "TWO_TONE": 'mdi-two-tone'
  };

  const ligatureClasses = {
    "REGULAR": 'material-icons',
    "OUTLINED": 'material-icons-outlined',
    "ROUND": 'material-icons-round',
    "SHARP": 'material-icons-sharp',
    "TWO_TONE": 'material-icons-two-tone'
  };

  const THEME_ALL = 'THEME_ALL';
  let activeTheme = THEME_ALL;

  const fix_unsupported = {
    content_copy: ["Material Icons"],
    content_cut: ["Material Icons"],
    content_paste: ["Material Icons"]
  };

  let latest = 0;
  function debug(name, start) {
    const now = performance.now();
    console.log(name, Math.floor((now - start) * 100) / 100, Math.floor((now - latest) * 100) / 100);
    latest = now;
  }

  const appViews = {};
  const getView = function(name, args) {
    return appViews[name] || (appViews[name] = new Views[name](args));
  }

  const renderApp = function () {
    Icons.hash = {};
    let icons = [];
    const categories = {};

    window.metadata.icons.forEach(function(icon) {
      (icon.categories || []).forEach(function(category) {
        const name = icon.name || '';
        let themeIndex = 0;
        let theme = activeTheme === THEME_ALL ? themesArr[themeIndex] : activeTheme;
        let font = themes[theme];

        while (icon.unsupported_families.indexOf(font) !== -1 ||
          (fix_unsupported[name] && fix_unsupported[name].indexOf(font) !== -1)) {
          if (activeTheme === THEME_ALL && themeIndex < 4) {
            theme = themesArr[++themeIndex];
            font = themes[theme];
          } else {
            return;
          }
        }

        const caption = name.replace(/_/g, ' ');
        const data = {
          name: name,
          mdiClass: mdiClasses[theme],
          ligatureClass: ligatureClasses[theme],
          font: font,
          category: category,
          caption: caption,
          highlighted: caption,
          className: name.replace(/_/g, '-'),
          content: name,
          tags: icon.tags || [],
          version: icon.version,
        };

        (categories[category] || (categories[category] = [])).push(data);
        if (!Icons.hash[name]) {
          Icons.hash[name] = data;
        }
      })
    });

    const keys = Object.keys(categories);
    keys.sort();
    keys.forEach(category => {
      Array.prototype.push.apply(icons, categories[category]);
    })
    Icons.list = icons;

    getView('Icons').render();
    getView('Sidebar').render();
  };

  Views.Icon = Backbone.View.extend({
    tagName: 'div',
    className: 'item-container',
    template: _.template($('#grid-item').html(), null, {variable: "icon"}),
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
      const view = new Views.Snackbar({model: this.model});
      navigate(this.model.attributes.className);
      view.render();
      return false;
    },

    hideSnackBar: function() {
      $(this.el).removeClass("selected");
      navigate();
    }
  });

  Views.Snackbar = Backbone.View.extend({
    container: $('#snackbar'),
    template: _.template($('#snackbar-template').html()),

    initialize: function () {
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

    render: function (model) {
      let hidden = !this.container.children(".container:not(:hidden)").length;
      this.container.empty();
      this.container.append(this.template(model));
      if (hidden) {
        this.container.children(".container").hide().slideDown('fast');
      } else {
        this.container.children(".container").stop(0, 0).slideDown('fast');
      }
    },

    hide: function() {
      getView('Icons').hideSnackBar();
      this.container.children(".container").slideUp('fast');
      // $body.off("click.snackbar focus.snackbar");
      // this.container.off('click');
    }
  });

  Views.Sidebar = Backbone.View.extend({
    container: $('#sidebar'),
    template: _.template($('#sidebar-template').html()),

    initialize: function (options) {
      const self = this;
      $doc.on('click', '#sidebar .sidebar-themes > li', function() {
        const theme = $(this).data('theme');
        activeTheme = theme;
        self.container.off("click");
        renderApp();
      });
      _.bindAll(this, 'render');
    },

    render: function () {
      $(this.container).html(this.template({theme: activeTheme}));
      return this;
    },
  });

  Views.Icons = Backbone.View.extend({
    container: $('#grid-container'),
    empty_content: $('#empty-grid').html(),
    icon_template: _.template($('#grid-item').html(), null, {variable: "icon"}),
    search_input: $('#search'),
    search_clear: $('#search-panel .clear-icon'),

    initialize: function () {
      $doc.on('click', '#grid-container .item-container', $.proxy(this.showSnackBar, this));
      this.search_input.bind('keyup', $.proxy(this.search, this));
      this.search_clear.bind('click', $.proxy(this.clear_search, this));
      _.bindAll(this, 'render', 'search', 'showSnackBar');
    },

    showSnackBar: function(e) {
      this.activeIcon = $(e.currentTarget);
      const icon = this.activeIcon.attr('data-icon');
      const data = Icons.hash[icon];

      $body.click();
      this.activeIcon.addClass("selected");

      navigate(data.name);
      getView('Snackbar').render(data);
      return false;
    },

    hideSnackBar: function() {
      this.activeIcon.removeClass("selected");
      navigate();
    },

    clear_search : function() {
      this.search_input.val('');
      this.search_input.focus();
      this.render();
      return this;
    },

    search: function() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(this.render, 400);
    },

    render: function () {
      let self = this;
      const initGrid = function() {
        return $("<div/>", {"class" : "grid"});
      }
      const appendCategory = function(grid, category) {
        const cat = $("<div/>", {"class": "grid-category", "id": "cat_" + category});
        $("<h2/>").html(category.charAt(0).toUpperCase() + category.slice(1)).appendTo(cat);
        grid.appendTo(cat);
        cat.appendTo(self.container);
      }

      let search = this.search_input.val();
      const isSearch = search.length > 0;
      if (isSearch) {
        this.search_clear.show();
      } else {
        this.search_clear.hide();
        search = search.replace(/[\-_]+/g, ' ').replace(/\s+/, ' ').trim().toLowerCase();
      }

      let models;
      if (isSearch) {
        models = Icons.list.filter(function(item) {
          let caption = item.caption;
          if (caption.indexOf(search) > -1) {
            item.highlighted = '<span>' + caption.replace(search, '</span><i>' + search + '</i><span>').replace(/\s/g, '&nbsp;') + '</span>';
            return true;
          }
          return false;
        });
      } else {
        models = Icons.list;
      }

      let grid = initGrid();
      this.container.empty();
      let category = null;

      models.forEach(function (item) {
        if (!category) {
          category = item.category;
        }
        if (category !== item.category) {
          appendCategory(grid, category)
          grid = initGrid();
          category = item.category;
        }
        grid.append(self.icon_template(item));
      });

      if (category) {
        appendCategory(grid, category)
      } else {
        this.container.html(this.empty_content);
      }

      isSearch && $('body, html').animate({scrollTop: this.container.offset().top - 64}, 0);

      return this;
    }
  });

  let Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ":query": "item",
    },
    index: function() {
      renderApp();
    },

    item: function(query) {
      renderApp();
      const navigateToIcon = function() {
        let item = $(".item-container > .item > .mdi-" + query.replace(/[^0-9a-zA-Z]/g, '-'))
          .closest(".item-container");
        if (item.length) {
          item.trigger("click");
          $('body, html').animate({scrollTop: item.offset().top - 74}, 0);
        }
      };
      setTimeout(navigateToIcon, 1000);
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
