define(["jquery"], function ($) {
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
                return $.getJSON(commands.repositories);
            },
            getPullRequests: function (repositoryId) {
                return $.getJSON(commands.pullRequests(repositoryId));
            },
            getCommit: function (repositoryId, commitId) {
                return $.getJSON(commands.commit(repositoryId, commitId));
            },
            getCommits: function (sourceRefName, targetRefName, repositoryId) {
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
                return $.post(commands.commits(repositoryId), between);
            },
            getReviewers: function (repositoryId, pullRequestId) {
                return $.getJSON(commands.reviewers(repositoryId, pullRequestId));
            }
        }
    };
});
