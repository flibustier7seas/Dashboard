define(["jquery", "ko", "../utils"], function ($, ko, utils) {
    return function (id, status, title, url, createdByDisplayName, createdById, createdByLogin, lastMergeSourceCommitId,
        creationDate, sourceRefName, targetRefName, mergeStatus, description, repositoryName, repositoryUrl, repositoryId,loader) {

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
        this.repositoryId = repositoryId;

        this.title = ko.observable(title);
        this.repositoryName = ko.observable(repositoryName);
        this.createdByDisplayName = ko.observable(createdByDisplayName);
        this.creationDate = ko.observable(creationDate);
        this.createdByLogin = ko.observable(createdByLogin);
        this.creationDateToText = ko.observable(utils.dateToText(creationDate));
        this.priorityName = ko.observable("");
        this.priorityIconUrl = ko.observable("");
        this.statusName = ko.observable("");
        this.issueTypeName = ko.observable("");
        this.issueTypeIconUrl = ko.observable("");
        this.issueUrl = ko.observable("");
        this.updateToText = ko.observable();
        this.update = ko.observable();

        this.reviewers = ko.observableArray();
        this.addReviewer = function (reviewer) {
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
        
        this.commitsArray = ko.observableArray();
        this.commits = ko.pureComputed(function() {
            if (!self.commitsArray().length) {
                loader.getCommits(self.sourceRefName, self.targetRefName, self.repositoryId).then(function (data) {
                    self.commitsArray(data);
                    return self.commitsArray;
                });
            }
            return self.commitsArray();
        });

        this.buildsArray = ko.observableArray();
        this.builds = ko.pureComputed(function () {
            if (!self.buildsArray().length) {
                loader.getBuildsId(self.sourceRefName).then(function (items) {
                    items.forEach(function (item) {
                        loader.getBuild(item).then(function (build) {
                            self.buildsArray.push(build);
                        });
                    });
                });
            }
            return self.buildsArray();
        });
    };
});
