define(["jquery", "ko", "./repositoryViewModel", "./pullRequestViewModel", "./listOfRepositoriesViewModel", "./listOfPullRequestViewModel"],
    function ($, ko, repositoryViewModel, pullRequestViewModel, listOfRepositoriesViewModel, listOfPullRequestViewModel) {
    return function (client) {

        var self = this;

        this.listOfPullRequest = ko.observable(new listOfPullRequestViewModel());
        this.listOfRepositories = ko.observable(new listOfRepositoriesViewModel());

        this.menuHeaders = ko.observableArray([
            { title: "Repositories", active: ko.observable(true) },
            { title: "Pull Requests", active: ko.observable(false) }
        ]);

        this.setActiveMenu = function(header) {
            ko.utils.arrayForEach(self.menuHeaders(), function(item) {
                item.active(false);
            });
            header.active(true);
        };

        this.sort = function (header, asc, items) {
            //ko.utils.arrayForEach(self.headers, function (item) { item.active = false; });
            //header.active = true;
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

        client.getRepositories().done(function (repositories) {

            $.each(repositories, function () {
                var repository = new repositoryViewModel(this);

                self.listOfRepositories().add(repository);

                client.getPullRequests(repository.id()).done(function (pullRequests) {

                    $.each(pullRequests, function () {
                        self.listOfPullRequest().add(new pullRequestViewModel(this, repository, client));
                    });
                });
            });
        });

    };
});

