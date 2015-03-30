define(["app/viewModels/pullRequestViewModel","ko"], function (pullRequestViewModel,ko) {
    var run = function () {

        var pullRequestModel = {
            pullRequestId: null,
            status: null,
            title: null,
            createdByDisplayName: null,
            creationDate: null,
            sourceRefName: null,
            description: null,
            url: null,
            mergeStatus: null,
            lastMergeSourceCommitId: null,
            repositoryName: null,
            repositoryUrl: null,
            commits: ko.observableArray(),
            reviewers: null

        };

        var data = [
            [
                {
                    displayName: null,
                    vote: -10,
                    titleVote: "No"
                }
            ],
            [
                {
                    displayName: null,
                    vote: -10,
                    titleVote: "No"
                },
                {
                    displayName: null,
                    vote: 0,
                    titleVote: "No vote"
                }
            ],
            [
                {
                    displayName: null,
                    vote: -10,
                    titleVote: "No"
                },
                {
                    displayName: null,
                    vote: 10,
                    titleVote: "Yes"
                }
            ]

        ];
        test("Test pullRequestViewModell", function () {
            data.forEach(function(item) {
                pullRequestModel.reviewers = ko.observableArray(item);

                var pullRequest = new pullRequestViewModel(pullRequestModel);

                ok(pullRequest.titleMinVote() == "No", "Status: 'No'");
            });
            


        });
    }
    return { run: run };
});