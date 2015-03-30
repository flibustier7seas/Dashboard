define(["jquery", "ko", "./server", "./viewModels/appViewModel", "./factory", "./viewModels/listOfPullRequestViewModel", "./viewModels/pullRequestViewModel"],
    function ($, ko, server, appViewModel, factory, listOfPullRequestViewModel, pullRequestViewModel) {
        $(function () {

            var client = new server(settings.mainUrl);

            var pullRequests = new listOfPullRequestViewModel();

            var f = new factory(client);

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
