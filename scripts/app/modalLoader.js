///NOTE: Можно удалять
define(["./utils", "./models/build", "./models/commit", "./models/reviewer", "./models/pullRequest", "./models/repository", "./models/issue"],
    function (utils, buildModel, commitModel, reviewerModel, pullRequestModel, repositoryModel, issueModel) {
        return function (tfs, tc, jira) {
            this.getBuildsId = function (branchName) {
                return tc.getBuilds(branchName)
                    .then(function (data) {
                        return $.map(data.build || [], function (item) {
                            return item.id;
                        });
                    });
            }
            this.getBuild = function (buildId) {
                return tc.getBuild(buildId).then(function (obj) {
                    return new buildModel(
                        obj.buildTypeId,
                        obj.state,
                        obj.status,
                        obj.webUrl,
                        obj.statusText,
                        utils.dateToTextTC(obj.startDate),
                        utils.timeDifference(obj.startDate, obj.finishDate)
                        );
                });
            },
            this.getCommits = function (sourceRefName, targetRefName, repositoryId) {
                return tfs.getCommits(sourceRefName, targetRefName, repositoryId)
                        .then(function (data) {
                            return $.map(data.value || [], function (item) {
                                return new commitModel(item.commitId, item.committer.date, utils.dateToText(item.committer.date), item.comment);
                            });
                        });
            },
            this.getRepositories = function () {
                return tfs.getRepositories().then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new repositoryModel(
                            item.id,
                            item.name,
                            item.remoteUrl,
                            item.project.name,
                            item.defaultBranch
                        );
                    });
                });
            },
            this.getPullRequests = function (repository) {
                return tfs.getPullRequests(repository.id).then(
                    function (items) {
                        return $.map(items.value || [], function (item) {
                            var pullRequest = new pullRequestModel(
                                item.pullRequestId,
                                item.status,
                                item.title,
                                repository.url + "/pullrequest/" + item.pullRequestId,
                                item.createdBy.displayName,
                                item.createdBy.id,
                                item.createdBy.uniqueName,
                                item.lastMergeSourceCommit.commitId,
                                item.creationDate,
                                item.sourceRefName.replace("refs/heads/", ""),
                                item.targetRefName.replace("refs/heads/", ""),
                                item.mergeStatus,
                                item.description,
                                repository.name,
                                repository.url,
                                repository.id
                            );
                            return pullRequest;
                        });
                    });
            },
            this.getCommit = function (repositoryId, commitId) {
                return tfs.getCommit(repositoryId, commitId)
                                 .then(function (data) {
                                     return new commitModel(data.commitId, data.committer.date, utils.dateToText(data.committer.date), data.comment);
                                 });
            },
            this.getReviewers = function (repositoryId, pullRequestId) {
                return tfs.getReviewers(repositoryId, pullRequestId).then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new reviewerModel(item.displayName, item.id, item.vote, item.uniqueName);
                    });

                });
            },
            this.getIssue = function (str) {
                return jira.getIssue(str).then(function (item) {
                    return new issueModel(item.fields.priority.name, item.fields.priority.iconUrl, services.jira + "/browse/" + str, item.fields.status.name, item.fields.issuetype.name, item.fields.issuetype.iconUrl);
                    });
            }
        }
    }
);
