define([], function () {
    return function (commitId, pushDate) {
        return {
            commitId: commitId,
            pushDate: pushDate
        };
    };
});