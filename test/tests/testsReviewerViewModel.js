define(["app/viewModels/reviewerViewModel"], function (reviewerViewModel) {
    var run = function () {
        var a = new reviewerViewModel({
            displayName: null,
            vote:0
        });
        test("Test reviewerViewModel", function () {
            ok(a.titleVote() == "No vote","vote:0;Status: 'No vote'");
        });
    }
    return { run: run };
});