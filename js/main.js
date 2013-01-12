$(function() {

    KT = {};
    // some API configuration
    KT.apiKey = '3426649638b25fe317be122d3fbbc1b1';
    KT.userId = '91622522@N07';

    // navigational elements in the app.
    KT.panes = ['store', 'biography', 'news', 'contact'];

    // some custom events.
    KT.PHOTO_PAGE_VIEW_CLICK = 'PHOTO_PAGE_VIEW_CLICK';
    KT.PHOTO_CLICK = 'PHOTO_CLICK';
    KT.PHOTO_PREVIOUS_NEXT_CLICK = 'PHOTO_PREVIOUS_NEXT_CLICK';
    KT.FIRST_GALLERY_PHOTO_LOADED = 'FIRST_GALLERY_PHOTO_LOADED';

    // NAVIGATION

    window.NavigationElement = Backbone.Model.extend({
        defaults: function() {
            return {
                active: false,
                page: ''
            };
        },
        toggleSelected: function() {
            this.active = this.get('active') ? false : true;
        }
    });

    window.NavigationElementList = Backbone.Collection.extend({
        model: NavigationElement,
        navigationClicked: function(page) {
            window.Router.navigate(page, true);
        },
        homeClicked: function(evt) {
            this.navigationClicked('home');
        }
    });

    window.NavigationList = new NavigationElementList();

    window.NavigationView = Backbone.View.extend({
        el: $('#nav'),
        events: {
            'click a': 'navigationClicked'
        },
        navigationClicked: function(evt) {
            var id = evt.target.id;
            if (id !== 'photoSets') {
                window.Router.navigate(id, true);
                this.markActive(id);
                this.togglePhotoSetMenu(true);
            } else {
                this.togglePhotoSetMenu();
            }
        },
        markActive: function(id, skip) {
            $('li a', this.el).each(function(index, item, array) {
                if (item.id === id) {
                    $(item).addClass('active');
                } else {
                    $(item).removeClass('active');
                }
            });
            if (!skip) {
                window.Application.selectPane(id);
            }
        },
        togglePhotoSetMenu: function(forceHide) {
            window.PhotoSetNavigation.togglePhotoSetMenu(forceHide);
        }
    });

    window.PhotoSetNavigationModel = Backbone.Model.extend({
        defaults: function() {
            return {
                name: '',
                id: 0,
                last: false
            };
        }
    });

    window.PhotoSetNavigationList = Backbone.Collection.extend({
        model: PhotoSetNavigationModel,
        createPhotoSets: function() {
            _.each(this.models, function(model, key, list) {
                var view = new PhotoSetNavigationView({model: model});
                this.$('#photoSetMenu').append(view.render().el);
            });
        },
        navigationClicked: function(page) {
            window.Router.navigate(page, true);
        },
        homeClicked: function(evt) {
            this.navigationClicked('home');
        }
    });

    window.PhotoSetNavigationView = Backbone.View.extend({
        tagName: 'li',
        open: false,
        events: {
            'click a': 'navigationClicked'
        },
        template: _.template($('#photo-set-template').html()),
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        navigationClicked: function(evt) {
            var id = evt.target.id.replace(/MenuItem/, '');
            window.Application.navigateToGallery(id);
            this.togglePhotoSetMenu(true);
        },
        togglePhotoSetMenu: function(forceHide) {
            var wasOpen = forceHide || this.open, node = $('#photoSetMenu');
            if (!forceHide || this.open) {
                node.slideToggle('fast', function() {
                    window.Application.toggleShow(node, !wasOpen);
                    window.PhotoSetNavigation.open = !wasOpen;
                });
            }
        }
    });

    // PHOTOS

    window.PhotoModel = Backbone.Model.extend({
        defaults: function() {
            return {
                position: 0,
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
            var that = this;
            this.name = id;
            _.each(this.models, function(model, key, list) {
                // the first photo in the list should always be marked as active.
                if (key === 0) {
                    model.set('active', true);
                }
                var view = new PhotoView({model: model});
                this.$('#' + id + 'Container').append(view.render().el);
            });
            $('#' + id + 'Container img').each(function(index, item) {
                if (index === 0) {
                    item.onload = function() {
                        that.trigger(KT.FIRST_GALLERY_PHOTO_LOADED, [id]);
                    };
                }
            });
        },
        setActive: function(model) {
            _.each(this.models, function(model) {
                
            });
        },
        setSelected: function(index) {
            _.each(this.models, function(model, key, list) {
                model.setActive(key + 1 === index);
            });
        }
    });

    window.PhotoView = Backbone.View.extend({
        tagName:  'li',
        template: _.template($('#photo-template').html()),
        events: {
            'click img': 'onClick',
            'dblclick img': 'onDoubleClick'
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        initialize: function() {
            this.model.bind('change', this.onModelChange, this);
        },
        onClick: function(evt) {
            if (!this.model.get('active')) {
                $('a', $(this.el)).addClass('active');
                this.model.setActive(true);
            }
        },
        onDoubleClick: function(evt) {

        },
        onModelChange: function(model) {
            if (model.get('active')) {
                window.Application.toggleShow($('img', this.el), true);
            } else {
                window.Application.toggleShow($('img', this.el), false);
                $('img', this.el).removeClass('active');
            }
        }
    });

    // PHOTO PAGES

    window.PhotoPageModel = Backbone.Model.extend({
        defaults: function() {
            return {
                index: 0,
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
        currentIndex: 1,
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
            this.currentIndex = indexClicked;
            _.each(this.models, function(item, index, array) {
                if (item.get('index') !== indexClicked) {
                    item.setActive(false);
                }
            });
            this.trigger(KT.PHOTO_PAGE_VIEW_CLICK, [indexClicked]);
        },
        setVisible: function() {
            window.Application.toggleShow($('#' + this.id + 'Controls'), true);
        },
        onPreviousNextClicked: function(indexClicked) {
            var model, nextClicked = indexClicked !== 0;
            // cycle
            if (nextClicked) {
                if (this.models.length === this.currentIndex + 2) {
                    indexClicked = 1;
                } else {
                    indexClicked = this.currentIndex + 1;
                }
            } else {
                if (this.currentIndex === 1) {
                    indexClicked = this.models.length -2;
                } else {
                    indexClicked = this.currentIndex - 1;
                }
            }
            _.each(this.models, function(item, index, array) {
                if (item.get('index') === indexClicked) {
                    item.setActive(true);
                    model = item;
                }
            });
            this.setActive(model);
        },
        leftClicked: function() {
            this.onPreviousNextClicked(0);
        },
        rightClicked: function() {
            this.onPreviousNextClicked(1);
        }
    });

    window.PhotoPageView = Backbone.View.extend({
        tagName:  'li',
        template: _.template($('#photo-page-template').html()),
        events: {
            'click a': 'onClick'
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
                this.model.setActive(true);
            } else {
                // tell the app that the user clicked a previous or next button
                this.model.collection.onPreviousNextClicked(this.model.get('index'));
            }
        },
        setActive: function(active) {
            if (!this.isPreviousNextButton()) {
                if (active) {
                    $('a', $(this.el)).addClass('active');
                } else {
                    $('a', $(this.el)).removeClass('active');
                }
            }
        },
        onModelChange: function() {
            this.setActive(this.model.get('active'));
        },
        isPreviousNextButton: function() {
            var index = this.model.get('index');
            return index === 0 || index === this.model.collection.length - 1;
        }
    });

    // GALLERY

    window.GalleryModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: 0,
                name: '',
                currentIndex: 0,
                visible: true
            };
        },
        initialize: function() {
            this.get('pageList').bind(KT.PHOTO_PAGE_VIEW_CLICK, this.onPageListChange, this);
            this.get('photoList').bind(KT.PHOTO_CLICK, this.onPhotoListChange, this);
            this.get('photoList').bind(KT.FIRST_GALLERY_PHOTO_LOADED, this.onFirstGalleryPhotoLoaded, this);
        },
        onPageListChange: function(indexClicked) {
            this.set('currentIndex', indexClicked[0]);
            this.get('photoList').setSelected(this.get('currentIndex'));
        },
        onPhotoListChange: function(indexClicked) {
            this.set('currentIndex', indexClicked[0]);
            this.get('pageList').setSelected(this.get('currentIndex'));
        },
        leftClicked: function() {
            this.get('pageList').leftClicked();
        },
        rightClicked: function() {
            this.get('pageList').rightClicked();
        },
        onFirstGalleryPhotoLoaded: function(id) {
            if (this.get('visible')) {
                this.get('pageList').setVisible(true);
            }
        },
        reset: function() {
            var firstModel, pageList = this.get('pageList');
            this.set('currentIndex', 0);
            this.get('photoList').setSelected(1);
            if (pageList) {
                firstModel = pageList.models[1];
                firstModel.setActive(true);
                pageList.setActive(firstModel);
            }
        }
    });

    window.GalleryView = Backbone.View.extend({
        template: _.template($('#gallery-template').html()),
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        initialize: function() {
            _.bindAll(this, 'onKeyDown');
            $(document).bind('keydown', this.onKeyDown);  
        },
        onKeyDown: function(evt) {
            if (this.model.get('visible')) {
                if (evt.keyCode === 37) {
                    this.model.leftClicked();
                } else if (evt.keyCode === 39) {
                    this.model.rightClicked();
                }
            }
        }
    });

    // MAIN APPLICATION

    window.ApplicationView = Backbone.View.extend({
        el: $('#viewporter'),
        events: {
            'click #banner': 'homeClicked',
            'click #homePageImage': 'homePageImageClicked'
        },
        gallaries: {},
        randomizedPhotoSetImage: {},
        initialize: function() {
            this.cssSplash = this.$('#cssSplash');
            this.imageSplash = this.$('#imageSplash');
            this.displaySplash();
        },
        render: function() {

        },
        displaySplash: function() {
            if ($('html').hasClass('csstransforms')) {
                this.toggleShow(this.cssSplash, true);
            } else {
                this.imageSplash.attr('src', 'images/chrome/spinner.gif');
                this.imageSplash.css('display', '');
            }
        },
        loadHomePageImage: function() {
            var img = new Image(), src = this.randomizeStartImage(), homePageImage = $('#homePageImage');
            img.src = src;
            $(img).load(function() {
                setTimeout(function() {
                    window.Application.fadeSplash();
                }, 250);
            }).error(function() {
            }).attr('src', src);
            homePageImage.attr('src', src);
            homePageImage.css('display', 'none');
        },
        fadeSplash: function() {
            $('#loading').fadeOut('fast', function() {
                $('#main').fadeIn('slow');
                $('#body').attr('aria-busy', 'false');
                setTimeout(function() {
                    _.each(['homePageImage', 'nav', 'footer'], function(item, index, array) {
                        $('#' + item).fadeIn('slow');
                        $('#' + item).attr('aria-hidden', 'false'); 
                    });
                }, 250);
            });
        },
        homeClicked: function(evt) {
            window.NavigationList.homeClicked(evt);
            this.selectPane('home');
        },
        homePageImageClicked: function(evt) {
            window.Router.navigate(this.randomizedPhotoSetImage, true);
            this.navigateToGallery(this.randomizedPhotoSet);
        },
        selectPane: function(id) {
            var idSuffix = 'Content';
            $('.content', this.el).each(function(index, item, array) {
                if (item.id === id + idSuffix) {
                    window.Application.toggleShow(item, true);
                    if (window.Application.hasGallery(id)) {
                        window.Application.gallaries[id].model.set('visible', true);
                    }
                } else {
                    window.Application.toggleShow(item, false);
                    if (window.Application.hasGallery(id)) {
                        window.Application.gallaries[id].model.set('visible', false);
                    }
                }
            });
        },
        hasGallery: function(id) {
            return this.gallaries[id];
        },
        createGallery: function(id) {
            var photoList = new window.PhotoList(this.generateImageSourcesForPhotoList(id)), gm, name = KT.photoSets[id].title._content
            photoPageList = new window.PhotoPageList(this.generateImageControlsForPhotoPageList(id));
            galleryModel = new window.GalleryModel({photoList: photoList, pageList: photoPageList, id: id, name: name, visible: true, maximumHeight: KT.photoSets[id].maximumHeight});
            this.gallaries[id] = new window.GalleryView({model: galleryModel});
            $('#main').append(this.gallaries[id].render().el);
            photoList.postCreate(id);
            photoPageList.postCreate(id);
        },
        randomizeStartImage: function() {
            var index = Math.floor(Math.random() * 4), url, count = 0, that = this;
            _.each(KT.photoSets, function(model, key, list) {
                var photoSetIdentifier;
                if (count === index) {
                    // check to see which one is the primary photo
                    photoSetIdentifier = key;
                    _.each(KT.photoSets[key].photoUrls, function(model, key, list) {
                        if (parseInt(model.isprimary, 10) === 1) {
                            url = model[that.determineImageSize()];
                        }
                    });
                    // just be sure
                    if (!url && key) {
                        url = KT.photoSets[key].photoUrls[0][that.determineImageSize()];
                    } else {
                        // TODO
                    }
                    that.randomizedPhotoSet = key;
                }
                count++;
            });
            this.randomizedPhotoSetImage = url;
            return url;
        },
        generateImageSourcesForPhotoList: function(id) {
            var arr = KT.photoSets[id].photoUrls, determineImageSize = this.determineImageSize, res = [];
            _.each(arr, function(item, index, array) {
                res[index] = {src: arr[index][determineImageSize()], position: index};
            });
            return res;
        },
        generateImageControlsForPhotoPageList: function(id) {
            var arr = KT.photoSets[id].photoUrls, res = [];
            res.push({index: 0, innerHTML: '&larr; Previous'});
            _.each(arr, function(item, index, array) {
                res.push({index: index + 1, innerHTML: index + 1, active: index === 0});
            });
            res.push({index: arr.length + 1, innerHTML: 'Next &rarr;'});
            return res;
        },
        navigateToGallery: function(id) {
            if (!window.Application.hasGallery(id)) {
                window.Application.createGallery(id);
            } else {
                // always reset the gallery to the first position.
                window.Application.gallaries[id].model.reset();
            }
            window.Router.navigate(id, true);
            window.Application.selectPane(id);
            window.Navigation.markActive('photoSet', true);
            window.Application.gallaries[id].model.set('visible', true);
        },
        determineImageSize: function() {
            // TODO - mobile detection
            return 'url_m';
        },
        checkAreAllPhotoSetUrlsLoaded: function() {
            var numberOfPhotoSets = _.size(KT.photoSets), count = 0, models = [], model;
            hash = window.location.hash, isViableHash = hash !== '', isPhotoSetHash = false, isMainPaneHash = false;
            for (var photoset_id in KT.photoSets) {
                model = KT.photoSets[photoset_id];
                if (model.photoUrls) {
                    count++;
                    models.push({id: model.id, name: model.title._content, last: count === numberOfPhotoSets});
                }
            }
            if (count === numberOfPhotoSets) {
                this.loadHomePageImage();
                var photoList = new window.PhotoSetNavigationList(models);
                photoList.createPhotoSets();
                if (isViableHash) {
                    // get rid of the initial pound symbol
                    hash = hash.substring(1);
                    // first check to see if the user is trying to initially navigate to a photo set page
                    for (var j = 0, k = KT.photoSets.length; j < k; j++) {
                        photoSetName = KT.photoSets[j].toLowerCase();
                        if (photoSetName === hash) {
                           isPhotoSetHash = true;
                           break;
                        }
                    }
                    if (isPhotoSetHash) {
                        this.skipSplash();
                        this.navigateToGallery(hash);
                    } else {
                        // perhaps the user is trying to navigate directly to one of the main panes?
                        for (var m = 0, n = KT.panes.length; m < n; m++) {
                            if (KT.panes[m] === hash) {
                                isMainPaneHash = true;
                                break;
                            }
                        }
                        if (isMainPaneHash) {
                            this.skipSplash();
                            window.Navigation.navigationClicked({target: {id: hash}});
                        }
                    }
                }
            }
        },
        loadPhotoSetPhotos: function() {
            var that = this;
            for (var photoset_id in KT.photoSets) {
                $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=' + photoset_id + '&api_key=' + KT.apiKey + '&jsoncallback=?',
                    { format: 'json' },
                    function(data) {
                        var maximumHeight = 0;
                        KT.photoSets[data.photoset.id].photoUrls = data.photoset.photo;
                        // get the maximum height of a photo
                        _.each(KT.photoSets[data.photoset.id].photoUrls, function(obj, key, list) {
                            if (obj.height_m > maximumHeight) {
                                maximumHeight = obj.height_m;
                            }
                        });
                        KT.photoSets[data.photoset.id].maximumHeight = maximumHeight;
                        that.checkAreAllPhotoSetUrlsLoaded();
                    }
                );
            }
        },
        start: function() {
            var that = this, photoSetName;
            // make the API call to retrieve the photo sets before proceeding.
            $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=' + KT.userId + '&api_key=' + KT.apiKey + '&jsoncallback=?',
                { format: 'json' },
                function(data) {
                    var photoSet;
                    if (data.photosets && data.photosets.photoset) {
                        KT.photoSets = {};
                        data = data.photosets.photoset;
                        for (var index in data) {
                            if (data.hasOwnProperty(index)) {
                                photoSet = data[index];
                                KT.photoSets[photoSet.id] = photoSet;
                            }
                        }
                        that.loadPhotoSetPhotos();
                    } else {
                        that.failedToLoadPhotoSetPhotos({error: {description: 'failed to get the portfolios', code: '2'}});
                    }
                }
            ).error(function(data) {
                that.failedToLoadPhotoSetPhotos({error: {description: 'failed to get the portfolios', code: '2'}});
            });
        },
        failedToLoadPhotoSetPhotos: function(data) {
            var error = data.error;
            console.warn('Portfolio Load Failure: ', error.description, error.code);
            this.showError();
        },
        skipSplash: function() {
            this.toggleShow($('#loading'));
        },
        showError: function() {
            this.toggleShow($('#loading'));
            this.toggleShow($('#error'), true);
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
    window.Application = new ApplicationView();
    window.ApplicationRouter = Backbone.Router.extend({
        routes: {
            'home': 'home',
            'store': 'store',
            'biography': 'biography',
            'news': 'news',
            'contact':'contact'
        },
        home: function() {

        },
        biography: function() {

        },
        news: function() {

        },
        contact: function() {

        }
    });
    window.Router = new ApplicationRouter();
    window.Navigation = new NavigationView();
    window.PhotoSetNavigation = new PhotoSetNavigationView();
    Backbone.history.start();
    // only after everything has been initialized do we check to see whether the user is
    // trying to navigate to a specific area in the app.
    window.Application.start();
});
