define(["jquery", "ko"], function ($, ko) {
    return function (repository) {
        this.id = ko.observable(repository.id);
        this.name = ko.observable(repository.name);
        this.url = ko.observable(repository.url);
        this.projectName = ko.observable(repository.projectName);
        this.defaultBranch = ko.observable(repository.defaultBranch || "");
    };
});


