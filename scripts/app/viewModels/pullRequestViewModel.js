define(["jquery", "ko","../utils"], function ($, ko,utils) {
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
            return utils.dateToText(self.creationDate());
        });

        this.titleMinVote = ko.observable();

        this.minVote = ko.computed(function () {
            var compare = utils.getFunctionCompare("vote",false);
            var min = utils.getMaxOfArray(self.reviewers(), compare);

            if (min) {
                self.titleMinVote(min.titleVote);
                return min.vote;
            } else {
                self.titleMinVote("No reviewers");
                return 20;
            }
        });

        this.updateToText = ko.observable();
        this.update = ko.computed(function () {
            var compare = utils.getFunctionCompare("pushDate");
            var max = utils.getMaxOfArray(self.commits(), compare);
            if (max) {
                self.updateToText(utils.dateToText(max.pushDate));
                return max.pushDate;
            }
            return "";
        });


    };
});
