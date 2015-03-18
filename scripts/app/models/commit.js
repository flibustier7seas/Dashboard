define([], function () {
    return function (commitId, pushDate) {
        return {
            displayNamecommitId: commitId,
            pushDate: pushDate
        };
    };
});