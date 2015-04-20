define(["jquery", "../models/issue"], function ($, issueModel) {
    return function (jiraUrl) {

        var jiracmds = {
            issues: jiraUrl + "/rest/api/2/issue",
            issue: function (issue) {
                return this.issues + "/" + issue;
            }
        };

        return {
            getIssue: function (issueName) {
                return $.getJSON(jiracmds.issue(issueName)).then(function (item) {
                    return new issueModel(
                        item.fields.priority.name,
                        item.fields.priority.iconUrl,
                        jiraUrl + "/browse/" + issueName,
                        item.fields.status.name,
                        item.fields.issuetype.name,
                        item.fields.issuetype.iconUrl
                        );
                });
            }
        }
    };
});
