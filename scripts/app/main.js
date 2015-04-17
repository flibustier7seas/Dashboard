define(["jquery", "ko", "./viewModels/appViewModel", "./viewModels/pullRequestsViewModel", "./viewModels/statisticsViewModel",
    "./server/jiraсmds", "./server/teamСityсmds", "./server/tfsсmds", "./viewLoader", "moment", "./factory"],
    function ($, ko, appViewModel, pullRequestsViewModel, statisticsViewModel,  jiracmds, teamСityсmds, tfscmds, viewLoader, moment, factory) {
        $(function () {

            moment.locale(window.navigator.language);

            var app = new appViewModel();

            var jira = new jiracmds(services.jira);
            var tc = new teamСityсmds(services.teamcity);
            var tfs = new tfscmds(services.tfs);

            var f = new factory(tfs, tc, jira);

            var pullRequestsItem = {
                data: null,
                viewName: "pullRequestsView",
                title: "Pull requests",
                isLoaded: ko.observable(false),
                active: ko.observable(true)
            };

            tfs.getRepositories().then(function(data) {
                pullRequestsItem.data = new pullRequestsViewModel(data, f);
                viewLoader.loadView("pullRequestsView", function () {
                    pullRequestsItem.isLoaded(true);
                    app.addItem(pullRequestsItem, "Pull Requests");
                });
            });

            ko.applyBindings(app);
        });
    });

//var statisticsItem = {
//    data: new statisticsViewModel(pullRequests),
//    viewName: "statisticsView",
//    title: "Statistics",
//    isLoaded: ko.observable(false),
//    active: ko.observable(false)
//};

//viewLoader.loadView("statisticsView", function () {
//    statisticsItem.isLoaded(true);
//    //pullRequestsItem.data.statisticsViewModel(statisticsItem);
//    app.addItem(statisticsItem, "Statistics");
//});
