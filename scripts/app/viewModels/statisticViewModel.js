define(["jquery", "ko"], function ($, ko) {
    return function (pullRequests) {
        var self = this;

        ///NOTE: Статистика
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
    };
});
