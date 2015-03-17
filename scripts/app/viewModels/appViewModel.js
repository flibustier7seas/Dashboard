define(["jquery", "ko", "./repositoryViewModel"], function ($, ko, repositoryViewModel) {
    return function (client) {
        var self = this;

        this.headers = [
            { title: 'Repository', sortPropertyName: 'firstName', asc: true, active: false },
            { title: 'Author', sortPropertyName: 'lastName', asc: true, active: false },
            { title: 'Title', sortPropertyName: 'age', asc: true, active: false },
            { title: 'Updated', sortPropertyName: 'age', asc: true, active: false }
        ];

        this.filters = [
            { title: 'Show All', filter: null },
            { title: 'Only erm', filter: function (item) { return item.name() == 'erm'; } },
            { title: 'Only auto - tests', filter: function (item) { return item.name() == 'auto-tests'; } }
        ];

        this.activeFilter = ko.observable(self.filters[0].filter);

        this.setActiveFilter = function (model) {
            self.activeFilter(model.filter);
        };

        this.listOfRepositories = ko.observableArray();

        this.filteredListOfRepositories = ko.computed(function () {
            var result;
            if (self.activeFilter()) {
                result = ko.utils.arrayFilter(self.listOfRepositories(), self.activeFilter());
            } else {
                result = self.listOfRepositories();
            }
            return result;
        });

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

