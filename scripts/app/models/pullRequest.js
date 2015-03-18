define([], function () {
    return function (id, status, title, url, createdByDisplayName, lastMergeSourceCommitId) {
        return {
            pullRequestId: id,
            status: status,
            title: title,
            url: url,
            createdByDisplayName: createdByDisplayName,
            lastMergeSourceCommitId: lastMergeSourceCommitId
        };
    };
});
