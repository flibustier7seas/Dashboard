define(["./models/build", "./models/commit", "./utils"], function (buildModel, commitModel, utils) {
    return function (tfs,tc) {
        this.getBuildsId = function (branchName) {
            return tc.getBuilds(branchName)
                .then(function (data) {
                    return $.map(data.build || [], function (item) {
                        return item.id;
                    });
                });
        }
        this.getBuild = function(buildId) {
            return tc.getBuild(buildId).then(function (obj) {
                return new buildModel(
                    obj.buildTypeId,
                    obj.state,
                    obj.status,
                    obj.webUrl,
                    obj.statusText,
                    utils.dateToTextTC(obj.startDate),
                    utils.timeDifference(obj.startDate, obj.finishDate)
                    );
            });
        },
        this.getCommits = function (sourceRefName, targetRefName, repositoryId) {
            console.log("getCommits: " + sourceRefName);
            return tfs.getCommits(sourceRefName, targetRefName, repositoryId)
                    .then(function (data) {
                        return $.map(data.value || [], function(item) {
                            return new commitModel(item.commitId, item.committer.date, utils.dateToText(item.committer.date), item.comment);
                        });
            });
        }
    }
}
);
