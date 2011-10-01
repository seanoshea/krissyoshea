var KT = {};
KT.clicks = {};
KT.displaySplash = function() {
    if ($('html').hasClass('csstransforms')) {
        $('#cssSplash').css('display', '');
    } else {
        $('#imageSplash').attr('src', 'images/chrome/spinner.gif');
        $('#imageSplash').css('display', '');
    }
};
KT.navClick = function(evt, portfolioSubMenu) {
    if (!portfolioSubMenu) {
        if ($('#portfolioMenu').css('display') !== 'none') {
            $('#portfolioMenu').slideToggle('fast', function() {
                KT.showHide($(this), $(this).css('display') !== 'none');
            });
        }
        $('.main div.content').each(function(el) {
            var switchTo;
            if (evt + 'Content' === $(this).attr('id')) {
                switchTo = $(this).attr('id').substring(0, $(this).attr('id').length - 7);
                document.location.hash = switchTo;
                KT.handlePortfolioContent(switchTo);
                $(this).fadeIn(500, function() {
                    KT.showHide($(this), true);
                    if (switchTo === 'contact') {
                        $('#name')[0].focus();
                    } else if (switchTo === 'news') {
                        $('#hcalendar-VernissageLink').addClass('focused');
                        $('#hcalendar-VernissageLink').focus();
                    }
                });
                KT.switchSelected(switchTo);
            } else if ($(this).css('display') !== 'none') {
                KT.showHide($(this));
            }
        });
    } else {
        if (evt !== location.hash.substring(1)) {
            $('#portfolioMenu').slideToggle('fast', function() {
                KT.showHide($(this), $(this).css('display') !== 'none');
            });
        }
        $('.slideshowControls').each(function(index, element) {
            if ($(this).css('display') !== 'none') {
                KT.showHide($(element));
            }
        });
        KT.handlePortfolioContent('portfolio');
    }
    KT.clearContactForm();
    return true;
};
KT.handlePortfolioContent = function(idFadedIn) {
    if (idFadedIn) {
        if (KT.cycleLoaded) {
            var slideShowId = '#' + idFadedIn + 'Show',
            nextButton = '#' + idFadedIn + 'Next',
            prevButton = '#' + idFadedIn + 'Prev',
            formSelector = '#' + idFadedIn + 'Content form';
            if (!KT.clicks['#' + idFadedIn + 'StopStart']) {
                $('#' + idFadedIn + 'StopStart').click(function(evt) {
                    var base = '#' + evt.target.id.substring(0, evt.target.id.length - 9),
                    slideShowId = base + 'Show',
                    pauseResumeToggle = $.trim(evt.target.innerHTML) === 'Stop' ? 'pause' : 'resume';
                    stopped = pauseResumeToggle === 'pause';
                    $(slideShowId).cycle(pauseResumeToggle);
                    $(base + 'StopStart').text(stopped ? 'Start' : 'Stop');
                    $(slideShowId).attr('aria-live', stopped ? 'off' : 'polite');
                });
                KT.clicks['#' + idFadedIn + 'StopStart'] = true;
            }
            $(slideShowId).cycle({fx: 'fade', next: nextButton, prev: prevButton, after: function() {
                $(slideShowId).attr('aria-relevant', 'additions,removals');
            }});
            $(slideShowId).attr('aria-live', 'polite');
            KT.switchSelected('portfolio');
            setTimeout(function() {
                var button = $('#' + idFadedIn + 'StopStart');
                $(formSelector).fadeIn('slow', function() {
                    KT.showHide($(this), true);
                });
                button.innerHTML = 'Stop';
                button.focus();
            }, 1000);
        } else {
            // not ready yet ... sniff for it
            setTimeout(function() {
                KT.handlePortfolioContent.call(idFadedIn);
            }, 250);
        }
    }
};
KT.clearContactForm = function() {
    $('#contactForm label.error').remove();
    $.each(['#name', '#email', '#speak'], function(index, item) {
        $(item)[0].value = '';
    });
};
KT.switchSelected = function(switchTo) {
    $('.nav li a.selected').removeClass('selected');
    if (switchTo === 'current-work' || switchTo === 'second-hand-life') {
        switchTo = 'portfolio';
    }
    $('#' + switchTo).addClass('selected');
};
KT.fadeSplash = function() {
    $('#loading').fadeOut('fast', function() {
        $('#main').fadeIn('slow');
        $('.body.ktBody').attr('aria-busy', 'false');
        setTimeout(function() {
            $('#nav').fadeIn('slow');
            $('#footer').fadeIn('slow');
        }, 250);
    });
};
KT.focusedOnPortfolioContent = function() {
    return (/current|second/i).test(window.location.hash);
};
KT.focusedOnNewsContent = function() {
    return (/news/i).test(window.location.hash);
};
KT.getSlideshowDetails = function() {
    var details = {
        ssId: (/current/i).test(window.location.hash) ? '#current-workShow' : '#second-hand-lifeShow'
    };
    details.buttonId = details.ssId.substring(0, details.ssId.length - 4) + 'StopStart';
    return details;
};
KT.handlePortfolioKeyLeftRight = function(offset) {
    var details = KT.toggleSlideshow();
    $(details.ssId).cycle(offset === 1 ? 'next' : 'prev');
};
KT.handlePortfolioKeySpace = function() {
    KT.toggleSlideshow(cycling = $(KT.getSlideshowDetails().buttonId).text() === 'Stop');
};
KT.handlePortfolioKeyEnter = function(evt) {
    if (/next|prev/i.test(evt.target.id)) {
        KT.toggleSlideshow();
    }
};
KT.toggleSlideshow = function(on) {
    var details = KT.getSlideshowDetails(), ssId = details.ssId,
    replaceText, liveAriaValue;
    if (on) {
        replaceText = 'Stop';
        liveAriaValue = 'polite';
    } else {
        replaceText = 'Start';
        liveAriaValue = 'off';
    }
    $(ssId).attr('aria-live', liveAriaValue);
    $(details.buttonId).text(replaceText);
    $(ssId).cycle(on ? 'resumse' : 'pause');
    return details;
};
KT.handleNewsContentTab = function(evt) {
    var anchors = $('#newsContent ol li a'), anchor, index, isShift = evt.shiftKey, newAnchor;
    for (var i = 0, l = anchors.length; i < l; i++) {
        anchor = anchors[i];
        if ($(anchor).hasClass('focused')) {
            $(anchor).removeClass('focused');
            $(anchor).attr('tabindex', '-1');
            if (i === l - 1 && !isShift) {
                $('#license').focus();
            } else if (i === 0 && isShift) {
                $('#news').focus();
            } else {
                // roving index implementation?
                index = i + (isShift ? -1 : 1);
                newAnchor = $(anchors[index]);
                newAnchor.addClass('focused');
                newAnchor.attr('tabindex', '0');
                $('#newsContent ol').attr('aria-active-descendant', newAnchor.attr('id'));
                anchors[index].focus();
            }
            break;
        }
    }
};
KT.showHide = function(node, show) {
    if (show) {
        $(node).css('display', '');
        $(node).attr('aria-hidden', 'false');
    } else {
        $(node).css('display', 'none');
        $(node).attr('aria-hidden', 'true');
    }
};
$(document).ready(function() {
    // main navigation
    $('.banner').click(function() {
        KT.navClick('home');
    });
    $('.nav li a').each(function() {
        $(this).click(function(evt) {
            KT.navClick(evt.currentTarget.id, evt.currentTarget.id === 'portfolio');
        });
    });
    $('#portfolioMenu li a').each(function() {
        $(this).click(function(evt) {
            KT.navClick(evt.currentTarget.id);
        });
    });
    // home page
    KT.displaySplash();
    var img = new Image();
    $(img).load(function() {
        setTimeout(function() {
            KT.fadeSplash();
        }, 250);
    }).error(function() {
    }).attr('src', 'images/second-hand-life/large/1.jpg');
    $('#homeContent img').click(function() {
        KT.navClick('second-hand-life');
    });
    $('form').submit(function() {
        return false;
    });
    // key handling stuff
    var RIGHT = 39, LEFT = 37, SPACE = 32, ESC = 27, ENTER = 13, TAB = 9;
    $(document).keyup(function(evt) {
        if (KT.focusedOnPortfolioContent()) {
            if (evt.keyCode === RIGHT) {
                KT.handlePortfolioKeyLeftRight(1);
            } else if (evt.keyCode === LEFT) {
                KT.handlePortfolioKeyLeftRight(-1);
            } else if (evt.keyCode === SPACE) {
                KT.handlePortfolioKeySpace();
            } else if (evt.keyCode === ESC) {
                KT.toggleSlideshow();
            } else if (evt.keyCode === ENTER) {
                KT.handlePortfolioKeyEnter(evt);
            }
        } else if (KT.focusedOnNewsContent()) {
            if (evt.keyCode === TAB) {
                KT.handleNewsContentTab(evt);
            }
        }
    });
    // legal toggle
    $('.foot a').click(function() {
        if ($('#.foot div').css('display') === 'block') {
            $('#.foot div').fadeOut('slow', function() {
                $(this).css('display', 'none');
            });
        } else {
            $('#.foot div').fadeIn('slow', function() {
                $(this).css('display', 'block');
            });
        }
    });
});