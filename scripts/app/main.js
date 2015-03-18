define(["jquery", "ko", "./server", "./ViewModels/appViewModel"], function ($, ko, server, appViewModel) {
    var mainUrl = "http://uk-tfs02.2gis.local:8080/tfs/DefaultCollection";

    $(function () {
        $(document).ready(function () {
            $('.popup .close_window, .overlay').click(function () {
                $('.popup, .overlay').css({ 'opacity': '0', 'visibility': 'hidden' });
            });
            $('a.open_window').click(function (e) {
                $('.popup, .overlay').css({ 'opacity': '1', 'visibility': 'visible' });
                e.preventDefault();
            });
        });
        
        var client = new server(mainUrl);
        ko.applyBindings(new appViewModel(client));
    });
});
