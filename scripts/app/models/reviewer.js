define([], function () {
    return function (displayName, vote) {
        return {
            displayName: displayName,
            vote: vote
        };
    };
});