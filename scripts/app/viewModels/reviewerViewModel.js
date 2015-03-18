define(["jquery", "ko"], function ($, ko) {
    return function (reviewer) {
        var self = this;

        this.displayName = ko.observable(reviewer.displayName);
        this.vote = ko.observable(reviewer.vote);
        this.titleVote = ko.computed(function () {
            if (self.vote() == -10) {
                return "No";
            }
            if (self.vote() == 0) {
                return "No vote";
            }
            if (self.vote() == 10) {
                return "Yes";
            }
            return "";
        });
    };
});
