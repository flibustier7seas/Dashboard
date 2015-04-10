define(["jquery", "ko", "./utils", "./models/pullRequest", "./models/commit", "./models/reviewer", "./models/build", "./models/repository"],
    function ($, ko, utils, pullRequestModel, commit, reviewer, build, repository) {
        var issueReg = new RegExp("[A-Z]+-\\d{4}", "i");
        return function (client) {
            this.getRepositories = function () {
                return client.getRepositories().then(function (data) {
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
                return client.getPullRequests(repos.id)
                    .then(
                    function (items) {
                        return $.map(items.value || [], function (item) {

                            var pullRequest = new pullRequestModel(
                                item.pullRequestId,
                                item.status,
                                item.title,
                                item.pullRequestId,
                                item.createdBy.displayName,
                                item.createdBy.id,
                                item.lastMergeSourceCommit.commitId,
                                item.creationDate,
                                item.sourceRefName.replace("refs/heads/", ""),
                                item.targetRefName.replace("refs/heads/", ""),
                                item.mergeStatus,
                                item.description,
                                repos.name,
                                repos.url
                            );

                            client.getBuilds(pullRequest.sourceRefName).then(function (data) {
                                if (data.count > 0) {
                                    data.build.forEach(function (bld) {

                                        client.getBuild(bld.id).then(function (obj) {
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
                                            pullRequest.issueUrl(str);
                                            pullRequest.statusName(data.fields.status.name);
                                            pullRequest.issueTypeName(data.fields.issuetype.name);
                                        });
                                });
                            };

                            client.getCommits(pullRequest.sourceRefName, pullRequest.targetRefName, item.repository.id)
                                .then(function (data) {
                                    data.value.forEach(function (cmt) {
                                        pullRequest.addCommit(new commit(cmt.commitId, utils.dateToText(cmt.committer.date), cmt.comment));
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

