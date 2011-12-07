$(function() {
    
    // holds details about the photo urls
    KT = {};
    KT.food = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    KT.props = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    KT.flowers = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    KT.interiors = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];

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
            $('li a', this.el).each(function(index, item, array) {
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
            var id = evt.target.id.replace(/MenuItem/, '');
            if (!window.Application.hasGallery(id)) {
                window.Application.createGallery(id);
            }
            window.Router.navigate(id, true);
            window.Application.selectPane(id);
            this.togglePortfolioMenu(true);
        },
        togglePortfolioMenu: function(forceHide) {
            var wasOpen = forceHide || this.open;
            this.el.slideToggle('fast', function() {
                window.Application.toggleShow($(this), !wasOpen);
                window.PortfolioNavigation.open = !wasOpen;
            });
        }
    });

    // GALLERY

    window.PhotoModel = Backbone.Model.extend({
        defaults: function() {
            return {
                src: ''
            };
        }
    });

    window.PhotoList = Backbone.Collection.extend({
        name: '',
        model: PhotoModel,
        initialize: function() {

        },
        postCreate: function(id) {
            this.id = id;
            this.createPhotos(id);
            this.createControls(id);
        },
        createPhotos: function(id) {
            this.name = id;
            _.each(this.models, function(model) {
                var view = new PhotoView({model: model});
                this.$('#' + id + 'Container').append(view.render().el);
            });
        },
        createControls: function(id) {
            var startPageView = new PhotoPageView({model: new PhotoPageModel({index: 0, innerHTML: '&larr; Previous', enabled: false})}),
            endPageView = new PhotoPageView({model: new PhotoPageModel({index: this.models.length - 1, innerHTML: 'Next &rarr;', enabled: true})});
            $('#' + id + 'Controls').append(startPageView.render().el);
            _.each(this.models, function(item, index, array) {
                var model = new PhotoPageModel({index: index + 1, innerHTML: index + 1, active: index === 0, enabled: true}),
                view = new PhotoPageView({model: model});
                this.$('#' + id + 'Controls').append(view.render().el);
            });
            $('#' + id + 'Controls').append(endPageView.render().el);
        }
    });

    window.PhotoView = Backbone.View.extend({
        tagName:  'li',
        template: _.template($('#photo-template').html()),
        events: {
            'dblclick img': 'onDoubleClick',
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        onDoubleClick: function(evt) {

        }
    });

    window.PhotoPageModel = Backbone.Model.extend({
        defaults: function() {
            return {
                index: 0,
                enabled: true,
                active: false
            };
        },
        setActive: function() {
            
        }
    });

    window.PhotoPageView = Backbone.View.extend({
        tagName:  'li',
        template: _.template($('#photo-page-template').html()),
        events: {
            'click': 'onClick',
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        onClick: function(evt) {
            evt.preventDefault();
            $('a', $(this.el)).addClass('active');
            this.model.setActive(evt);
        }
    });

    window.GalleryModel = Backbone.Model.extend({
        position: 0,
        list: null,
        numberOfElements: function() {
            
        }
    });

    window.GalleryView = Backbone.View.extend({
        events: {
            'keypress ul': 'onKeyPress',
        },
        initialize: function() {
            
        },
        onKeyPress: function(evt) {
            
        }
    });

    window.ApplicationView = Backbone.View.extend({
        el: $('#container'),
        events: {
            'click #banner': 'homeClicked',
            'click #license': 'licenseClicked',
            'click #homePageImage': 'homePageImageClicked'
        },
        gallaries: {},
        initialize: function() {
            this.cssSplash = this.$('#cssSplash');
            this.imageSplash = this.$('#imageSplash');
            this.licenseShown = false;
            this.licenseContent = this.$('#footer .license');
            this.displaySplash();
            if (window.location.hash) {
                this.loadHomePageImage();
            } else {
                this.loadHomePageImage();
            }
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
            var img = new Image(), src = this.randomizeStartImage();
            img.src = src;
            $(img).load(function() {
                setTimeout(function() {
                    window.Application.fadeSplash();
                }, 250);
            }).error(function() {
            }).attr('src', src);
            $('#homePageImage').attr('src', src);
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
        hasGallery: function(id) {
            return this.gallaries[id];
        },
        createGallery: function(id) {
            var photoList = new window.PhotoList(this.generateImageSourcesForGallery(id)), gm;
            photoList.postCreate(id);
            galleryModel = new window.GalleryModel({list: photoList});
            this.gallaries[id] = new window.GalleryView({el: $('#' + id), model: galleryModel, name: 'Food'});
        },
        randomizeStartImage: function() {
            var arr = ['food', 'props', 'flowers', 'interiors'];
            return '/images/' + arr[Math.floor(Math.random() * 4)] + '/' + this.determineImageSize() + '/1.jpg';
        },
        generateImageSourcesForGallery: function(id) {
            var arr = KT[id], determineImageSize = this.determineImageSize;
            _.each(arr, function(item, index, array) {
                arr[index] = {src: '/images/' + id + '/' + determineImageSize() + '/' + item};
            });
            return arr;
        },
        determineImageSize: function() {
            // TODO - mobile detection
            return 'large';
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
