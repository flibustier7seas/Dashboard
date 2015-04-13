define(["jquery", "ko", "i18n!nls/tr", "app/viewLoader", "chart"], function ($, ko, tr, viewLoader) {
    return function () {
        var self = this;

        this.list = ko.observableArray();

        this.add = function (item) {
            self.list.push(item);
        };

        ///NOTE: Заголовки таблицы
        this.headers = [
            { title: ""/*tr.header_Status*/, sortPropertyName: 'minVote', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_Title, sortPropertyName: 'title', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_Repository, sortPropertyName: 'repositoryName', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_Author, sortPropertyName: 'createdByDisplayName', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_CreationDate, sortPropertyName: 'creationDate', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_Updated, sortPropertyName: 'update', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_StatusIssue, sortPropertyName: 'statusName', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_Priority, sortPropertyName: 'priorityName', asc: ko.observable(true), active: ko.observable(false) },
            { title: tr.header_TypeIssue, sortPropertyName: 'issueTypeName', asc: ko.observable(true), active: ko.observable(false) }
        ];

        this.getOpacity = ko.computed(function (data) {

            console.log(data);
        });

        ///NOTE: Столбец для сортировки
        this.sortHeader = ko.observable(self.headers[2]);

        this.sort = function (data) {
            self.sortHeader().active(false);

            data.active(true);
            data.asc(!data.asc());

            self.sortHeader(data);
        };

        this.sortList = ko.computed(function () {
            var property = self.sortHeader().sortPropertyName;
            var compare = function (a, b) {
                if (self.sortHeader().asc()) {
                    return a[property]() < b[property]() ? -1 : a[property]() > b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                } else {
                    return a[property]() > b[property]() ? -1 : a[property]() < b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                }
            };
            self.list.sort(compare);
        });


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
        ///NOTE: Прорисовка диаграммы
        this.updateData = function () {
            for (var i = 0; i < self.data.length; i++) {
                self.data[i].value = self.statistic()[i].count();
            }
            //new Chart(document.getElementById("pie").getContext("2d")).Pie(self.data);
        };




        ///NOTE: Фильтрация
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

        ///NOTE: PullRequest для подробного просмотра
        this.chosenPullRequest = ko.observable();

        this.setPullRequest = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };

        
        ///NOTE: Разбиение на страницы, нужно ли?
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


        ///TODO: Вынести загрузку View из ViewModel
        this.isLoaded = ko.observable(false);
        this.loadPage = function () {
            if (!self.isLoaded()) {
                viewLoader.loadView("pullRequestsView", function () {
                    self.isLoaded(true);
                });
            }
        }
        this.loadPage();
    };
});

