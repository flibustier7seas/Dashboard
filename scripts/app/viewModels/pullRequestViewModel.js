define(["jquery", "ko"], function ($, ko) {
    return function (pullRequest) {
        this.pullRequestId = ko.observable(pullRequest.pullRequestId);
        this.status = ko.observable(pullRequest.status);
        this.title = ko.observable(pullRequest.title);
        this.url = ko.observable(pullRequest.url);
        this.createdByDisplayName = ko.observable(pullRequest.createdByDisplayName);
    };
});
