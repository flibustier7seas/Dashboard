define(["jquery", "ko", "i18n!nls/tr", "d3", "Donut3D", "Chart"], function ($, ko, tr) {
    return function (pullRequests,userLogin) {
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
                        return item.createdByLogin() == userLogin;
                    }).length;
                })
            },
            {
                title: "My reviews", count: ko.computed(function () {
                    return self.list().filter(function (item) {
                        return item.reviewers().filter(function (reviewer) {
                            return reviewer.login == userLogin;
                        }).length > 0;
                    }).length;
                })
            }
        ]);
        var statusData = [
            { label: self.statistic()[0].title, value: self.statistic()[0].count(), color: "#3366CC" },
            { label: self.statistic()[1].title, value: self.statistic()[1].count(), color: "#DC3912" },
            { label: self.statistic()[2].title, value: self.statistic()[2].count(), color: "#FF9900" }
        ];

        ko.bindingHandlers.myChart = {
            init: function (element, valueAccessor) {
                var svg = d3.select(element).append("svg").attr("width", 700).attr("height", 300);
                svg.append("g").attr("id", valueAccessor());
            },
            update: function (element, valueAccessor) {
                Donut3D.draw(valueAccessor(), statusData, 150, 150, 130, 100, 30, 0.4);
            }
        };
    };
});

//----------------Chart.js------------------
//
//var pieData = [
//    {
//        value: 300,
//        color: "#F7464A",
//        highlight: "#FF5A5E",
//        label: "Red"
//    },
//    {
//        value: 50,
//        color: "#46BFBD",
//        highlight: "#5AD3D1",
//        label: "Green"
//    }
//];
//ko.bindingHandlers.myChart = {
//    update: function (element) {
//        var canvas = document.createElement('canvas');
//        canvas.width = 600;
//        canvas.height = 600;
//        element.appendChild(canvas);
//        var ctx = canvas.getContext("2d");
//        new Chart(ctx).Pie(pieData);
//    }
//};
