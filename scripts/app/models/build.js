define([], function () {
    return function (buildTypeId, state, status, webUrl, statusText, startDate, time) {
        return {
            buildTypeId: buildTypeId,
            state: state,
            status: status,
            webUrl: webUrl,
            statusText: statusText,
            startDate: startDate,
            time: time
        };
    };
});