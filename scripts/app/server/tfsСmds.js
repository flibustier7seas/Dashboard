define(["jquery", "../utils", "../models/commit", "../models/reviewer", "../models/pullRequest", "../models/repository"],
    function ($, utils, commitModel, reviewerModel, pullRequestModel, repositoryModel) {
        return function (tfsUrl) {

            var commands = {
                repositories: tfsUrl + "/DefaultCollection/_apis/git/repositories",
                repository: function (repositoryId) {
                    return this.repositories + "/" + repositoryId;
                },
                pullRequests: function (repositoryId) {
                    return this.repository(repositoryId) + "/pullRequests";
                },
                pullRequest: function (repositoryId, pullRequestId) {
                    return this.repository(repositoryId) + "/pullRequests/" + pullRequestId;
                },
                commit: function (repositoryId, commitId) {
                    return this.repository(repositoryId) + "/commits/" + commitId;
                },
                commits: function (repositoryId) {
                    return this.repository(repositoryId) + "/commitsBatch?$top=10";
                },
                reviewers: function (repositoryId, pullRequestId) {
                    return this.pullRequest(repositoryId, pullRequestId) + "/reviewers";
                }
            };

            return {
                getRepositories: function () {
                    return $.getJSON(commands.repositories).then(function (data) {
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
                getPullRequests: function (repository) {
                    return $.getJSON(commands.pullRequests(repository.id)).then(
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
                getCommit: function (repositoryId, commitId) {
                    return $.getJSON(commands.commit(repositoryId, commitId)).then(function (item) {
                        return new commitModel(item.commitId, item.committer.date, utils.dateToText(item.committer.date), item.comment);
                    });
                },
                getCommits: function (sourceRefName, targetRefName, repositoryId) {
                    console.log("getCommits: " + sourceRefName);
                    var between = {
                        "itemVersion": {
                            "versionType": "branch",
                            "version": targetRefName
                        },
                        "compareVersion": {
                            "versionType": "branch",
                            "version": sourceRefName
                        }
                    }
                    return $.post(commands.commits(repositoryId), between).then(function (data) {
                        return $.map(data.value || [], function (item) {
                            return new commitModel(item.commitId, item.committer.date, utils.dateToText(item.committer.date), item.comment);
                        });
                    });
                },
                getReviewers: function (repositoryId, pullRequestId) {
                    return $.getJSON(commands.reviewers(repositoryId, pullRequestId)).then(function (data) {
                        return $.map(data.value || [], function (item) {
                            return new reviewerModel(item.displayName, item.id, item.vote, item.uniqueName);
                        });
                    });
                }
            }
        }
    });

