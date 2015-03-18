define(["jquery", "ko"], function ($, ko) {
    return function (reviewer) {
        this.displayName = ko.observable(reviewer.displayName);
        this.vote = ko.observable(reviewer.vote);
    };
});
