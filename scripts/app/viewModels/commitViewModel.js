define(["jquery", "ko"], function ($, ko) {
    return function (commit) {
        this.commitId = ko.observable(commit.commitId);
        this.pushDate = ko.observable(commit.pushDate);
        this.comment = ko.observable(commit.comment);
    };
});