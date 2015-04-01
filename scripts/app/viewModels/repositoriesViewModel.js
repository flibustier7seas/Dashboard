///TODO: Если выводить репозитории не нужно, то можно удалять. Сейчас не используется.
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
//------------------------View---------------------------------
//<div class="row" data-bind="visible: menuHeaders()[1].active">


//    <table class="table table-hover table-bordered" data-bind="with: listOfRepositories">
//        <thead>
//            <tr class="text-info" data-bind="foreach: headers">
//                <th>
//                    <span data-bind="text: title"></span>
//                    <span class="glyphicon glyphicon-arrow-up" data-bind="click: function (data) { $root.sort(data, true, $parent.list) }"></span>
//                    <span class="glyphicon glyphicon-arrow-down" data-bind="click: function (data) { $root.sort(data, false, $parent.list) }"></span>
//                </th>

//            </tr>
//        </thead>
//        <tbody data-bind="foreach: list">
//            <tr class="text-left">
//                <td class="col-md-4"><a data-bind="text: id"></a></td>
//                <td class="col-md-3" data-bind="text: name"></td>
//                <td class="col-md-2"><a data-bind="text: projectName"></a></td>
//                <td class="col-md-3" data-bind="text: defaultBranch"></td>
//            </tr>
//        </tbody>
//    </table>

//</div>

