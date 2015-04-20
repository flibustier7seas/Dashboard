define(["jquery", "ko", "i18n!nls/tr"], function ($, ko, tr) {
    return function (repositories, loader) {
        var self = this;

        this.statisticsViewModel = ko.observable();

        this.list = ko.observableArray();

        this.load = function () {
            repositories.forEach(function (repository) {
                loader.getPullRequests(repository).then(function (data) {
                    ko.utils.arrayPushAll(self.list, data);
                });
            });
        };
        this.load();

        this.add = function (item) {
            self.list.push(item);
        };

        this.headers = [
            { title: ""/*tr.header_Status*/, sortPropertyName: 'minVote', status: ko.observable(0) },
            { title: tr.header_Title, sortPropertyName: 'title', status: ko.observable(0) },
            { title: tr.header_Repository, sortPropertyName: 'repositoryName', status: ko.observable(0) },
            //{ title: tr.header_Author, sortPropertyName: 'createdByDisplayName',status: ko.observable(0) },
            { title: tr.header_CreationDate, sortPropertyName: 'creationDate', status: ko.observable(0) },
            { title: tr.header_Updated, sortPropertyName: 'update', status: ko.observable(0) },
            { title: tr.header_StatusIssue, sortPropertyName: 'statusName', status: ko.observable(0) },
            { title: ""/*tr.header_Priority*/, sortPropertyName: 'priorityName', status: ko.observable(0) },
            { title: ""/*tr.header_TypeIssue*/, sortPropertyName: 'issueTypeName', status: ko.observable(0) }
        ];

        this.title = {
            repository: tr.header_Repository,
            author: tr.header_Author,
            creationDate: tr.header_CreationDate,
            mergeStatus: tr.header_mergeStatus
        };

        ///NOTE: Сортировка
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

        ///NOTE: Фильтрация
        ///NOTE: Фильтры по кнопке
        this.filters = [
            { title: tr.filter_ShowAll, filter: null },
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
        this.activeFilter = ko.observable(self.filters[0].filter);
        this.setActiveFilter = function (model) {
            self.activeFilter(model.filter);
        };

        ///NOTE: Фильтр по введенному тексту
        this.textForFilters = ko.observable("");
        this.propertyForFilters = ko.observable();


        this.filteredListOfPullRequest = ko.computed(function () {

            var result;

            if (self.activeFilter()) {
                result = self.list().filter(self.activeFilter());
            } else {
                result = self.list();
            }

            if (self.textForFilters() != "") {
                result = result.filter(function (item) {
                    return item[self.propertyForFilters()]().indexOf(self.textForFilters()) != -1;
                });
            }
            return result;
        });

        ///NOTE: Выбранный pullRequest, для отображения подробной информации
        this.chosenPullRequest = ko.observable();
        this.setPullRequest = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };


        ///NOTE: Разбиение на страницы

        //Количество записей на странице
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
        //Открытая страница
        this.pageNumber = ko.observable(1);
        this.setPage = function (page) {
            self.pageNumber(page.num);
        };
        //Количество страниц
        this.numberOfPages = ko.computed(function () {
            var num = Math.ceil(self.filteredListOfPullRequest().length / self.countRecords());

            if (self.pageNumber() > num && num != 0) {
                self.pageNumber(num);
            };
            return num;
        });

        //Записи для текущей страницы
        this.pullRequests = ko.computed(function () {
            var indexEnd = self.pageNumber() * self.countRecords();
            var indexBegin = indexEnd - self.countRecords();
            return self.filteredListOfPullRequest().slice(indexBegin, indexEnd);
        });


        //Кнопки для переключения страниц
        this.numberOfPagesButton = ko.computed(function () {
            var buttons = [];
            for (var i = 1; i <= self.numberOfPages() ; i++) {
                buttons.push({ num: i });
            };
            return buttons;
        });
    };
});