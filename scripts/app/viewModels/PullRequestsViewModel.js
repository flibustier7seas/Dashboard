define(["jquery", "ko", "i18n!nls/tr", "chart"], function ($, ko, tr) {
    return function () {
        var self = this;

        this.list = ko.observableArray();

        this.add = function (item) {
            self.list.push(item);
        };

        ///NOTE: Заголовки таблицы
        this.headers = [
            { title: ""/*tr.header_Status*/, sortPropertyName: 'minVote',status: ko.observable(0) },
            { title: tr.header_Title, sortPropertyName: 'title',status: ko.observable(0) },
            { title: tr.header_Repository, sortPropertyName: 'repositoryName',status: ko.observable(0) },
            { title: tr.header_Author, sortPropertyName: 'createdByDisplayName',status: ko.observable(0) },
            { title: tr.header_CreationDate, sortPropertyName: 'creationDate',status: ko.observable(0) },
            { title: tr.header_Updated, sortPropertyName: 'update',status: ko.observable(0) },
            { title: tr.header_StatusIssue, sortPropertyName: 'statusName',status: ko.observable(0) },
            { title: tr.header_Priority, sortPropertyName: 'priorityName',status: ko.observable(0) },
            { title: tr.header_TypeIssue, sortPropertyName: 'issueTypeName',status: ko.observable(0) }
        ];

        ///NOTE: Столбец для сортировки
        this.sortHeader = self.headers[0];

        this.sort = function (data) {
            if (data.status() !== 0) {
                data.status(-data.status());
            } else {
                self.sortHeader.status(0);
                data.status(1);
                self.sortHeader = data;
            }
            self.sortList();
        };

        this.sortList = function () {
            var property = self.sortHeader.sortPropertyName;
            var compare = function (a, b) {
                if (self.sortHeader.status() == 1) {
                    return a[property]() < b[property]() ? -1 : a[property]() > b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                } else {
                    return a[property]() > b[property]() ? -1 : a[property]() < b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                }
            };
            self.list.sort(compare);
        };


        ///TODO: Вынести статистику в отдельную ViewModel
        //NOTE: Статистика
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
        //this.data = [
        //    {
        //        value: 1,
        //        color: "#F7464A",
        //        highlight: "#FF5A5E",
        //        label: tr.filter_StatusNoVote
        //    },
        //    {
        //        value: 1,
        //        color: "#46BFBD",
        //        highlight: "#5AD3D1",
        //        label: tr.filter_StatusYes
        //    },
        //    {
        //        value: 1,
        //        color: "#FDB45C",
        //        highlight: "#FFC870",
        //        label: tr.filter_StatusNo
        //    }
        //];
        /////NOTE: Прорисовка диаграммы
        //this.updateData = function () {
        //    for (var i = 0; i < self.data.length; i++) {
        //        self.data[i].value = self.statistic()[i].count();
        //    }
        //    //new Chart(document.getElementById("pie").getContext("2d")).Pie(self.data);
        //};


        ///NOTE: Фильтрация
        this.filters = [
            { title: tr.filter_ShowAll, filter: null },
            { title: tr.filter_OnlyErm, filter: function (item) { return item.repositoryName() == 'erm'; } },
            { title: tr.filter_OnlyAutoTests, filter: function (item) { return item.repositoryName() == 'auto-tests'; } },
            { title: tr.filter_StatusNoVote, filter: function (item) { return item.titleMinVote() == 'No vote'; } },
            { title: tr.filter_StatusYes, filter: function (item) { return item.titleMinVote() == 'Yes'; } },
            { title: tr.filter_StatusNo, filter: function (item) { return item.titleMinVote() == 'No'; } },
            { title: tr.filter_MyPullRequest, filter: function (item) { return item.createdByLogin() == user.login; } },
            {
                title: tr.filter_MyReview, filter: function (item) {
                    return item.reviewers().filter(function (reviewer) {
                        return reviewer.login == user.login;
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
            //self.updateData();
            return result;
        });


        ///NOTE: PullRequest для подробного просмотра
        this.chosenPullRequest = ko.observable();

        this.setPullRequest = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };


        ///NOTE: Разбиение на страницы
        this.records = ko.observable(25);
        this.countRecords = ko.computed({
            read: function () {
                return self.records();
            },
            write: function (value) {
                if (value > 0) {
                    self.records(Math.ceil(value));
                }
            }
        });

        this.pageNumber = ko.observable(1);
        this.setPage = function (page) {
            self.pageNumber(page.num);
        };

        this.numberOfPages = ko.computed(function () {
            var num = Math.ceil(self.filteredListOfPullRequest().length / self.countRecords());

            if (self.pageNumber() > num && num != 0) {
                self.pageNumber(num);
            };
            return num;
        });

        this.pullRequests = ko.computed(function () {
            var indexEnd = self.pageNumber() * self.countRecords();
            var indexBegin = indexEnd - self.countRecords();
            return self.filteredListOfPullRequest().slice(indexBegin, indexEnd);
        });

        this.numberOfPagesButton = ko.computed(function () {
            var buttons = [];
            for (var i = 1; i <= self.numberOfPages() ; i++) {
                buttons.push({ num: i });
            };
            return buttons;
        });
    };
});

