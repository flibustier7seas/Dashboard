define(["jquery", "ko", "moment"], function ($, ko, moment) {
    return function (pullRequest) {
        var self = this;

        this.repositoryName = ko.observable(pullRequest.repositoryName);
        this.repositoryUrl = ko.observable(pullRequest.repositoryUrl);

        this.pullRequestId = ko.observable(pullRequest.pullRequestId);
        this.status = ko.observable(pullRequest.status);
        this.title = ko.observable(pullRequest.title);
        this.createdByDisplayName = ko.observable(pullRequest.createdByDisplayName);
        this.createdById = ko.observable(pullRequest.createdById);
        this.creationDate = ko.observable(pullRequest.creationDate);
        this.sourceRefName = ko.observable(pullRequest.sourceRefName);
        this.mergeStatus = ko.observable(pullRequest.mergeStatus);
        this.description = ko.observable(pullRequest.description);

        this.commits = pullRequest.commits;
        this.reviewers = pullRequest.reviewers;

        this.url = ko.computed(function () {
            return pullRequest.repositoryUrl + pullRequest.url;
        });



        this.creationDateToText = ko.computed(function () {
            if (moment().diff(self.creationDate(), 'days') < 7) {
                return moment(self.creationDate()).fromNow();
            }
            return moment(self.creationDate()).format('LLLL');
        });

        this.titleMinVote = ko.observable();

        this.minVote = ko.computed(function () {

            var minVote = 20;
            var titleMinVote = "No reviewers";

            ///TODO: вынести в утилиты
            self.reviewers().forEach(function (reviewer) {
                if (reviewer.vote < minVote) {
                    minVote = reviewer.vote;
                    titleMinVote = reviewer.titleVote;
                }
            });
            self.titleMinVote(titleMinVote);

            return minVote;
        });

        this.updateToText = ko.observable();
        this.update = ko.computed(function () {
            if (self.commits().length > 0) {

                var maxDate = self.commits()[0].pushDate;

                ///TODO: вынести в утилиты
                self.commits().forEach(function (commit) {
                    if (commit.pushDate > maxDate) {
                        maxDate = commit.pushDate;
                    }
                });

                if (moment().diff(maxDate, 'days') < 7) {
                    self.updateToText(moment(maxDate).fromNow());
                }

                self.updateToText(moment(maxDate).format('LLLL'));
                return maxDate;
            }
            return "";
        });
    };
});
