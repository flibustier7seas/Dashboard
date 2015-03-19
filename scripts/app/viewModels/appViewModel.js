define(["jquery", "ko", "./repositoryViewModel", "./pullRequestViewModel"], function ($, ko, repositoryViewModel, pullRequestViewModel) {
    return function (client) {
        var self = this;

        this.headers = [
            { title: 'Repository', sortPropertyName: 'repositoryName', asc: true, active: false },
            { title: 'Author', sortPropertyName: 'createdByDisplayName', asc: true, active: false },
            { title: 'Title', sortPropertyName: 'title', asc: true, active: false },
            { title: 'Updated', sortPropertyName: 'update', asc: true, active: false },
            { title: 'Status', sortPropertyName: 'minVote', asc: true, active: false }];

        this.filters = [
            { title: 'Show All', filter: null },
            { title: 'Only erm', filter: function (item) { return item.repository().name() == 'erm'; } },
            { title: 'Only auto-tests', filter: function (item) { return item.repository().name() == 'auto-tests'; } },
            { title: 'Status: No vote', filter: function (item) { return item.titleMinVote() == 'No vote'; } },
            { title: 'Status: Yes', filter: function (item) { return item.titleMinVote() == 'Yes'; } },
            { title: 'Status: No', filter: function (item) { return item.titleMinVote() == 'No'; } }
        ];

        this.textForFilters = ko.observable("");

        this.chosenPullRequest = ko.observable("");


        this.propertyForFilters = ko.observable();

        this.activeSort = ko.observable(function () { return 0; });

        this.reviewers = ko.observableArray();

        this.setReviewers = function (pullRequest) {
            self.reviewers.removeAll();
            pullRequest.reviewers().forEach(function (item) {
                self.reviewers.push(item);
            });

            self.chosenPullRequest(pullRequest);
        }

        this.sort = function (header) {
            //NOTE: ���� �������� 2 ����, �� ������ ����������� ����������
            if (header.active) {
                header.asc = !header.asc;
            }

            ko.utils.arrayForEach(self.headers, function (item) { item.active = false; });

            header.active = true;

            var prop = header.sortPropertyName;
            var ascSort = function (a, b) {
                return a[prop]() < b[prop]() ? -1 : a[prop]() > b[prop]() ? 1 : a[prop]() == b[prop]() ? 0 : 0;
            };

            var descSort = function (a, b) {
                return a[prop]() > b[prop]() ? -1 : a[prop]() < b[prop]() ? 1 : a[prop]() == b[prop]() ? 0 : 0;
            };
            var sortFunc = header.asc ? ascSort : descSort;

            self.activeSort(sortFunc);
        };

        this.activeFilter = ko.observable(self.filters[0].filter);

        this.setActiveFilter = function (model) {
            self.activeFilter(model.filter);
        };

        this.listOfPullRequest = ko.observableArray();

        this.filteredListOfPullRequest = ko.computed(function () {
            var result;

            if (self.activeFilter()) {
                result = ko.utils.arrayFilter(self.listOfPullRequest(), self.activeFilter());
            } else {
                result = self.listOfPullRequest();
            }

            if (self.textForFilters() != "") {
                result = ko.utils.arrayFilter(result, function (item) {
                    return item[self.propertyForFilters()]().indexOf(self.textForFilters()) != -1;
                });
            }

            return result.sort(self.activeSort());
        });

        client.getRepositories().done(function (repositories) {

            $.each(repositories, function () {

                var repository = new repositoryViewModel(this, client);

                client.getPullRequests(repository.id()).done(function (pullRequests) {

                    $.each(pullRequests, function () {
                        self.listOfPullRequest.push(new pullRequestViewModel(this, repository, client));

                    });

                });
            });
        });
    };
});

