var KT = SC.Application.create(), ApplicationView;

KT.ApplicationView = SC.View.extend({

    init: function() {
        // set up the app
        this._displaySplash();
        this._handleLegalToggle();
    },

    _displaySplash: function() {
        var img = new Image();
        $(img).load(function() {
            setTimeout(function() {
                ApplicationView._fadeSplash();
            }, 250);
        }).error(function() {
        }).attr('src', 'images/second-hand-life/large/1.jpg');
        if ($('html').hasClass('csstransforms')) {
            $('#cssSplash').css('display', '');
        } else {
            $('#imageSplash').attr('src', 'images/chrome/spinner.gif');
            $('#imageSplash').css('display', '');
        }
    },

    _fadeSplash: function() {
        $('#loading').fadeOut('fast', function() {
            $.each(['#nav', '#footer', '#main'], function(index, item, array) {
               $(item).fadeIn('slow');
            });
            $('.body.ktBody').attr('aria-busy', 'false');
        });
    },

    _handleLegalToggle: function() {
        var selector = $('.license.secondaryText');
        $('#license').click(function() {
            if (selector.css('display') === 'block') {
                selector.fadeOut('slow', function() {
                    selector.css('display', 'none');
                });
            } else {
                selector.fadeIn('slow', function() {
                    selector.css('display', 'block');
                });
            }
        });
    }
});

ApplicationView = new KT.ApplicationView();