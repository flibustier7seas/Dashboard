define(["jquery", "ko"], function ($, ko) {
    return function (repository) {
        this.id = ko.observable(repository.id);
        this.name = ko.observable(repository.name);
        this.url = ko.observable(repository.url);
    };
});


