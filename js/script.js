$(function() {
    
    // holds details about the photo urls
    KT = {};
    KT.food = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    KT.props = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    KT.flowers = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    KT.interiors = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    // some custom events
    KT.PHOTO_PAGE_VIEW_CLICK = 'PHOTO_PAGE_VIEW_CLICK';
    KT.PHOTO_CLICK = 'PHOTO_CLICK';

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
                src: '',
                active: false
            };
        },
        setActive: function(active) {
            this.set('active', active);
            if (active) {
                this.collection.setActive(this);
            }
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
        },
        createPhotos: function(id) {
            this.name = id;
            _.each(this.models, function(model) {
                var view = new PhotoView({model: model});
                this.$('#' + id + 'Container').append(view.render().el);
            });
        },
        setActive: function(model) {
            _.each(this.models, function(model) {
                
            });
        }
    });

    window.PhotoView = Backbone.View.extend({
        tagName:  'li',
        template: _.template($('#photo-template').html()),
        events: {
            'click img': 'onClick',
            'dblclick img': 'onDoubleClick',
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        onClick: function(evt) {
            if (!this.model.get('active')) {
                $('a', $(this.el)).addClass('active');
                this.model.setActive(true);
            }
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
        setActive: function(active) {
            this.set('active', active);
            if (active) {
                // tell the rest of the collection that a 
                // model has it's active flag set
                this.collection.setActive(this);
            }
        }
    });

    window.PhotoPageList = Backbone.Collection.extend({
        model: PhotoPageModel,
        initialize: function() {
            
        },
        postCreate: function(id) {
            this.id = id;
            this.createControls(id);
        },
        createControls: function(id) {
            _.each(this.models, function(item, index, array) {
                var view = new PhotoPageView({model: item});
                this.$('#' + id + 'Controls').append(view.render().el);
            });
        },
        setActive: function(model) {
            var indexClicked = model.get('index');
            _.each(this.models, function(item, index, array) {
                if (item.get('index') !== indexClicked) {
                    item.setActive(false);
                }
            });
            this.trigger(KT.PHOTO_PAGE_VIEW_CLICK, [indexClicked]);
            this.checkPreviousNextButtons();
        },
        checkPreviousNextButtons: function() {
            var firstPageModel = this.models[1], lastPageModel = this.models[this.models.length - 2];
            if (firstPageModel.get('active')) {
                this.models[0].set('enabled', false);
            }
            if (lastPageModel.get('active')) {
                this.models[this.models.length - 1].set('enabled', false);
            }
        }
    });

    window.PhotoPageView = Backbone.View.extend({
        tagName:  'li',
        template: _.template($('#photo-page-template').html()),
        events: {
            'click': 'onClick',
        },
        initialize: function() {
            this.model.bind('change', this.onModelChange, this);
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        onClick: function(evt) {
            evt.preventDefault();
            if (!this.isPreviousNextButton()) {
                $('a', $(this.el)).addClass('active');
            }
            this.model.setActive(true);
        },
        setActive: function(active) {
            if (!this.isPreviousNextButton()) {
                active ? $('a', $(this.el)).addClass('active') : $('a', $(this.el)).removeClass('active');
            }
        },
        setEnabled: function(enabled) {
            if (this.isPreviousNextButton()) {
                enabled ? $('a', $(this.el)).removeClass('disabled') : $('a', $(this.el)).removeClass('disabled');
            }
        },
        onModelChange: function() {
            this.setActive(this.model.get('active'));
            this.setEnabled(this.model.get('enabled'));
        },
        isPreviousNextButton: function() {
            var index = this.model.get('index');
            return index !== 0 && index !== this.model.collection.length - 1;
        }
    });

    window.GalleryModel = Backbone.Model.extend({
        defaults: function() {
            return {
                currentIndex: 0
            };
        },
        initialize: function() {
            this.get('pageList').bind(KT.PHOTO_PAGE_VIEW_CLICK, this.onPageListChange, this);
            this.get('photoList').bind(KT.PHOTO_CLICK, this.onPhotoListChange, this);
        },
        onPageListChange: function(indexClicked) {
            this.set('currentIndex', indexClicked);
        },
        onPhotoListChange: function(indexClicked) {
            this.set('currentIndex', indexClicked);
        },
        numberOfPhotos: function() {
            
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
            var photoList = new window.PhotoList(this.generateImageSourcesForPhotoList(id)), gm,
            photoPageList = new window.PhotoPageList(this.generateImageControlsForPhotoPageList(id));
            photoList.postCreate(id);
            photoPageList.postCreate(id);
            galleryModel = new window.GalleryModel({photoList: photoList, pageList: photoPageList});
            this.gallaries[id] = new window.GalleryView({el: $('#' + id), model: galleryModel});
        },
        randomizeStartImage: function() {
            var arr = ['food', 'props', 'flowers', 'interiors'];
            return '/images/' + arr[Math.floor(Math.random() * 4)] + '/' + this.determineImageSize() + '/1.jpg';
        },
        generateImageSourcesForPhotoList: function(id) {
            var arr = KT[id], determineImageSize = this.determineImageSize;
            _.each(arr, function(item, index, array) {
                arr[index] = {src: '/images/' + id + '/' + determineImageSize() + '/' + item};
            });
            return arr;
        },
        generateImageControlsForPhotoPageList: function(id) {
            var arr = KT[id], res = [];
            res.push({index: 0, innerHTML: '&larr; Previous', enabled: false});
            _.each(arr, function(item, index, array) {
                res.push({index: index + 1, innerHTML: index + 1, enabled: true, active: index === 0});
            });
            res.push({index: arr.length - 1, innerHTML: '&rarr; Next', enabled: true});
            return res;
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
