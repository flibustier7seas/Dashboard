define([], function() {
    return function (id, name, url, projectName, defaultBranch) {
        return {
            id: id,
            name: name,
            url: url,
            projectName: projectName,
            defaultBranch: defaultBranch
        };
    };
});
