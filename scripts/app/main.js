define(["jquery", "ko", "./viewModels/appViewModel", "./factory", "./viewModels/pullRequestsViewModel", "./viewModels/pullRequestViewModel",
 "./server/jiraсmds", "./server/teamСityсmds", "./server/tfsсmds", "./viewLoader"],
    function ($, ko, appViewModel, factory, pullRequestsViewModel, pullRequestViewModel, jiracmds, teamСityсmds, tfscmds, viewLoader) {
        $(function () {

            var jira = new jiracmds(services.jira);
            var tc = new teamСityсmds(services.teamcity);
            var tfs = new tfscmds(services.tfs);

            var pullRequestsItem = {
                data: new pullRequestsViewModel(),
                viewName: "pullRequestsView",
                isLoaded: ko.observable(false)
            };

            var f = new factory(jira, tc, tfs);

            f.getRepositories().then(function (repositories) {
                repositories.forEach(function (repository) {
                    f.getPullRequests(repository).then(function (items) {
                        items.forEach(function (item) {
                            var pullRequest = new pullRequestViewModel(item);
                            pullRequestsItem.data.add(pullRequest);
                        });

                    });
                });
            });
            
            viewLoader.loadView("pullRequestsView", function () {
                pullRequestsItem.isLoaded(true);
            });

            var app = new appViewModel();
            app.collection.push(pullRequestsItem);
            ko.applyBindings(app);
        });
    });
