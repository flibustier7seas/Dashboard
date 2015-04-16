define(["jquery", "ko", "./viewModels/appViewModel", "./factory", "./viewModels/pullRequestsViewModel", "./viewModels/statisticsViewModel", "./models/pullRequests",
 "./server/jiraсmds", "./server/teamСityсmds", "./server/tfsсmds", "./viewLoader","jsapi"],
    function ($, ko, appViewModel, factory, pullRequestsViewModel, statisticsViewModel, pullRequestsModel, jiracmds, teamСityсmds, tfscmds, viewLoader) {
        $(function () {

            var jira = new jiracmds(services.jira);
            var tc = new teamСityсmds(services.teamcity);
            var tfs = new tfscmds(services.tfs);

            var pullRequests = new pullRequestsModel();

            var pullRequestsItem = {
                data: new pullRequestsViewModel(pullRequests),
                viewName: "pullRequestsView",
                title: "Pull requests",
                isLoaded: ko.observable(false),
                active: ko.observable(true)
            };

            var statisticsItem = {
                data: new statisticsViewModel(pullRequests),
                viewName: "statisticsView",
                title: "Statistics",
                isLoaded: ko.observable(false),
                active: ko.observable(false)
            };

            var f = new factory(jira, tc, tfs);

            f.getRepositories().then(function (repositories) {
                repositories.forEach(function (repository) {
                    f.getPullRequests(repository).then(function (items) {
                        items.forEach(function (item) {
                            pullRequests.add(item);
                        });

                    });
                });
            });
            
            var app = new appViewModel();

            viewLoader.loadView("pullRequestsView", function () {
                pullRequestsItem.isLoaded(true);
                app.addItem(pullRequestsItem, "Pull Requests");
            });

            viewLoader.loadView("statisticsView", function () {
                statisticsItem.isLoaded(true);
                ///NOTE: Возможно лучше вынести статистику в отдельное окно.
                pullRequestsItem.data.statisticsViewModel(statisticsItem);
                //app.addItem(statisticsItem, "Statistics");
            });

            ko.applyBindings(app);
            statisticsItem.isLoaded(true);
        });
    });

