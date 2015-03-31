define(["app/viewModels/pullRequestViewModel","ko"], function (pullRequestViewModel,ko) {
    describe("Tests pullRequestViewModel", function () {

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
            commits: ko.observableArray()
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

        data.forEach(function (item) {
            pullRequestModel.reviewers = ko.observableArray(item);

            var pullRequest = new pullRequestViewModel(pullRequestModel);

            it("Status: 'No'", function () {
                expect(pullRequest.titleMinVote()).toBe("No");
            });
        });

    });
});