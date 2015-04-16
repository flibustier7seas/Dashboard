define(["jquery", "ko", "./utils", "./models/pullRequest", "./models/commit", "./models/reviewer", "./models/build", "./models/repository", "./service"],
    function ($, ko, utils, pullRequestModel, commit, reviewer, build, repository, service) {

        var issueReg = new RegExp("[A-Z]+-\\d{4}", "i");

        return function (jira, tc, tfs) {

            this.getRepositories = function () {
                return tfs.getRepositories().then(function (data) {
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
            };

            this.getPullRequests = function (repos) {
                return tfs.getPullRequests(repos.id).then(
                    function (items) {
                        return $.map(items.value || [], function (item) {

                            var pullRequest = new pullRequestModel(
                                item.pullRequestId,
                                item.status,
                                item.title,
                                repos.url + "/pullrequest/" + item.pullRequestId,
                                item.createdBy.displayName,
                                item.createdBy.id,
                                item.createdBy.uniqueName,
                                item.lastMergeSourceCommit.commitId,
                                item.creationDate,
                                item.sourceRefName.replace("refs/heads/", ""),
                                item.targetRefName.replace("refs/heads/", ""),
                                item.mergeStatus,
                                item.description,
                                repos.name,
                                repos.url,
                                repos.id,
                                new service(tfs, tc)
                            );

                            tfs.getCommit(repos.id, item.lastMergeSourceCommit.commitId)
                                .then(function (data) {
                                    pullRequest.update(data.committer.date);
                                    pullRequest.updateToText(utils.dateToText(data.committer.date));
                                });
                        
                            tfs.getReviewers(item.repository.id, item.pullRequestId)
                                .then(function (data) {
                                 data.value.forEach(function (rvw) {
                                     pullRequest.addReviewer(new reviewer(rvw.displayName, rvw.id, rvw.vote, rvw.uniqueName));
                                 });

                             });

                            var issueArray = issueReg.exec(item.sourceRefName) || issueReg.exec(item.targetRefName);
                            if (issueArray) {
                                issueArray.forEach(function (str) {
                                    jira.getIssue(str)
                                        .then(function (data) {
                                            pullRequest.priorityName(data.fields.priority.name);
                                            pullRequest.priorityIconUrl(data.fields.priority.iconUrl);
                                            pullRequest.issueUrl(services.jira + "/browse/" + str);
                                            pullRequest.statusName(data.fields.status.name);
                                            pullRequest.issueTypeName(data.fields.issuetype.name);
                                            pullRequest.issueTypeIconUrl(data.fields.issuetype.iconUrl);
                                        });
                                });
                            };
                            return pullRequest;
                        });
                    });
            }
        };
    });