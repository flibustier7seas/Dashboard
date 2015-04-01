define(["app/viewModels/pullRequestViewModel", "ko"], function (pullRequestViewModel, ko) {

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

    describe("Tests pullRequestViewModel", function () {
        var pullRequest;
        data.forEach(function (item) {
            pullRequestModel.reviewers = ko.observableArray(item);

            pullRequest = new pullRequestViewModel(pullRequestModel);

            it("Status: 'No'", function () {
                expect(pullRequest.titleMinVote()).toBe("No");
            });
        });
    });

    describe("Tests  pullRequestViewModel 'minVote' called", function () {

        var pullRequest;
        var item;
        beforeEach(function() {
            pullRequestModel.reviewers = ko.observableArray(data[2]);
            pullRequest = new pullRequestViewModel(pullRequestModel);

            item = spyOn(pullRequest, "minVote");

            ///NOTE: После добавления ревьювера, вызывается minVote,т.к. minVote зависит от reviewers

            pullRequest.reviewers.push(data[0]);
            //pullRequest.minVote();
            //pullRequest.test();
        });


        it("'minVote' called", function () {
            expect(item).toHaveBeenCalled();
        });
    });
});