﻿define(["jquery", "ko", "i18n!nls/tr", "chart"], function ($, ko, tr) {
    return function () {
        var self = this;
        this.list = ko.observableArray();
        this.add = function (item) {
            self.list.push(item);
        };

        ///NOTE: Заголовки таблицы
        this.headers = [
            { title: tr.header_Repository, sortPropertyName: 'repositoryName', asc: true, active: true, opacityUp: ko.observable(0.5), opacityDown: ko.observable(1)},
            { title: tr.header_Author, sortPropertyName: 'createdByDisplayName', asc: true, active: false, opacityUp: ko.observable(1), opacityDown: ko.observable(1) },
            { title: tr.header_Title, sortPropertyName: 'title', asc: true, active: false, opacityUp: ko.observable(1), opacityDown: ko.observable(1) },
            { title: tr.header_CreationDate, sortPropertyName: 'creationDate', asc: false, active: false, opacityUp: ko.observable(1), opacityDown: ko.observable(1) },
            { title: tr.header_Updated, sortPropertyName: 'update', asc: true, active: false, opacityUp: ko.observable(1), opacityDown: ko.observable(1) },
            { title: tr.header_Status, sortPropertyName: 'minVote', asc: true, active: false, opacityUp: ko.observable(1), opacityDown: ko.observable(1) }
        ];

        ///NOTE: Столбец для сортировки
        this.sortHeader = ko.observable(self.headers[0]);

        this.sort = function(data, asc) {
            ///NOTE: Подсветка стрелочки
            self.sortHeader().opacityUp(1);
            self.sortHeader().opacityDown(1);
            if (asc == true) {
                data.opacityUp(0.5);
            } else {
                data.opacityDown(0.5);
            }
            data.asc = asc;
            self.sortHeader(data);
        };

        this.sortList = ko.computed(function() {
            var property = self.sortHeader().sortPropertyName;
            var compare = function (a, b) {
                if (self.sortHeader().asc) {
                    return a[property]() < b[property]() ? -1 : a[property]() > b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                } else {
                    return a[property]() > b[property]() ? -1 : a[property]() < b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                }
            };
            self.list.sort(compare);
        });

        this.getStat = function (property, value) {
            var result = self.list().filter(function (item) {
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


        ///NOTE: Данные для диаграммы
        this.data = [
            {
                value: 1,
                color: "#F7464A",
                highlight: "#FF5A5E",
                label: tr.filter_StatusNoVote
            },
            {
                value: 1,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: tr.filter_StatusYes
            },
            {
                value: 1,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: tr.filter_StatusNo
            }
        ];

        this.updateData = function () {
            for (var i = 0; i < self.data.length; i++) {
                self.data[i].value = self.statistic()[i].count();
            }
            new Chart(document.getElementById("pie").getContext("2d")).Pie(self.data);
        };


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
                    return item.reviewers().filter(function (reviewer) {
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
                result = self.list().filter(self.activeFilter());
            } else {
                result = self.list();
            }
            //Фильтр по введенному тексту
            if (self.textForFilters() != "") {
                result = result.filter(function (item) {
                    return item[self.propertyForFilters()]().indexOf(self.textForFilters()) != -1;
                });
            }

            self.updateData();
            return result;
        });

        this.chosenPullRequest = ko.observable();

        this.setReviewers = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };


        ///NOTE: Разбиение на страницы
        this.countRecords = ko.observable(20);
        this.pageNumber = ko.observable(1);
        this.newListOfPullRequest = ko.computed(function () {
            var indexEnd = self.pageNumber() * self.countRecords();
            var indexBegin = indexEnd - self.countRecords();
            return self.filteredListOfPullRequest().slice(indexBegin, indexEnd);
        });
        this.numberOfPages = ko.computed(function() {
            return Math.ceil(self.filteredListOfPullRequest().length / self.countRecords());
        });
        this.numberOfPagesButton = ko.computed(function () {
            var buttons = [];
            for (var i = 1; i <= self.numberOfPages();i++ ) {
                buttons.push({num: i});
            }
            return buttons;
        });
        this.setPage = function(page) {
            self.pageNumber(page.num);
        }

    };
});

