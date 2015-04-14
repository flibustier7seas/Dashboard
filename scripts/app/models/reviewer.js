define([], function () {
    return function (displayName, id, vote,login) {
        this.displayName = displayName;
        this.id = id;
        this.vote = vote;
        this.login = login;
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