define(["jquery", "./models/repository"], function ($, repository) {
    return function (url) {
        var requestUrl = url + API_REPOSITORIES;
        return {
            getRepositories: function () {
                return $.getJSON(requestUrl).then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new repository(
                            item.id,
                            item.name,
                            item.remoteUrl,
                            item.project.name,
                            item.defaultBranch
                        );
                    });
                });
            },
            getPullRequests: function (repositoryId) {
                return $.getJSON(requestUrl + '/' + repositoryId + API_PULLREQUESTS);
            },
            getCommits: function (sourceRefName, targetRefName,repositoryId) {
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
                return $.post(requestUrl + "/" + repositoryId + API_COMMITSBATCH, between);
            },
            getReviewers: function (repositoryId, pullRequestId) {
                return $.getJSON(requestUrl + '/' + repositoryId + API_PULLREQUESTS + '/' + pullRequestId + API_REVIEWERS);
            },
            getIssue: function(issueName) {
                return $.getJSON(JIRAURL + API_ISSUE + issueName);
            },
            getBuilds: function (branchName) {
                return $.getJSON(TEAMCITY + API_BUILDS + branchName);
            },
            getBuild: function (url) {
                return $.getJSON(TEAMCITY + url);
            }
        }
    };
});
