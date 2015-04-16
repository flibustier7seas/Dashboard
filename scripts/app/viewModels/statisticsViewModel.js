define(["jquery", "ko", "i18n!nls/tr", "chart", "d3", "Donut3D"], function ($, ko, tr) {
    return function (pullRequests) {
        var self = this;

        this.list = pullRequests.list;
        this.getStat = function (property, value) {
            var result = self.list().filter(function (item) {
                return item[property]() == value;
            });
            return result.length;
        };

        this.isLoaded = ko.observable(false);

        this.statistic = ko.observableArray([
            { title: tr.filter_StatusNoVote, count: ko.computed(function () { return self.getStat("titleMinVote", "No vote"); }) },
            { title: tr.filter_StatusYes, count: ko.computed(function () { return self.getStat("titleMinVote", "Yes"); }) },
            { title: tr.filter_StatusNo, count: ko.computed(function () { return self.getStat("titleMinVote", "No"); }) },
            { title: tr.filter_ShowAll, count: ko.computed(function () { return self.list().length; }) },
            {
                title: "My Pull Requests", count: ko.computed(function () {
                    return self.list().filter(function (item) {
                        return item.createdByLogin() == user.login;
                    }).length;
                })
            },
            {
                title: "My reviews", count: ko.computed(function () {
                    return self.list().filter(function (item) {
                        return item.reviewers().filter(function (reviewer) {
                            return reviewer.login == user.login;
                        }).length > 0;
                    }).length;
                })
            }
        ]);

        ko.bindingHandlers.myChart = {
            init: function (element, valueAccessor, allBindingsAccesor, viewModel, bindingContext) {
                var svg = d3.select(element).append("svg").attr("width", 700).attr("height", 300);
                svg.append("g").attr("id", valueAccessor());
            },
            update: function (element, valueAccessor, allBindingsAccesor, viewModel, bindingContext) {
                var salesData = [
	                { label: self.statistic()[0].title, value: self.statistic()[0].count(), color: "#3366CC" },
	                { label: self.statistic()[1].title, value: self.statistic()[1].count(), color: "#DC3912" },
	                { label: self.statistic()[2].title, value: self.statistic()[2].count(), color: "#FF9900" }
                ];
                Donut3D.draw(valueAccessor(), salesData, 150, 150, 130, 100, 30, 0.4);
            }
        };
    };
});
