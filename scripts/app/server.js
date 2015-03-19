define(["jquery", "./models/repository", "./models/pullRequest", "./models/commit", "./models/reviewer"], function ($, repository, pullRequest, commit, reviewer) {
    var API_REPOSITORIES = "/_apis/git/repositories";
    var API_PULLREQUESTS = "/pullRequests";
    var API_PULLREQUEST = "/pullRequest";
    var API_COMMITS = "/commits";
    var API_REVIEWERS = "/reviewers";

    return function (url) {
        var requestUrl = url + API_REPOSITORIES;
        return {
            getRepositories: function () {
                return $.getJSON(requestUrl).then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new repository(
                            item.id,
                            item.name,
                            item.remoteUrl
                        );
                    });
                });
            },
            getPullRequests: function (repositoryId) {
                console.log(requestUrl + '/' + repositoryId + API_PULLREQUESTS);
                return $.getJSON(requestUrl + '/' + repositoryId + API_PULLREQUESTS).then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new pullRequest(
                            item.pullRequestId,
                            item.status,
                            item.title,
                            API_PULLREQUEST + '/' + item.pullRequestId,
                            item.createdBy.displayName,
                            item.lastMergeSourceCommit.commitId,
                            item.creationDate,
                            item.sourceRefName,
                            item.mergeStatus,
                            item.description
                        );
                    });
                });
            },

            getCommit: function (repositoryId,commitId) {
                return $.getJSON(requestUrl + '/' + repositoryId + API_COMMITS +'/'+ commitId).then(function (data) {
                    return new commit(
                           data.commitId,
                           data.push.date
                        );
                });
            },
            getReviewers: function (repositoryId, pullRequestId) {
                return $.getJSON(requestUrl + '/' + repositoryId + API_PULLREQUESTS + '/' + pullRequestId + API_REVIEWERS).then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new reviewer(
                               item.displayName,
                               item.vote
                            );
                    });

                });
            }
        }
    };
});
