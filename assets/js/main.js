function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
};

function show_alert(elem, message, timeout, style) {
    $(elem).removeClass('alert-warning', 'alert-danger', 'alert-success');
    $(elem).addClass(style);
    $(elem).html('<strong>' + message + '</strong>');
    $(elem).fadeTo(timeout, 500).slideUp(500, function () {
        $(elem).hide();
    });
}
$('#btnSendEmail').click(function () {

    var name = $('#name').val();
    var email = $('#email').val();
    var msg = $('#msg').val();

    if(!isValidEmailAddress(email)){
        show_alert('#form_alert', 'Check email please!', 900, 'alert-warning');
        return;
    }

    if (name == '' || email == '' || msg == '') {
        show_alert('#form_alert', 'Name, email and message not empty!', 1300, 'alert-warning');
        return;
    }
    $.ajax({
        type: "POST",
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        data: {
            'key': '1wm81takVDEbZbzxivR9zg',
            'message': {
                'from_email': 'nhancv@yeskone.com',
                'to': [
                    {
                        'email': 'caovannhan2002@gmail.com',
                        'name': 'Nhan Cao',
                        'type': 'to'
                    }
                ],
                'autotext': 'true',
                'subject': 'cvnhan.github.io - ' + name + ' - ' + email,
                'html': msg
            }
        }
    }).done(function (response) {
        //console.log(response);
        show_alert('#form_alert', 'Sent successfully', 1000, 'alert-success');
    }).fail(function (error) {
        //console.log(error);
        show_alert('#form_alert', 'Sent error', 1000, 'alert-danger');
    }).always(function () {

    });
});

(function ($) {

    skel.breakpoints({
        wide: '(min-width: 961px) and (max-width: 1880px)',
        normal: '(min-width: 961px) and (max-width: 1620px)',
        narrow: '(min-width: 961px) and (max-width: 1320px)',
        narrower: '(max-width: 960px)',
        mobile: '(max-width: 736px)'
    });

    $(function () {

        var $window = $(window),
            $body = $('body');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function () {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function () {
            $.prioritize(
                '.important\\28 mobile\\29',
                skel.breakpoint('mobile').active
            );
        });

        // Scrolly links.
        $('.scrolly').scrolly();

        // Nav.
        var $nav_a = $('#nav a');

        // Scrolly-fy links.
        $nav_a
            .scrolly()
            .on('click', function (e) {

                var t = $(this),
                    href = t.attr('href');

                if (href[0] != '#')
                    return;

                e.preventDefault();

                // Clear active and lock scrollzer until scrolling has stopped
                $nav_a
                    .removeClass('active')
                    .addClass('scrollzer-locked');

                // Set this link to active
                t.addClass('active');

            });

        // Initialize scrollzer.
        var ids = [];

        $nav_a.each(function () {

            var href = $(this).attr('href');

            if (href[0] != '#')
                return;

            ids.push(href.substring(1));

        });

        $.scrollzer(ids, {pad: 200, lastHack: true});

        // Header (narrower + mobile).

        // Toggle.
        $(
            '<div id="headerToggle">' +
            '<a href="#header" class="toggle"></a>' +
            '</div>'
        )
            .appendTo($body);

        // Header.
        $('#header')
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'left',
                target: $body,
                visibleClass: 'header-visible'
            });

        // Fix: Remove transitions on WP<10 (poor/buggy performance).
        if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
            $('#headerToggle, #header, #main')
                .css('transition', 'none');

    });

})(jQuery);