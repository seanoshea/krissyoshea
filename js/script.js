$(function() {

    KT = {};
    // some API configuration
    KT.version = '1.0';
    // KT.apiUrl = 'localhost:8080/';
    // KT.apiUrl = 'krissytosi.com/';
    KT.apiUrl = 'krissytosi.appspot.com/';

    // navigational elements in the app.
    KT.panes = ['biography', 'news', 'contact'];

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
                this.markActive(id);
                this.togglePortfolioMenu(true);
            } else {
                this.togglePortfolioMenu();
            }
        },
        markActive: function(id, skip) {
            $('li a', this.el).each(function(index, item, array) {
                item.id === id ? $(item).addClass('active') : $(item).removeClass('active');
            });
            if (!skip) {
                window.Application.selectPane(id);
            }
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
            window.Application.navigateToGallery(id);
            this.togglePortfolioMenu(true);
        },
        togglePortfolioMenu: function(forceHide) {
            var wasOpen = forceHide || this.open;
            if (!forceHide || this.open) {
                $(this.el).slideToggle('fast', function() {
                    window.Application.toggleShow($(this), !wasOpen);
                    window.PortfolioNavigation.open = !wasOpen;
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
                if (key == 0) {
                    model.set('active', true);
                }
                var view = new PhotoView({model: model});
                this.$('#' + id + 'Container').append(view.render().el);
            });
            $('#' + id + 'Container img').each(function(index, item) {
                if (index == 0) {
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
                model.setActive(key + 1 == index);
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
                if (this.currentIndex == 1) {
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
                active ? $('a', $(this.el)).addClass('active') : $('a', $(this.el)).removeClass('active');
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
        initialize: function() {
            _.bindAll(this, 'onKeyDown');
            $(document).bind('keydown', this.onKeyDown);  
        },
        onKeyDown: function(evt) {
            if (this.model.get('visible')) {
                if (evt.keyCode == 37) {
                    this.model.leftClicked();
                } else if (evt.keyCode == 39) {
                    this.model.rightClicked();
                }
            }
        }
    });

    // MAIN APPLICATION

    window.ApplicationView = Backbone.View.extend({
        el: $('#container'),
        events: {
            'click #banner': 'homeClicked',
            'click #homePageImage': 'homePageImageClicked'
        },
        gallaries: {},
        randomizedPortfolioImage: {},
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
                    });
                }, 250);
            });
        },
        homeClicked: function(evt) {
            window.NavigationList.homeClicked(evt);
            this.selectPane('home');
        },
        homePageImageClicked: function(evt) {
            window.Router.navigate(this.randomizedPortfolioImage, true);
            this.navigateToGallery(this.randomizedPortfolioImage);
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
            var photoList = new window.PhotoList(this.generateImageSourcesForPhotoList(id)), gm,
            photoPageList = new window.PhotoPageList(this.generateImageControlsForPhotoPageList(id));
            photoList.postCreate(id);
            photoPageList.postCreate(id);
            galleryModel = new window.GalleryModel({photoList: photoList, pageList: photoPageList, visible: true});
            this.gallaries[id] = new window.GalleryView({el: $('#' + id), model: galleryModel});
        },
        randomizeStartImage: function() {
        	var index = Math.floor(Math.random() * 4);
           	this.randomizedPortfolioImage = KT.portfolios[index];
            return '/images/' + this.randomizedPortfolioImage + '/' + this.determineImageSize() + '/1.jpg';
        },
        generateImageSourcesForPhotoList: function(id) {
            var arr = KT[id], determineImageSize = this.determineImageSize;
            _.each(arr, function(item, index, array) {
                arr[index] = {src: '/images/' + id + '/' + determineImageSize() + '/' + item, position: index};
            });
            return arr;
        },
        generateImageControlsForPhotoPageList: function(id) {
            var arr = KT[id], res = [];
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
            window.Navigation.markActive('portfolio', true);
            window.Application.gallaries[id].model.set('visible', true);
        },
        determineImageSize: function() {
            // TODO - mobile detection
            return 'large';
        },
        start: function() {
        	// make the API call to retrieve the portfolios before proceeding.
        	var url = 'http://' + KT.apiUrl + 'api?q=portfolios', portfolio, that = this, portfolioName;
            $.ajax({url: url})
            .done(function(data) {
            	if (!data.error) {
					KT.portfolios = [];
	            	for (var index in data) {
	            		portfolio = data[index];
	            		// ensure we're always dealing with lowercase
	            		portfolioName = portfolio.name.toLowerCase();
	            		KT[portfolioName] = [];
	            		for (var i = 0, l = portfolio.numberOfImages; i < l; i++) {
							KT[portfolioName][i] = i + 1 + '.jpg';
	            		}
	            		KT.portfolios[index] = portfolioName;
	            	}
	            	that.loadHomePageImage();
					var hash = window.location.hash, isViableHash = hash !== '',
		            isPortfolioHash = false, isMainPaneHash = false, portfolioName;
					if (isViableHash) {
		                // get rid of the initial pound symbol
		                hash = hash.substring(1);
		                // first check to see if the user is trying to initially navigate to a portfolio page
		                for (var i = 0, l = KT.portfolios.length; i < l; i++) {
		                	portfolioName = KT.portfolios[i].toLowerCase();
		                    if (portfolioName === hash) {
		                        isPortfolioHash = true;
		                        break;
		                    }
		                }
		                if (isPortfolioHash) {
		                    that.skipSplash();
		                    that.navigateToGallery(hash);
		                } else {
		                    // perhaps the user is trying to navigate directly to one of the main panes?
		                    for (var k = 0, j = KT.panes.length; k < j; k++) {
		                        if (KT.panes[k] === hash) {
		                            isMainPaneHash = true;
		                            break;
		                        }
		                    }
		                    if (isMainPaneHash) {
		                        that.skipSplash();
		                        window.Navigation.navigationClicked({target: {id: hash}});
		                    }
		                }
		            }
	            } else {
					that.failedToLoadPortfolios(data.error);
	            }
			})
			.fail(function(data) {
				that.failedToLoadPortfolios({error: {description: 'failed to get the portfolios', code: '2'}});
			});
        },
        failedToLoadPortfolios: function(error) {
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
    window.Application = new ApplicationView;
    window.ApplicationRouter = Backbone.Router.extend({
        routes: {
            'home': 'home',
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
    window.Router = new ApplicationRouter;
    window.Navigation = new NavigationView;
    window.PortfolioNavigation = new PortfolioNavigationView;
    Backbone.history.start();
    // only after everything has been initialized do we check to see whether the user is
    // trying to navigate to a specific area in the app.
    window.Application.start();
});
