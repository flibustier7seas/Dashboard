define(["jquery", "ko", "./server", "./viewModels/appViewModel", "./factory", "./viewModels/pullRequestsViewModel", "./viewModels/pullRequestViewModel"],
    function ($, ko, server, appViewModel, factory, pullRequestsViewModel, pullRequestViewModel) {
        $(function () {

            var client = new server(services);

            var pullRequests = new pullRequestsViewModel();

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
