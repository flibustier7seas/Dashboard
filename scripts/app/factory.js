define(["jquery", "ko", "./models/pullRequest", "./models/commit", "./models/reviewer"],
    function ($, ko, pullRequestModel, commit, reviewer) {
        return function (client) {
            this.getRepositories = function() {
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
                                item.sourceRefName,
                                item.mergeStatus,
                                item.description,
                                repository.name,
                                repository.url
                            );

                            client.getCommits(item.sourceRefName, item.targetRefName, item.repository.id)
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

