define([], function () {
    return function (id, status, title, url, createdByDisplayName, lastMergeSourceCommitId, creationDate,sourceRefName, mergeStatus, description) {
        return {
            pullRequestId: id,
            status: status,
            title: title,
            url: url,
            createdByDisplayName: createdByDisplayName,
            lastMergeSourceCommitId: lastMergeSourceCommitId,
            creationDate: creationDate,
            sourceRefName: sourceRefName,
            mergeStatus: mergeStatus,
            description: description
        };
    };
});
