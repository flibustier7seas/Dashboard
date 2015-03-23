define(["jquery", "ko"], function ($, ko) {
    return function () {

        var self = this;

        this.list = ko.observableArray();

        this.add = function (item) {
            self.list.push(item);
        };

        this.headers = [
            { title: 'Repository', sortPropertyName: 'repositoryName', asc: true, active: false },
            { title: 'Author', sortPropertyName: 'createdByDisplayName', asc: true, active: false },
            { title: 'Title', sortPropertyName: 'title', asc: true, active: false },
            { title: 'Creation Date', sortPropertyName: 'creationDate', asc: true, active: false },
            { title: 'Updated', sortPropertyName: 'update', asc: true, active: false },
            { title: 'Status', sortPropertyName: 'minVote', asc: true, active: false }
        ];

        this.filters = [
            { title: 'Show All', filter: null },
            { title: 'Only erm', filter: function (item) { return item.repository().name() == 'erm'; } },
            { title: 'Only auto-tests', filter: function (item) { return item.repository().name() == 'auto-tests'; } },
            { title: 'Status: No vote', filter: function (item) { return item.titleMinVote() == 'No vote'; } },
            { title: 'Status: Yes', filter: function (item) { return item.titleMinVote() == 'Yes'; } },
            { title: 'Status: No', filter: function (item) { return item.titleMinVote() == 'No'; } }
        ];


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
                result = ko.utils.arrayFilter(self.list(), self.activeFilter());
            } else {
                result = self.list();
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
        this.setReviewers = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };
    };
});

