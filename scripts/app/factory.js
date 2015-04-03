define(["jquery", "ko", "./utils", "./models/pullRequest", "./models/commit", "./models/reviewer", "./models/build"],
    function ($, ko, utils, pullRequestModel, commit, reviewer, build) {
        var issueReg = new RegExp("[A-Z]+-\\d+", "i");
        return function (client) {
            this.getRepositories = function () {
                return client.getRepositories();
            };
            this.getPullRequests = function (repository) {
                return client.getPullRequests(repository.id)
                    .then(
                    function (items) {
                        return $.map(items.value || [], function (item) {

                            var pullRequest = new pullRequestModel(
                                item.pullRequestId,
                                item.status,
                                item.title,
                                API_PULLREQUEST + '/' + item.pullRequestId,
                                item.createdBy.displayName,
                                item.createdBy.id,
                                item.lastMergeSourceCommit.commitId,
                                item.creationDate,
                                item.sourceRefName.replace("refs/heads/", ""),
                                item.targetRefName.replace("refs/heads/", ""),
                                item.mergeStatus,
                                item.description,
                                repository.name,
                                repository.url
                            );

                            client.getBuilds(pullRequest.sourceRefName).then(function (data) {
                                if (data.count > 0) {
                                    data.build.forEach(function (bld) {

                                        client.getBuild(bld.href).then(function (obj) {
                                            pullRequest.builds.push(new build(
                                                obj.buildTypeId,
                                                obj.state,
                                                obj.status,
                                                obj.webUrl,
                                                obj.statusText,
                                                utils.dateToTextTC(obj.startDate),
                                                utils.timeDifference(obj.startDate, obj.finishDate)
                                                ));
                                        });
                                    });
                                }
                            });

                            var issueArraySource = issueReg.exec(item.sourceRefName);
                            var issueArrayTarget = issueReg.exec(item.targetRefName);
                            var issueArray = issueArraySource || issueArrayTarget;
                            if (issueArray) {
                                issueArray.forEach(function (str) {
                                    client.getIssue(str)
                                        .then(function (data) {
                                            pullRequest.priorityName(data.fields.priority.name);
                                            pullRequest.issueUrl(JIRAURL + BROWSEURL + str);
                                            pullRequest.statusName(data.fields.status.name);
                                            pullRequest.issueTypeName(data.fields.issuetype.name);
                                        });
                                });
                            };

                            client.getCommits(pullRequest.sourceRefName, pullRequest.targetRefName, item.repository.id)
                                .then(function (data) {
                                    data.value.forEach(function (cmt) {
                                        pullRequest.addCommit(new commit(cmt.commitId, cmt.committer.date, cmt.comment));
                                    });
                                });

                            client.getReviewers(item.repository.id, item.pullRequestId)
                                .then(function (data) {
                                    data.value.forEach(function (rvw) {
                                        pullRequest.addReviewer(new reviewer(rvw.displayName, rvw.id, rvw.vote));
                                    });

                                });

                            return pullRequest;
                        });
                    });
            }
        };
    });

