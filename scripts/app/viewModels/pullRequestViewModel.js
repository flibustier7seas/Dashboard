define(["jquery", "ko", "moment", "./reviewerViewModel"], function ($, ko, moment, reviewerViewModel) {
    return function (pullRequest, repository, client) {
        var self = this;

        this.repository = ko.observable(repository);
        this.repositoryName = ko.observable(repository.name());
        this.repositoryUrl = ko.observable(repository.url());

        this.pullRequestId = ko.observable(pullRequest.pullRequestId);
        this.status = ko.observable(pullRequest.status);
        this.title = ko.observable(pullRequest.title);
        this.createdByDisplayName = ko.observable(pullRequest.createdByDisplayName);
        this.creationDate = ko.observable(pullRequest.creationDate);
        this.sourceRefName = ko.observable(pullRequest.sourceRefName);
        this.mergeStatus = ko.observable(pullRequest.mergeStatus);
        this.description = ko.observable(pullRequest.description);

        this.update = ko.observable();
        this.minVote = ko.observable();
        this.titleMinVote = ko.observable();

        this.reviewers = ko.observableArray();

        this.url = ko.computed(function () {
            return repository.url() + pullRequest.url;
        });

        this.date = ko.computed(function () {
            if (moment().diff(self.update(), 'days') < 7) {
                return moment(self.update()).fromNow();
            }
            return moment(self.update()).format('LLLL');
        });

        client.getCommit(repository.id(), pullRequest.lastMergeSourceCommitId).done(function (commit) {
            self.update(commit.pushDate);
        });

        client.getReviewers(repository.id(), self.pullRequestId()).done(function (reviewers) {

            var minVote = 20;
            var titleMinVote = "No reviewers";

            reviewers.forEach(function (item) {
                var reviewer = new reviewerViewModel(item);
                if (reviewer.vote() < minVote) {
                    minVote = reviewer.vote();
                    titleMinVote = reviewer.titleVote();
                }
                self.reviewers.push(reviewer);
            });
            self.minVote(minVote);
            self.titleMinVote(titleMinVote);
        });
    };
});
