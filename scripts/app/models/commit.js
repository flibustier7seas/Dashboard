define([], function () {
    return function (commitId, pushDate, pushDateToText, comment) {
        return {
            commitId: commitId,
            pushDate: pushDate,
            pushDateToText: pushDateToText,
            comment: comment
        };
    };
});