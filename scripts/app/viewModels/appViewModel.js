define(["jquery", "ko", "./repositoryViewModel"], function ($, ko, repositoryViewModel) {
    return function (client) {
        var self = this;
        this.listOfRepositories = ko.observableArray();
        this.sort = function () {
            self.listOfRepositories.sort(function (left, right) {
                return left.name() == right.name() ? 0 : (left.name() < right.name() ? -1 : 1);
            });
        };

        client.getRepositories().done(function (items) {
            self.listOfRepositories.removeAll();
            $.each(items, function () {
                self.listOfRepositories.push(new repositoryViewModel(this, client));
            });

            self.sort();
        });
    };
});

