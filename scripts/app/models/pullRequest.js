define(["jquery", "ko"], function ($, ko) {
    return function (id, status, title, url, createdByDisplayName, lastMergeSourceCommitId,
        creationDate, sourceRefName, mergeStatus, description, repositoryName, repositoryUrl) {
            var self = this;

            this.pullRequestId = id;
            this.status = status;
            this.title = title;
            this.url = url;
            this.createdByDisplayName = createdByDisplayName;
            this.lastMergeSourceCommitId = lastMergeSourceCommitId;
            this.creationDate = creationDate;
            this.sourceRefName = sourceRefName;
            this.mergeStatus = mergeStatus;
            this.description = description;

            this.repositoryName = repositoryName;
            this.repositoryUrl = repositoryUrl;

            this.commits = ko.observableArray();
            this.reviewers = ko.observableArray();

            this.addCommit = function(commit) {
                self.commits.push(commit);
            };
            this.addReviewer=function (reviewer) {
                self.reviewers.push(reviewer);
            }
    };
});
