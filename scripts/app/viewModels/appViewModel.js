define(["jquery", "ko"],
    function ($, ko) {
        return function () {

            var self = this;

            this.userId = user.id;
            this.userName = user.name;

            this.collection = ko.observableArray();

            ///TODO: Переделать, чтобы заголовки брать из self.collection
            this.menuHeaders = ko.observableArray([
                { title: "Pull Requests", active: ko.observable(true) }
            ]);

            this.setActiveMenu = function (header) {
                self.menuHeaders().forEach(function (item) {
                    item.active(false);
                });
                header.active(true);
            };
        };
    });

