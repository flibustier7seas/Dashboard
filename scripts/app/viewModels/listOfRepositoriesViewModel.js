define(["jquery", "ko"], function ($, ko) {
    return function () {

        var self = this;

        this.list = ko.observableArray();

        this.add = function (item) {
            self.list.push(item);
        };

        this.headers = [
            { title: 'id', sortPropertyName: 'id', asc: true, active: false },
            { title: 'name', sortPropertyName: 'name', asc: true, active: false },
            { title: 'projectName', sortPropertyName: 'projectName', asc: true, active: false },
            { title: 'defaultBranch', sortPropertyName: 'defaultBranch', asc: true, active: false }
        ];


    };
});

