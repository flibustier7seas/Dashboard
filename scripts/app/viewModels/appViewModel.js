define(["jquery", "ko", "./repositoryViewModel", "./pullRequestViewModel", "./listOfRepositoriesViewModel", "./listOfPullRequestViewModel"],
    function ($, ko, repositoryViewModel, pullRequestViewModel, listOfRepositoriesViewModel, listOfPullRequestViewModel) {
        return function (pullRequests) {

        console.log(settings.userId);
        console.log(settings.userName);

        var self = this;

        this.userName = settings.userName;
        this.userId = settings.userId;

        this.listOfPullRequest = ko.observable(pullRequests);

        this.menuHeaders = ko.observableArray([
            { title: "Pull Requests", active: ko.observable(true) }
        ]);

        this.setActiveMenu = function(header) {
            ko.utils.arrayForEach(self.menuHeaders(), function(item) {
                item.active(false);
            });
            header.active(true);
        };

        this.sort = function (header, asc, items) {
            var prop = header.sortPropertyName;
            var sort = function (a, b) {
                if (asc) {
                    return a[prop]() < b[prop]() ? -1 : a[prop]() > b[prop]() ? 1 : a[prop]() == b[prop]() ? 0 : 0;
                } else {
                    return a[prop]() > b[prop]() ? -1 : a[prop]() < b[prop]() ? 1 : a[prop]() == b[prop]() ? 0 : 0;
                }
            };
            items.sort(sort);
        };

    };
});

