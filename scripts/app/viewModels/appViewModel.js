define(["jquery", "ko"],
    function ($, ko) {
        return function () {

            var self = this;

            this.userId = user.id;
            this.userName = user.login;

            this.collection = ko.observableArray();
            this.headerActive = null;

            this.addItem = function (item) {
                self.collection.push(item);

                if (!self.headerActive && item.active()) {
                    self.headerActive = item;
                };
            };

            this.setActiveMenu = function (header) {
                self.headerActive.active(false);
                header.active(true);
                self.headerActive = header;
            };
        };
    });

