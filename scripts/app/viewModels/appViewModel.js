define(["jquery", "ko", "./repositoryViewModel", "./pullRequestViewModel"], function ($, ko, repositoryViewModel, pullRequestViewModel) {
    return function (client) {

        var self = this;

        this.listOfPullRequest = ko.observableArray();

        this.listOfRepositories = ko.observableArray();

        this.menuHeaders = ko.observableArray([
            { title: "Repositories", active: ko.observable(true) },
            { title: "Pull Requests", active: ko.observable(false) }
        ]);

        //TODO: вынести в pullRequestVM
        this.headers = [
            { title: 'Repository', sortPropertyName: 'repositoryName', asc: true, active: false },
            { title: 'Author', sortPropertyName: 'createdByDisplayName', asc: true, active: false },
            { title: 'Title', sortPropertyName: 'title', asc: true, active: false },
            { title: 'Updated', sortPropertyName: 'update', asc: true, active: false },
            { title: 'Status', sortPropertyName: 'minVote', asc: true, active: false }
        ];

        //TODO: вынести в pullRequestVM
        this.filters = [
            { title: 'Show All', filter: null },
            { title: 'Only erm', filter: function (item) { return item.repository().name() == 'erm'; } },
            { title: 'Only auto-tests', filter: function (item) { return item.repository().name() == 'auto-tests'; } },
            { title: 'Status: No vote', filter: function (item) { return item.titleMinVote() == 'No vote'; } },
            { title: 'Status: Yes', filter: function (item) { return item.titleMinVote() == 'Yes'; } },
            { title: 'Status: No', filter: function (item) { return item.titleMinVote() == 'No'; } }
        ];

        //TODO: вынести
        this.headersRepository = [
            { title: 'id', sortPropertyName: 'id', asc: true, active: false },
            { title: 'name', sortPropertyName: 'name', asc: true, active: false },
            { title: 'projectName', sortPropertyName: 'projectName', asc: true, active: false },
            { title: 'defaultBranch', sortPropertyName: 'defaultBranch', asc: true, active: false }
        ];

        this.setActiveMenu = function(header) {
            ko.utils.arrayForEach(self.menuHeaders(), function(item) {
                 item.active(false);
            });
            header.active(true);
        }

        this.activeSort = ko.observable(function () { return 0; });

        this.sort = function (header,asc,items) {

            ko.utils.arrayForEach(self.headers, function (item) { item.active = false; });

            header.active = true;

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

        this.textForFilters = ko.observable("");
        this.propertyForFilters = ko.observable();
        this.activeFilter = ko.observable(self.filters[0].filter);
        this.setActiveFilter = function (model) {
            self.activeFilter(model.filter);
        };

        this.filteredListOfPullRequest = ko.computed(function () {
            var result;
            //Фильтр по кнопке
            if (self.activeFilter()) {
                result = ko.utils.arrayFilter(self.listOfPullRequest(), self.activeFilter());
            } else {
                result = self.listOfPullRequest();
            }
            //Фильтр по введенному тексту
            if (self.textForFilters() != "") {
                result = ko.utils.arrayFilter(result, function (item) {
                    return item[self.propertyForFilters()]().indexOf(self.textForFilters()) != -1;
                });
            }

            return result;
        });

        this.chosenPullRequest = ko.observable("");
        this.setReviewers = function(pullRequest) {
            self.chosenPullRequest(pullRequest);
        };

        client.getRepositories().done(function (repositories) {

            $.each(repositories, function () {

                var repository = new repositoryViewModel(this);

                self.listOfRepositories.push(repository);

                client.getPullRequests(repository.id()).done(function (pullRequests) {

                    $.each(pullRequests, function () {
                        self.listOfPullRequest.push(new pullRequestViewModel(this, repository, client));

                    });

                });
            });
        });
    };
});

