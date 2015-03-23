define(["jquery", "ko", "./server", "./ViewModels/appViewModel"], function ($, ko, server, appViewModel) {
    $(function () {
        var client = new server(settings.mainUrl);
        ko.applyBindings(new appViewModel(client));
    });
});
