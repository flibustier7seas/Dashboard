define(["jquery", "ko", "./utils", "./models/pullRequest", "./models/commit", "./models/reviewer", "./models/build", "./models/repository","./viewModels/pullRequestViewModel"],
    function ($, ko, utils, pullRequestModel, commit, reviewerModel, build, repositoryModel, pullRequestViewModel) {

        var issueReg = new RegExp("[A-Z]+-\\d{4}", "i");

        return function (tfs, tc, jira) {

            this.getPullRequests = function (repository) {

                return tfs.getPullRequests(repository).then(function (items) {

                    return $.map(items || [], function (item) {

                        var pullRequest = new pullRequestViewModel(item, tfs, tc);
                        
                        tfs.getCommit(item.repositoryId, item.lastMergeSourceCommitId)
                            .then(function (data) {
                                pullRequest.update(data.pushDate);
                                pullRequest.updateToText(data.pushDateToText);
                            });

                        tfs.getReviewers(item.repositoryId, item.pullRequestId)
                            .then(function (data) {
                                ko.utils.arrayPushAll(pullRequest.reviewers, data);
                            });

                        var issueArray = issueReg.exec(item.sourceRefName) || issueReg.exec(item.targetRefName);
                        if (issueArray) {
                            jira.getIssue(issueArray.shift())
                                    .then(function (data) {
                                        pullRequest.priorityName(data.priorityName);
                                        pullRequest.priorityIconUrl(data.priorityIconUrl);
                                        pullRequest.issueUrl(data.issueUrl);
                                        pullRequest.statusName(data.statusName);
                                        pullRequest.issueTypeName(data.issueTypeName);
                                        pullRequest.issueTypeIconUrl(data.issueTypeIconUrl);
                                    });
                        };

                        return pullRequest;
                    });
                });
            }
        };
    });