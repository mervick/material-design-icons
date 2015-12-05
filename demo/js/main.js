var collection,
    models = {},
    views = {},
    data2items = function(data) {
        var icons = [],
            categories = [];
        $.each(data, function(category, items) {
            $.each(items, function(content, code) {
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

        collection = new models.Icons(icons);
        var view = new views.Icons({ collection: collection});
        view.render();
    };

models.Icon = Backbone.Model.extend();

models.Icons = Backbone.Collection.extend({
    model: models.Icon
});

views.Icon = Backbone.View.extend({
    tagName: 'div',
    className: 'item-container',
    template: _.template( $('#grid-item').html() ),

    initialize: function(options) {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
    },

    render: function() {
        jQuery(this.el).empty();
        jQuery(this.el).append(this.template(this.model.attributes));
        return this;
    }
});

views.Icons = Backbone.View.extend({
    collection: null,
    container: '#grid-container',
    template: _.template( $('#grid').html() ),
    empty_content: $('#empty-grid').html(),

    initialize: function(options) {
        this.collection = options.collection;
        _.bindAll(this, 'render');

        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
    },

    render: function() {
        var container = jQuery(this.container);
        container.empty();

        var category = null,
            content = $("<div/>"),
            self = this;
        this.collection.forEach(function(item) {
            var itemView = new views.Icon({
                model: item
            });
            if (category === null) {
                category = item.get('category');
            }
            if (category !== item.get('category')) {
                container.append(self.template({category: category.charAt(0).toUpperCase() + category.slice(1), content: content.html()}));
                content.html(itemView.render().el);
                category = item.get('category');
            } else {
                content.append(itemView.render().el);
            }
        });
        if (category !== null) {
            container.append(this.template({category: category.charAt(0).toUpperCase() + category.slice(1), content: content.html()}));
        } else {
            container.html(this.empty_content);
        }

        return this;
    }
});

$(document).ready(function() {
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
    data2items(window.data);
});
