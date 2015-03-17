define(["jquery", "ko", "./pullRequestViewModel"], function ($, ko, pullRequestViewModel) {
    return function (repository, client) {

        var self = this;

        this.id = ko.observable(repository.id);
        this.name = ko.observable(repository.name);
        this.url = ko.observable(repository.url);

        this.listOfPullRequests = ko.observableArray();

        this.getPullRequests = function () {
            return client.getPullRequests(self.id()).done(function (requests) {

                self.listOfPullRequests.removeAll();

                $.each(requests, function () {
                    self.listOfPullRequests.push(new pullRequestViewModel(this));
                });

            });
        };

        this.getPullRequests();
    };
});


