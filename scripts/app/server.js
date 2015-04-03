define(["jquery"], function ($) {
    return function (url) {
        var requestUrl = url + API_REPOSITORIES;
        return {
            //TODO: вынести создание модели
            getRepositories: function () {
                return $.getJSON(requestUrl);
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
                return $.getJSON(JIRAURL + API_ISSUE + issueName).error(function (data) {
                    if (data.status == 401) {
                        console.log("Необходимо авторизоваться в jira");
                    };
                });
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
