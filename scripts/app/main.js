define(["jquery", "ko","./viewModels/appViewModel", "./factory", "./viewModels/pullRequestsViewModel", "./viewModels/pullRequestViewModel",
 "./server/jiraсmds", "./server/teamСityсmds", "./server/tfsсmds"],
    function ($, ko, appViewModel, factory, pullRequestsViewModel, pullRequestViewModel,jiracmds,teamСityсmds,tfscmds) {
        $(function () {

            var jira = new jiracmds(services.jira);

            var tc = new teamСityсmds(services.teamcity);

            var tfs = new tfscmds(services.tfs);

            var pullRequests = new pullRequestsViewModel();

            var f = new factory(jira,tc,tfs);

            f.getRepositories().then(function (repositories) {
                repositories.forEach(function (repository) {
                    f.getPullRequests(repository).then(function (items) {
                        items.forEach(function (item) {
                           var pullRequest = new pullRequestViewModel(item);
                           pullRequests.add(pullRequest);
                        });

                    });
                });
            });

            ko.applyBindings(new appViewModel(pullRequests));
        });
    });
