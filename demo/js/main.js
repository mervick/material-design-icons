(function($, Backbone) {

    var models = {},
        views = {},
        renderData = function (data) {
            var icons = [],
                categories = [];
            $.each(data, function (category, items) {
                $.each(items, function (content, code) {
                    categories.push(category);
                    icons.push({
                        category: category,
                        caption: content.replace(/_/g, ' '),
                        className: content.replace(/_/g, '-'),
                        content: content,
                        code: code,
                    });
                });
            });
            var view = new views.Icons({collection: new models.Icons(icons)});
            view.render();
        };

    models.Icon = Backbone.Model.extend();

    models.Icons = Backbone.Collection.extend({
        model: models.Icon
    });

    views.Icon = Backbone.View.extend({
        tagName: 'div',
        className: 'item-container',
        template: _.template($('#grid-item').html()),
        initialize: function (options) {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
        },
        render: function () {
            jQuery(this.el).empty();
            jQuery(this.el).append(this.template(this.model.attributes));
            return this;
        }
    });
    views.snackbarView = Backbone.View.extend({
        container: $('#snackbar'),
        initialize: function (options) {
            this.collection = options.collection;
            this.search_input.bind('keyup', $.proxy(this.search, this));
            _.bindAll(this, 'render');
        },
    });

    views.Icons = Backbone.View.extend({
        container: $('#grid-container'),
        template: _.template($('#grid').html()),
        empty_content: $('#empty-grid').html(),
        search_input: $('#search'),
        initialize: function (options) {
            this.collection = options.collection;
            this.search_input.bind('keyup', $.proxy(this.search, this));
            _.bindAll(this, 'render');
        },
        search: function () {
            var str = this.search_input.val().replace(/[\-_]+/g, ' ').replace(/\s+/, ' ').trim();
            if (str.length > 0) {
                var models = this.collection.filter(function (item) {
                    return item.get("caption").indexOf(str) > -1
                });
                this.render(models);
            } else {
                this.render();
            }
            $('body, html').animate({scrollTop: $(this.container).offset().top - 64}, 0);
        },
        render: function (searchCollection) {
            var container = $(this.container),
                category = null,
                content = $("<div/>"),
                self = this,
                models = searchCollection || this.collection;
            container.empty();
            models.forEach(function (item) {
                var itemView = new views.Icon({
                    model: item
                });
                if (category === null) {
                    category = item.get('category');
                }
                if (category !== item.get('category')) {
                    container.append(self.template({
                        category: category.charAt(0).toUpperCase() +
                        category.slice(1), content: content.html()
                    }));
                    content.html(itemView.render().el);
                    category = item.get('category');
                } else {
                    content.append(itemView.render().el);
                }
            });
            if (category !== null) {
                container.append(this.template({
                    category: category.charAt(0).toUpperCase() +
                    category.slice(1), content: content.html()
                }));
            } else {
                container.html(this.empty_content);
            }
            return this;
        }
    });

    $(document).ready(function () {
        var search_fixed = false,
            $win = $(window),
            search_panel = $("#search-panel"),
            header = $("#head-panel");
        $win.on("scroll resize", function () {
            var top = $win.scrollTop(),
                height = header.outerHeight();
            if (top > height) {
                if (!search_fixed) {
                    search_fixed = true;
                    search_panel.addClass("top-fixed");
                }
            } else {
                if (search_fixed) {
                    search_fixed = false;
                    search_panel.removeClass("top-fixed");
                }
            }
        });

        renderData(window.data);

        $("textarea.code").focus(function() {
            var $this = $(this);
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

    });
}) (jQuery, Backbone);
