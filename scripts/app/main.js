define(["jquery", "ko", "./server", "./ViewModels/appViewModel"], function ($, ko, server, appViewModel) {
    var mainUrl = "http://uk-tfs02.2gis.local:8080/tfs/DefaultCollection";

    $(function () {
        var client = new server(mainUrl);
        ko.applyBindings(new appViewModel(client));
    });
});
