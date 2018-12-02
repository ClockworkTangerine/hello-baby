/*
 * Author: Evgeniy Gusarov StMechanus (Diversant)
 * Under the MIT License
 *
 * Version: 1.0.0
 *
 */


;
(function ($) {

    var settings = {
        wrapClass: 'styleswitcher',
        toggleClass: 'styleswitcher_toggle',
        titleClass: 'styleswitcher_title',
        cntClass: 'styleswitcher_cnt',
        schemeClass: 'styleswitcher_scheme',
        linkID: 'colorScheme'
    }

    var RDStyleSwitcher = function (options) {
        this.options = options;
    };

    var initStarterScheme = function () {
        var url = $.cookie("rd-scheme");
        if (url) {
            $('head').append($('<link/>', {
                'id': settings.linkID,
                'rel': 'stylesheet',
                'href': url
            }));

            $('.'+settings.schemeClass+'[data-url="'+url+'"]').addClass('active');
        }else{
            $('#'+settings.linkID+'0').addClass('active');
        }
    };
    initStarterScheme();

    RDStyleSwitcher.prototype = {
        init: function () {
            var _self = this;

            _self.createDOM();
            _self.createListeners();
        },

        createDOM: function () {
            var _self = this;

            $('body')
                .append($('<div/>', {'class': settings.wrapClass})
                    .append($('<button/>', {'class': settings.toggleClass}))
                    .append($('<h2>', {
                        'class': settings.titleClass,
                        'text': _self.options.title
                    }))
                    .append(_self.createSchemes())
            );
        },

        createSchemes: function () {
            var _self = this;
            var cnt = $('<div>', {'class': settings.cntClass});

            for (var i in _self.options.schemes) {
                cnt
                    .append($('<button/>', {
                        'id': settings.linkID + i,
                        'class': settings.schemeClass,
                        'data-url': _self.options.schemes[i].url
                    }).css({
                        'background': _self.options.schemes[i].icon.indexOf('#') == 0 ? _self.options.schemes[i].icon : 'url(' + _self.options.schemes[i].icon + ')',
                        'background-size': 'cover'
                    }))
                    .append(" ");
            }

            return cnt;
        },

        createListeners: function () {
            $('body').delegate('.' + settings.toggleClass, 'click', function () {
                var o = $('.' + settings.wrapClass);
                $(this).toggleClass('active');
                o.toggleClass('active');
            });

            $('body').delegate('.' + settings.schemeClass, 'click', function () {
                $('.' + settings.schemeClass).removeClass('active');
                $(this).addClass('active');

                var l = $('#' + settings.linkID);

                if (!l.length) {
                    $('head').append($('<link/>', {
                        'id': settings.linkID,
                        'rel': 'stylesheet'
                    }))
                }

                if ($(this).data('url')) {
                    $('#' + settings.linkID).attr('href', $(this).data('url'));
                    $.cookie("rd-scheme", $(this).data('url'), {expires: 365, path: '/'});
                } else {
                    $('#' + settings.linkID).remove();
                    $.removeCookie("rd-scheme", {path: '/'});
                }
            });
        }
    };

    $.rdstyleswitcher = function (options) {
        var options = $.extend({}, $.rdstyleswitcher.defaults, options);

        new RDStyleSwitcher(options).init();
    };

    $.rdstyleswitcher.defaults = {
        title: "This customization tool allows you to make color changes in your theme.",
        schemes: []
    };
})(jQuery);
