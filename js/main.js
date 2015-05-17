/*
Copyright (c) 2014 - 2015 Upwards Northwards Software Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by Upwards Northwards Software Limited.
4. Neither the name of Upwards Northwards Software Limited nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY UPWARDS NORTHWARDS SOFTWARE LIMITED ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL UPWARDS NORTHWARDS SOFTWARE LIMITED BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
$(function() {

    KOS = {};
    // some API configuration
    KOS.apiKey = '3426649638b25fe317be122d3fbbc1b1';
    KOS.userId = '91622522@N07';

    // navigational elements in the app.
    // KOS.panes = ['about', 'news', 'contact'];
    KOS.panes = ['about', 'contact'];

    // attributions for different photos in the portfolios.
    KOS.attributions = {

    };

    // holds information on what image sizes the application
    // attempted to load. Always try to load the largest image
    // possible, but offer at least something if the largest
    // image doesn't load within a specific period of time.
    KOS.attemptedImageSizes = ['url_o', 'url_m'];
    KOS.homePageLoadTimeout = 3000;

    // some custom events.
    KOS.PHOTO_PAGE_VIEW_CLICK = 'PHOTO_PAGE_VIEW_CLICK';
    KOS.PHOTO_CLICK = 'PHOTO_CLICK';
    KOS.PHOTO_PREVIOUS_NEXT_CLICK = 'PHOTO_PREVIOUS_NEXT_CLICK';
    KOS.FIRST_GALLERY_PHOTO_LOADED = 'FIRST_GALLERY_PHOTO_LOADED';

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
            if (id === 'instagram_social' || id === 'pinterest_social' || id === 'twitter_social') {
              return;
            } else if (id !== 'photoSets') {
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
            var id = evt.target.id;
            window.Application.navigateToGallery(id);
            this.togglePhotoSetMenu(true);
        },
        togglePhotoSetMenu: function(forceHide) {
            var wasOpen = forceHide || this.open, node = $('#photoSetMenu');
            if (!forceHide || this.open) {
                node.slideToggle('slow', function() {
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
        currentPane: 0,
        showingAttribution: false,
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
                        that.trigger(KOS.FIRST_GALLERY_PHOTO_LOADED, [id]);
                    };
                }
            });
            this.alterMetadataForPhoto(0);
        },
        setActive: function(model) {
            _.each(this.models, function(model) {

            });
        },
        setSelected: function(index) {
            _.each(this.models, function(model, key, list) {
                model.setActive(key + 1 === index);
            });
            this.alterMetadataForPhoto(index - 1);
        },
        showPane: function(index) {
            index = Math.max(0, Math.min(index, this.models.count - 1));
            this.currentPane = index;
            this.setContainerOffset(-((100 / this.models.count) * this.currentPane), true);
        },
        setContainerOffset: function(percent, animate) {
            var paneWidth = 100, container = $('#' + this.id + 'Container');
            container.removeClass('animate');
            if (animate) {
                container.addClass('animate');
            }
            if (Modernizr.csstransforms3d) {
                container.css('transform', 'translate3d(' + percent + '%,0,0) scale3d(1,1,1)');
            } else if (Modernizr.csstransforms) {
                container.css('transform', 'translate(' + percent + '%,0)');
            } else {
                var px = ((paneWidth * this.models.count) / 100) * percent;
                container.css('left', px + 'px');
            }
        },
        next: function() {
            return this.showPane(this.currentPane + 1, true);
        },
        previous: function() {
            return this.showPane(this.currentPane - 1, true);
        },
        alterMetadataForPhoto: function(index) {
            var count = this.models.length, attributionText = this.attributionForPhotoAtIndex(index),
            that = this, attribution = $('#' + this.name + 'Attribution');
            $('#' + this.name + 'ControlSummary').each(function(i, item) {
                item.innerHTML = index + 1 + ' of ' + count;
            });
            if (attributionText) {
                attribution.fadeIn('fast', function() {
                    this.innerHTML = attributionText;
                    window.Application.toggleShow(this, true);
                    that.showingAttribution = true;
                });
            } else if (this.showingAttribution) {
                attribution.fadeOut('fast', function() {
                    window.Application.toggleShow(this, false);
                    that.showingAttribution = false;
                });
            }
        },
        attributionForPhotoAtIndex: function(index) {
            return KOS.attributions[this.name] && KOS.attributions[this.name][index];
        }
    });

    window.PhotoView = Backbone.View.extend({
        tagName: 'li',
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
            _.each(this.models, function(item, index, array) {
                if (index === 0 || index === array.length - 1) {
                    var view = new PhotoPageView({model: item});
                    this.$('#' + id + 'Controls').append(view.render().el);
                }
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
            this.trigger(KOS.PHOTO_PAGE_VIEW_CLICK, [indexClicked]);
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
                    indexClicked = this.models.length - 2;
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
        tagName: 'li',
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
            this.get('pageList').bind(KOS.PHOTO_PAGE_VIEW_CLICK, this.onPageListChange, this);
            this.get('photoList').bind(KOS.PHOTO_CLICK, this.onPhotoListChange, this);
            this.get('photoList').bind(KOS.FIRST_GALLERY_PHOTO_LOADED, this.onFirstGalleryPhotoLoaded, this);
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
        el: $('#mainapp'),
        events: {
            'click #banner': 'homeClicked',
            'click #homePageImage': 'homePageImageClicked'
        },
        galleries: {},
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
            window.Application.clearHomePageImageLoadTimeout();
            if (src) {
                img.src = src;
                homePageImage.attr('src', src);
                homePageImage.css('display', 'none');
                KOS.homePageImageLoadTimeout = setTimeout(function() {
                    window.Application.checkForAlternativeImageSizesAndTryToLoadHomePageImageAgain();
                }, KOS.homePageLoadTimeout);
                $(img).load(function() {
                    window.Application.clearHomePageImageLoadTimeout();
                    setTimeout(function() {
                        window.Application.fadeSplash();
                    }, 250);
                }).error(function() {
                    window.Application.checkForAlternativeImageSizesAndTryToLoadHomePageImageAgain();
                }).attr('src', src);
            } else {
                window.Application.fadeSplash();
            }
        },
        clearHomePageImageLoadTimeout: function() {
            if (KOS.homePageImageLoadTimeout) {
                clearTimeout(KOS.homePageImageLoadTimeout);
            }
        },
        checkForAlternativeImageSizesAndTryToLoadHomePageImageAgain: function() {
            if (KOS.attemptedImageSizes.length > 1) {
                // remove the size from the global array and try again.
                KOS.attemptedImageSizes.splice(0, 1);
            } else {
                // try again
                KOS.attemptedImageSizes = [];
            }
            window.Application.loadHomePageImage();
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
                        window.Application.galleries[id].model.set('visible', true);
                    }
                } else {
                    window.Application.toggleShow(item, false);
                    if (window.Application.hasGallery(id)) {
                        window.Application.galleries[id].model.set('visible', false);
                    }
                }
            });
        },
        hasGallery: function(id) {
            return this.galleries[id];
        },
        createGallery: function(id) {
            var photoList = new window.PhotoList(this.generateImageSourcesForPhotoList(id)), gm, name = KOS.photoSets[id].title._content,
            photoPageList = new window.PhotoPageList(this.generateImageControlsForPhotoPageList(id)),
            galleryModel = new window.GalleryModel({photoList: photoList, pageList: photoPageList, id: id, name: name, visible: true});
            this.galleries[id] = new window.GalleryView({model: galleryModel});
            $('#main').append(this.galleries[id].render().el);
            photoList.postCreate(id);
            photoPageList.postCreate(id);
        },
        randomizeStartImage: function() {
            var index = Math.floor(Math.random() * 3), url, count = 0, that = this;
            _.each(KOS.photoSets, function(model, key, list) {
                var photoSetIdentifier;
                if (count === index) {
                    // check to see which one is the primary photo
                    photoSetIdentifier = key;
                    _.each(KOS.photoSets[key].photoUrls, function(model, key, list) {
                        if (parseInt(model.isprimary, 10) === 1) {
                            url = model[that.determineImageSize()];
                        }
                    });
                    // just be sure
                    if (!url && key) {
                        url = KOS.photoSets[key].photoUrls[0][that.determineImageSize()];
                    }
                    that.randomizedPhotoSet = key;
                }
                count++;
            });
            this.randomizedPhotoSetImage = url;
            return url;
        },
        generateImageSourcesForPhotoList: function(id) {
            var arr = KOS.photoSets[id].photoUrls, determineImageSize = this.determineImageSize, res = [];
            _.each(arr, function(item, index, array) {
                res[index] = {src: arr[index][determineImageSize()], position: index};
            });
            return res;
        },
        generateImageControlsForPhotoPageList: function(id) {
            var arr = KOS.photoSets[id].photoUrls, res = [];
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
                window.Application.galleries[id].model.reset();
            }
            window.Router.navigate(id, true);
            window.Application.selectPane(id);
            window.Navigation.markActive('photoSet', true);
            window.Application.galleries[id].model.set('visible', true);
        },
        determineImageSize: function() {
            var imageSize;
            if (window.Application.isMobile()) {
                imageSize = 'url_m';
            } else if (KOS.attemptedImageSizes.length) {
                imageSize = KOS.attemptedImageSizes[0];
            }
            return imageSize;
        },
        checkAreAllPhotoSetUrlsLoaded: function() {
            var numberOfPhotoSets = _.size(KOS.photoSets), count = 0, models = [], model,
            hash, isViableHash, isPhotoSetHash = false, isMainPaneHash = false;
            hash = window.location.hash;
            isViableHash = hash !== '';
            for (var photoset_id in KOS.photoSets) {
                if (KOS.photoSets.hasOwnProperty(photoset_id)) {
                    model = KOS.photoSets[photoset_id];
                    if (model.photoUrls) {
                        count++;
                        models.push({id: model.id, name: model.title._content, last: count === numberOfPhotoSets});
                    }
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
                    for (var j = 0, k = KOS.photoSets.length; j < k; j++) {
                        photoSetName = KOS.photoSets[j].toLowerCase();
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
                        for (var m = 0, n = KOS.panes.length; m < n; m++) {
                            if (KOS.panes[m] === hash) {
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
            var that = this, executeFunction = function(data) {
                KOS.photoSets[data.photoset.id].photoUrls = data.photoset.photo;
                that.checkAreAllPhotoSetUrlsLoaded();
            };
            for (var photoset_id in KOS.photoSets) {
                if (KOS.photoSets.hasOwnProperty(photoset_id)) {
                    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=' + photoset_id + '&api_key=' + KOS.apiKey + '&jsoncallback=?',
                        { format: 'json' }, executeFunction
                    );
                }
            }
        },
        start: function() {
            var that = this, photoSetName;
            // make the API call to retrieve the photo sets before proceeding.
            $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=' + KOS.userId + '&api_key=' + KOS.apiKey + '&jsoncallback=?',
                { format: 'json' },
                function(data) {
                    var photoSet;
                    if (data.photosets && data.photosets.photoset) {
                        KOS.photoSets = {};
                        data = data.photosets.photoset;
                        for (var index in data) {
                            if (data.hasOwnProperty(index)) {
                                photoSet = data[index];
                                KOS.photoSets[photoSet.id] = photoSet;
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
        },
        isMobile: function() {
            // may the browser gods have pity on me.
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
        },
        shouldDetectTouches: function() {
            return false;
        }
    });
    window.Application = new ApplicationView();
    window.ApplicationRouter = Backbone.Router.extend({
        routes: {
            'home': 'home',
            'about': 'about',
            // 'news': 'news',
            'contact': 'contact'
        },
        home: function() {

        },
        about: function() {

        },
        // news: function() {
        //
        // },
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
