define(["jquery", "ko"], function ($, ko) {
    return function (id, status, title, url, createdByDisplayName, createdById, createdByLogin, lastMergeSourceCommitId,
        creationDate, sourceRefName,targetRefName, mergeStatus, description, repositoryName, repositoryUrl) {

        var self = this;

        this.pullRequestId = id;
        this.status = status;
        this.title = title;
        this.url = url;
        this.createdByDisplayName = createdByDisplayName;
        this.createdById = createdById;
        this.createdByLogin = createdByLogin;
        this.lastMergeSourceCommitId = lastMergeSourceCommitId;
        this.creationDate = creationDate;
        this.sourceRefName = sourceRefName;
        this.targetRefName = targetRefName;
        this.mergeStatus = mergeStatus;
        this.description = description;

        this.repositoryName = repositoryName;
        this.repositoryUrl = repositoryUrl;

        this.commits = ko.observableArray();
        this.reviewers = ko.observableArray();
        this.builds = ko.observableArray();

        this.priorityName = ko.observable("");
        this.issueUrl = ko.observable("");
        this.statusName = ko.observable("");
        this.issueTypeName = ko.observable("");
        

        this.addCommit = function (commit) {
            self.commits.push(commit);
        };
        this.addReviewer = function (reviewer) {
            self.reviewers.push(reviewer);
        }
    };
});
