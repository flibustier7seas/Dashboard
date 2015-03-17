define(["jquery", "ko"], function ($, ko) {
    return function (pullRequest, repository,client) {
        var self = this;

        this.repository = ko.observable(repository);
        this.repositoryName = ko.observable(repository.name());
        this.repositoryUrl = ko.observable(repository.url());

        this.url = ko.computed(function() {
            return repository.url() + pullRequest.url;
        });

        this.pullRequestId = ko.observable(pullRequest.pullRequestId);
        this.status = ko.observable(pullRequest.status);
        this.title = ko.observable(pullRequest.title);
        this.createdByDisplayName = ko.observable(pullRequest.createdByDisplayName);

        this.update = ko.observable();
        //NOTE: Создать модель для commit
        client.getCommit(repository.id(), pullRequest.lastMergeSourceCommitId).done(function (commit) {
            self.update(commit.pushDate);
        });
    };
});
