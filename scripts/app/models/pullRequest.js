define(["jquery", "ko", "../utils"], function ($, ko, utils) {
    return function (id, status, title, url, createdByDisplayName, createdById, createdByLogin, lastMergeSourceCommitId,
        creationDate, sourceRefName,targetRefName, mergeStatus, description, repositoryName, repositoryUrl) {

        var self = this;

        this.pullRequestId = id;
        this.status = status;
        this.title = title;
        this.url = url;
        this.createdById = createdById;
        this.lastMergeSourceCommitId = lastMergeSourceCommitId;
        this.sourceRefName = sourceRefName;
        this.targetRefName = targetRefName;
        this.mergeStatus = mergeStatus;
        this.description = description;
        this.repositoryUrl = repositoryUrl;

        this.title = ko.observable(title);
        this.repositoryName = ko.observable(repositoryName);
        this.createdByDisplayName = ko.observable(createdByDisplayName);
        this.creationDate = ko.observable(creationDate);
        this.createdByLogin = ko.observable(createdByLogin);
        this.creationDateToText = ko.observable(utils.dateToText(creationDate));
        this.priorityName = ko.observable("");
        this.statusName = ko.observable("");
        this.issueTypeName = ko.observable("");
        this.issueUrl = ko.observable("");

        this.commits = ko.observableArray();
        this.reviewers = ko.observableArray();
        this.builds = ko.observableArray();

        this.addCommit = function (commit) {
            self.commits.push(commit);
        };
        this.addReviewer = function(reviewer) {
            self.reviewers.push(reviewer);
        };


        this.titleMinVote = ko.observable();
        this.minVote = ko.computed(function () {
            var compare = utils.getFunctionCompare("vote", false);
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
                self.updateToText(max.pushDateToText);
                return max.pushDate;
            }
            return "";
        });

        

    };
});
