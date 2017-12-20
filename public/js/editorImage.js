(function (jQuery) {
    jQuery.Redactor.prototype.imagemanager = function () {
        return {
            page: 1,
            search_term: '',
            timeout: null,

            getTemplate: function () {
                return String()
                    + '<section id="redactor-modal-image-manager">'
                    + '<input id="redactor-modal-search-input" placeholder="Enter search here" />'
                    + '<div id="redactor-image-manager-box"></div>'
                    + '<section>'
                    + '<button id="redactor-modal-button-next">Next</button>'
                    + '<button id="redactor-modal-button-prev">Prev</button>'
                    + '<button id="redactor-modal-button-cancel">Cancel</button>'
                    + '</section>'
                    + '</section>';
            },

            init: function () {
                if (!this.opts.imageManagerJson) return;

                this.imagemanager.page = 1;

                var button = this.button.add('photos', '<i class="re-icon-image"></i>');
                this.button.addCallback(button, this.imagemanager.load);
            },

            load: function () {
                var next, prev, search;
                this.modal.addTemplate('imagemanager', this.imagemanager.getTemplate());
                this.modal.load('imagemanager', 'Insert Image', 960);
                next = this.$modalBody.find("#redactor-modal-button-next");
                next.on('click', this.imagemanager.next);
                prev = this.$modalBody.find("#redactor-modal-button-prev");
                prev.on('click', this.imagemanager.prev);
                search = this.$modalBody.find("#redactor-modal-search-input");
                search.on('keyup', this.imagemanager.searchImages);
                this.modal.show();
                this.imagemanager.fetch();
                this.selection.save();
            },

            insert: function (e) {
                var src, alt;
                this.modal.close();
                src = $(e.target).attr('rel');
                src = src.substring(0, src.indexOf('?'));
                alt = $(e.target).attr('alt');
                this.insert.html('<img src="' + src + '?crop=entropy&fit=clip&max-h=500&max-w=720&wm=jpg&q=90" alt="' + alt + '">');
            },

            fetch: function () {
                var url = this.opts.imageManagerJson + '?page=' + this.imagemanager.page ;
                var el = $('#redactor-image-manager-box');
                if(this.imagemanager.search_term != undefined && this.imagemanager.search_term != '') {
                    url = url + "&search=" + this.imagemanager.search_term;
                }

                $.ajax({
                    dataType: "json",
                    cache: false,
                    url: url,
                    success: $.proxy(function (response) {
                        el.html('');
                        $.each(response.data, $.proxy(function (key, image) {
                            var src = TypeRocket.imagePrefix + image.thumbnail_image_editor + '?crop=entropy&w=120&h=120';
                            var img = $('<div class="redactor-image-manager-image"><img src="' + src + '" rel="' + src + '" alt="' + image.caption + '" /></div>');
                            el.append(img);

                            $(img).find('img').click($.proxy(this.imagemanager.insert, this));
                        }, this));
                    }, this)
                });
            },

            searchImages: function(e) {
                var that = this;
                clearTimeout(this.imagemanager.timeout);

                // Make a new timeout set to go off in 800ms
                this.imagemanager.timeout = setTimeout(function () {
                    var searchValue = $(e.currentTarget).val();
                    that.imagemanager.search_term = searchValue;
                    that.imagemanager.fetch();
                }, 500);
            },

            next: function () {
                this.imagemanager.page += 1;
                this.imagemanager.fetch();
            },

            prev: function () {
                if( this.imagemanager.page > 1 ) {
                    this.imagemanager.page -= 1;
                    this.imagemanager.fetch();
                }
            }
        };
    };
})(jQuery);
