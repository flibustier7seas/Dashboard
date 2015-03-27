define(["app/viewModels/pullRequestViewModel"], function (pullRequestViewModel) {
    var run = function () {

        var self = this;

        this.pullRequest = {
            pullRequestId: null,
            status: null,
            title: null,
            createdByDisplayName: null,
            creationDate: null,
            sourceRefName: null,
            description: null,
            url: null,
            mergeStatus: null,
            lastMergeSourceCommitId: null
        };

        this.repository = {
            name: function () { },
            url: function () { },
            id: function () { }
        };

        this.reviewers = [
            { displayName: null, vote: -10 },
            { displayName: null, vote: 0 }
        ];

        this.client = {
            getCommit: function () {
                return {
                    done: function () { return null; }
                }
            },
            getReviewers: function () {
                return {
                    done: function (callback) {
                        return callback(self.reviewers);
                    }
                }
            },
        };

        var item = new pullRequestViewModel(self.pullRequest, self.repository, self.client);

        test("Test pullRequestViewModell", function () {
            ok(item.titleMinVote() == "No", "vote:-10,0;Status: 'No'");
        });
    }
    return { run: run };
});