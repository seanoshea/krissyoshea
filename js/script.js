$(function() {

    window.NavigationElement = Backbone.Model.extend({
        defaults: function() {
            return {
                selected: false,
                page: ''
            };
        },
        toggleSelected: function() {
            this.selected = this.get('selected') ? false : true;
        }
    });

    window.NavigationElementList = Backbone.Collection.extend({
        model: NavigationElement,
        navigationClicked: function(page) {
            
        },
        homeClicked: function(evt) {
            this.navigationClicked('home');
        }
    });

    window.Navigation = new NavigationElementList;

    window.ApplicationView = Backbone.View.extend({
        el: $("#container"),
        events: {
            "click #banner": "homeClicked",
            "click #license": "licenseClicked"
        },
        initialize: function() {
            this.cssSplash = this.$('#cssSplash');
            this.imageSplash = this.$('#imageSplash');
            this.licenseShown = false;
            this.licenseContent = this.$('#footer .license');
            this.displaySplash();
            this.loadHomePageImage();
        },
        render: function() {
            
        },
        displaySplash: function() {
            if ($('html').hasClass('csstransforms')) {
                this.toggleShow(this.cssSplash, true);
            } else {
                this.imageSplash.attr('src', 'images/chrome/spinner.gif');
                this.imageSplash.css('display', '');
                this.toggleShow(this.imageSplash, true);
            }
        },
        loadHomePageImage: function() {
            var img = new Image();
            $(img).load(function() {
                setTimeout(function() {
                    window.Application.fadeSplash();
                }, 250);
            }).error(function() {
            }).attr('src', 'images/second-hand-life/large/1.jpg');
        },
        fadeSplash: function() {
            $('#loading').fadeOut('fast', function() {
                $('#main').fadeIn('slow');
                $('#body').attr('aria-busy', 'false');
                setTimeout(function() {
                    $('#nav').fadeIn('slow');
                    $('#footer').fadeIn('slow');
                }, 250);
            });
        },
        homeClicked: function(evt) {
            window.Navigation.homeClicked(evt);
        },
        licenseClicked: function(evt) {
           if (!this.licenseShown) {
                this.licenseContent.fadeIn('slow', function() {
                    window.Application.toggleShow($(this), true);
                });
           } else {
                this.licenseContent.fadeOut('slow', function() {
                    window.Application.toggleShow($(this));
                });
           }
           this.licenseShown = !this.licenseShown;
        },
        toggleShow: function(node, show) {
            if (show) {
                $(node).css('display', '');
                $(node).attr('aria-hidden', 'false');
            } else {
                $(node).css('display', 'none');
                $(node).attr('aria-hidden', 'true');
            }
        }
    });
    window.Application = new ApplicationView;
});
