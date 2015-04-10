define(["jquery", "ko"],
    function ($, ko) {
        return function (pullRequests) {

        var self = this;

        this.userId = user.id;
        this.userName = user.name;

        this.listOfPullRequest = ko.observable(pullRequests);

        this.menuHeaders = ko.observableArray([
            { title: "Pull Requests", active: ko.observable(true) }
        ]);

        this.setActiveMenu = function(header) {
           self.menuHeaders().forEach( function(item) {
                item.active(false);
            });
            header.active(true);
        };
    };
});

