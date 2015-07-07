var colorDragger = {

    settings: {
        paletteContainer: $('#palette'),
        selectedContainer: $('#selected'),
        controlsContainer: $('#controls')
    },

    templates: {
        selectedColor: '' +
            '<li data-id="{{id}}" style="background-image: url({{image}})">' +
                '<p>{{id}} {{name}}</p>' +
                '<button class="btn btn-xs btn-default remove">remove</button>' +
            '</li>',
        paletteColor: '' +
            '<li class="selectable" data-name="{{name}}" title="{{id}} {{name}}" data-id="{{id}}" data-image="optimisedimages/{{image_id}}-150x150.png">' +
                '<img src="optimisedimages/{{image_id}}-150x150.png" />' +
            '</li>'
    },

    init: function() {

        this.bindEvents();

        this.loadYarns('jamiesons');

        this.selectedColors = [];
    },

    bindEvents: function () {
        var that = this;

        this.settings.paletteContainer.on('click', 'li', function(e) {
            that.addColorToSelected($(this))
        });

        this.settings.selectedContainer.on('click', 'button.remove', function(e) {
            that.removeColorFromSelected($(this).closest('li'))
        });

        this.settings.controlsContainer.on('click', 'button.clear', function(e) {
            that.clearAllSelections();
        });

        this.settings.selectedContainer.sortable();
        this.settings.selectedContainer.disableSelection();
    },

    loadYarns: function(yarnset) {
        var that = this;
        var jqxhr = $.get('js/data.json', function() {

        }).done(function(data){
            for(var i = 0, il = data.yarnsets.length; i < il; i++) {
                if(data.yarnsets[i].name === yarnset) {
                    that.yarns = data.yarnsets[i].yarns;
                    that.populateYarnPalette();
                }
            }
        });
    },

    populateYarnPalette: function () {
        var template = Handlebars.compile(this.templates.paletteColor);

        for (var i = 0, il = this.yarns.length; i < il; i++) {
            var yarnItem = template(this.yarns[i]);

            this.settings.paletteContainer.append(yarnItem)
        }

    },

    addColorToSelected: function (el) {
        var template = Handlebars.compile(this.templates.selectedColor);

        var newColor = template({
            name: el.data('name'),
            image: el.data('image'),
            id: el.data('id')
        });

        this.selectedColors.push(el.data('id'));

        this.updateSelectionHighlights();

        this.settings.selectedContainer.append(newColor);
    },

    removeColorFromSelected: function (el) {
        for(var i = 0, il = this.selectedColors.length; i < il; i++) {
            if(el.data('id') === this.selectedColors[i]) {
                this.selectedColors.splice(i, 1);
                break;
            }
        }

        el.remove();

        this.updateSelectionHighlights();
    },

    updateSelectionHighlights: function () {
        // remove all highlighting
        this.settings.paletteContainer.children('li').removeClass('selected');

        // highlight currently-selected colors
        for(var i = 0, il = this.selectedColors.length; i < il; i++) {
            this.settings.paletteContainer.find('[data-id=' + this.selectedColors[i] + ']').addClass('selected');
        }
    },

    clearAllSelections: function () {
        this.settings.selectedContainer.empty();
        this.selectedColors = [];

        this.updateSelectionHighlights();
    }
};

colorDragger.init();
