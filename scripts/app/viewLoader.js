define(["jquery"], function ($) {
    return {
        loadView: function (path, success) {
            $.get('view/' + path + '.html', function (templates) {
                $('body').append(templates);
                success();
                }
            );
        }
    }
});
