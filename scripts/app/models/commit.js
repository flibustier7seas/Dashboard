define([], function () {
    return function (commitId, pushDate, comment) {
        return {
            commitId: commitId,
            pushDate: pushDate,
            comment: comment
        };
    };
});