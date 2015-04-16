define(["jquery", "ko", "i18n!nls/tr", "chart"], function ($, ko, tr) {
    return function () {
        var self = this;

        this.list = ko.observableArray();

        this.add = function (item) {
            self.list.push(item);
        };
    };
});