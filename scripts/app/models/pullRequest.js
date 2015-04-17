define([], function () {
    return function (id, status, title, url, createdByDisplayName, createdById, createdByLogin, lastMergeSourceCommitId,
        creationDate, sourceRefName, targetRefName, mergeStatus, description, repositoryName, repositoryUrl, repositoryId) {
        return {
            pullRequestId: id,
            status: status,
            title: title,
            url: url,
            createdById: createdById,
            lastMergeSourceCommitId: lastMergeSourceCommitId,
            sourceRefName: sourceRefName,
            targetRefName: targetRefName,
            mergeStatus: mergeStatus,
            description: description,
            repositoryUrl: repositoryUrl,
            repositoryId: repositoryId,
            creationDate: creationDate,
            createdByLogin: createdByLogin,
            createdByDisplayName: createdByDisplayName,
            repositoryName: repositoryName
        }
    };
});