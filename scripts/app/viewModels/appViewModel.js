define(["jquery", "ko"],
    function ($, ko) {
        return function () {

            var self = this;

            this.userId = user.id;
            this.userName = user.login;

            this.collection = ko.observableArray();
            this.headerActive = null;

            this.addItem = function(item, title) {
                var header = {
                    title: title,
                    active: ko.observable(false),
                    obj: item
                };

                self.collection.push(header);

                if (!self.headerActive) {
                    self.headerActive = header;
                    self.headerActive.active(true);
                };
            };

            this.setActiveMenu = function (header) {
                self.headerActive.active(false);
                header.active(true);
            };
        };
    });

