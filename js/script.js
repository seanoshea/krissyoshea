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
            window.Router.navigate(page, true);
        },
        homeClicked: function(evt) {
            this.navigationClicked('home');
        },
        portfolioClicked: function(evt) {
            
        }
    });

    window.NavigationList = new NavigationElementList;
    window.PortfolioNavigationList = new NavigationElementList;

    window.NavigationView = Backbone.View.extend({
        el: $('#nav'),
        events: {
            'click a': 'navigationClicked'
        },
        navigationClicked: function(evt) {
            var id = evt.target.id;
            if (id !== 'portfolio') {
                window.Router.navigate(id, true);
                this.markSelected(id);
                this.togglePortfolioMenu(true);
            } else {
                this.togglePortfolioMenu();
            }
        },
        markSelected: function(id) {
            $('li', this.el).each(function(index, item, array) {
                item.id === id ? $(item).addClass('selected') : $(item).removeClass('selected');
            });
            window.Application.selectPane(id);
        },
        togglePortfolioMenu: function(forceHide) {
            window.PortfolioNavigation.togglePortfolioMenu(forceHide);
        }
    });

    window.PortfolioNavigationView = Backbone.View.extend({
        el: $('#portfolioMenu'),
        open: false,
        events: {
            'click a': 'navigationClicked'
        },
        navigationClicked: function(evt) {
            var id = evt.target.id;
        },
        togglePortfolioMenu: function(forceHide) {
            var wasOpen = forceHide || this.open;
            this.el.slideToggle('fast', function() {
                window.Application.toggleShow($(this), !wasOpen);
                window.PortfolioNavigation.open = !wasOpen;
            });
        }
    });

    window.ApplicationView = Backbone.View.extend({
        el: $('#container'),
        events: {
            'click #banner': 'homeClicked',
            'click #license': 'licenseClicked',
            'click #homePageImage': 'homePageImageClicked'
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
            window.NavigationList.homeClicked(evt);
            this.selectPane('home');
        },
        homePageImageClicked: function(evt) {
            window.NavigationList.portfolioClicked(evt);
            // window.PortfolioNavigation.selectPortfolio();
        },
        selectPane: function(id) {
            var idSuffix = 'Content';
            $('.content', this.el).each(function(index, item, array) {
                if (item.id === id + idSuffix) {
                    window.Application.toggleShow(item, true);
                } else {
                    window.Application.toggleShow(item, false);
                }
            });
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
    window.ApplicationRouter = Backbone.Router.extend({
        routes: {
            'home': 'home',
            'bio': 'bio',
            'news': 'news',
            'contact':'contact'
        },
        home: function() {
            
        },
        bio: function() {
            
        },
        news: function() {
            
        },
        contact: function() {
            
        }
    });
    window.Router = new ApplicationRouter;
    window.Navigation = new NavigationView;
    window.PortfolioNavigation = new PortfolioNavigationView;
    Backbone.history.start();
});
