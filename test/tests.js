define(["app/viewModels/reviewerViewModel", "qunit"], function (reviewerViewModel) {
    $(function () {
        var a = new reviewerViewModel({
            displayName: null,
            vote:0
        });
        test("Test", function() {
            ok(a.titleVote, "No vote");
        });
    });
});