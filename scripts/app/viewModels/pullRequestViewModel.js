define(["jquery", "ko", "moment"], function ($, ko,moment) {
    return function (pullRequest, repository,client) {
        var self = this;

        this.repository = ko.observable(repository);
        this.repositoryName = ko.observable(repository.name());
        this.repositoryUrl = ko.observable(repository.url());

        this.pullRequestId = ko.observable(pullRequest.pullRequestId);
        this.status = ko.observable(pullRequest.status);
        this.title = ko.observable(pullRequest.title);
        this.createdByDisplayName = ko.observable(pullRequest.createdByDisplayName);

        this.update = ko.observable();

        this.url = ko.computed(function () {
            return repository.url() + pullRequest.url;
        });

        this.date = ko.computed(function () {
            if (moment().diff(self.update(), 'days') < 7) {
                return moment(self.update()).fromNow();
            }
            return moment(self.update()).format('LLLL');
        });

        //NOTE: Создать модель для commit
        client.getCommit(repository.id(), pullRequest.lastMergeSourceCommitId).done(function (commit) {
            self.update(commit.pushDate);
        });
    };
});
