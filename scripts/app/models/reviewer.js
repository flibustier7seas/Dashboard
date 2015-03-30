define([], function () {
    return function (displayName, id, vote) {
        this.displayName = displayName;
        this.id = id;
        this.vote = vote;
        this.titleVote = "";

        this.updateTitleVote = function () {
            if (vote == -10) {
                this.titleVote = "No";
            }
            if (vote == 0) {
                this.titleVote = "No vote";
            }
            if (vote == 10) {
                this.titleVote = "Yes";
            }
        };

        this.updateTitleVote();
    };
});