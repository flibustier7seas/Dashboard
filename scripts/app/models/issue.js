define([], function () {
    return function (priorityName, priorityIconUrl, issueUrl, statusName, issueTypeName, issueTypeIconUrl) {
        return {
            priorityName: priorityName,
            priorityIconUrl: priorityIconUrl,
            issueUrl: issueUrl,
            statusName: statusName,
            issueTypeName: issueTypeName,
            issueTypeIconUrl: issueTypeIconUrl
        };
    };
});