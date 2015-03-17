define(["jquery", "./models/repository", "./models/pullRequest"], function($, repository, pullRequest) {
    var API_REPOSITORIES = "/_apis/git/repositories";
    var API_PULLREQUESTS = "/pullRequests";
    var API_PULLREQUEST = "/pullRequest";

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
                return $.getJSON(requestUrl + '/' + repositoryId + API_PULLREQUESTS).then(function (data) {
                    return $.map(data.value || [], function (item) {
                        return new pullRequest(
                            item.pullRequestId,
                            item.status,
                            item.title,
                            API_PULLREQUEST + '/' + item.pullRequestId,
                            item.createdBy.displayName
                        );
                    });
                });
            }
        }
    };
});
