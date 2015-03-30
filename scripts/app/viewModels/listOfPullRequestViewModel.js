define(["jquery", "ko", "i18n!nls/tr", "chart"], function ($, ko, tr) {
    return function () {

        var self = this;

        this.list = ko.observableArray();

        this.add = function (item) {
            self.list.push(item);
        };

        this.getStat = function (property, value) {
            var result = ko.utils.arrayFilter(self.list(), function (item) {
                return item[property]() == value;
            });
            return result.length;
        };

        this.statistic = ko.observableArray([
            { title: tr.filter_StatusNoVote, count: ko.computed(function () { return self.getStat("titleMinVote", "No vote"); }) },
            { title: tr.filter_StatusYes, count: ko.computed(function () { return self.getStat("titleMinVote", "Yes"); }) },
            { title: tr.filter_StatusNo, count: ko.computed(function () { return self.getStat("titleMinVote", "No"); }) },
            { title: tr.filter_ShowAll, count: ko.computed(function () { return self.list().length; }) }
        ]);

        this.data = [
            {
                value: 0,
                color: "#F38630"
            },
            {
                value: 0,
                color: "#E0E4CC"
            },
            {
                value: 0,
                color: "#69D2E7"
            },
            {
                value: 0,
                color: "#697736"
            }
        ];

        this.updateData = function () {
            for (var i = 0; i < self.data.length; i++) {
                self.data[i].value = self.statistic()[i].count();
            }
            new Chart(document.getElementById("canvas").getContext("2d")).Pie(self.data);
        };

        this.add = function (item) {
            self.list.push(item);
        };

        this.headers = [
            { title: tr.header_Repository, sortPropertyName: 'repositoryName', asc: true, active: false },
            { title: tr.header_Author, sortPropertyName: 'createdByDisplayName', asc: true, active: false },
            { title: tr.header_Title, sortPropertyName: 'title', asc: true, active: false },
            { title: tr.header_CreationDate, sortPropertyName: 'creationDate', asc: true, active: false },
            { title: tr.header_Updated, sortPropertyName: 'update', asc: true, active: false },
            { title: tr.header_Status, sortPropertyName: 'minVote', asc: true, active: false }
        ];

        this.filters = [
            { title: tr.filter_ShowAll, filter: null },
            { title: tr.filter_OnlyErm, filter: function (item) { return item.repositoryName() == 'erm'; } },
            { title: tr.filter_OnlyAutoTests, filter: function (item) { return item.repositoryName() == 'auto-tests'; } },
            { title: tr.filter_StatusNoVote, filter: function (item) { return item.titleMinVote() == 'No vote'; } },
            { title: tr.filter_StatusYes, filter: function (item) { return item.titleMinVote() == 'Yes'; } },
            { title: tr.filter_StatusNo, filter: function (item) { return item.titleMinVote() == 'No'; } },
            { title: tr.filter_MyPullRequest, filter: function (item) { return item.createdById() == settings.userId; } },
            {
                title: tr.filter_MyReview, filter: function (item) {
                    return item.reviewers().filter(function(reviewer) {
                       return reviewer.id == settings.userId;
                    }).length > 0;
                }
            }
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

            self.updateData();
            return result;
        });

        this.chosenPullRequest = ko.observable("");

        this.setReviewers = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };
    };
});

