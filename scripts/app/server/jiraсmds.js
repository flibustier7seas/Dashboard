define(["jquery"], function ($) {
    return function (jiraUrl) {

        var jiracmds = {
            issues: jiraUrl + "/rest/api/2/issue",
            issue: function (issue) {
                return this.issues + "/" + issue;
            }
        };

        return {
            getIssue: function (issueName) {
                return $.getJSON(jiracmds.issue(issueName));
            }
        }
    };
});
