define(["jquery"], function ($) {
    return function (services) {

        var tfsUrl = services.tfs;
        var jiraUrl = services.jira;
        var teamcityUrl = services.teamcity;

        var commands = {
            repositories: tfsUrl + "/DefaultCollection/_apis/git/repositories",
            repository: function(repositoryId) {
                return this.repositories + "/" + repositoryId;
            },
            pullRequests: function(repositoryId) {
                return this.repository(repositoryId) + "/pullRequests";
            },
            pullRequest: function(repositoryId, pullRequestId) {
                return this.repository(repositoryId) + "/pullRequests/" + pullRequestId;
            },
            commits: function(repositoryId) {
                return this.repository(repositoryId) + "/commitsBatch?$top=10"
            },
            reviewers: function(repositoryId, pullRequestId) {
                return this.pullRequest(repositoryId, pullRequestId) + "/reviewers";
            }
        };

        var jiracmds = {
            issues: jiraUrl + "/rest/api/2/issue",
            issue: function (issue) {
                return this.issues + "/" + issue;
            }
        };

        var temcitycmds = {
            builds: teamcityUrl + "/httpAuth/app/rest/builds",
            build: function (buildId) {
                return this.builds + "/id:" + buildId;
            },
            buildsForBranch: function (name) {
                return this.builds + "?locator=count:1,branch:" + name.replace("feature/", "");
            }
        };

        return {
            getRepositories: function () {
                return $.getJSON(commands.repositories);
            },
            getPullRequests: function (repositoryId) {
                return $.getJSON(commands.pullRequests(repositoryId));
            },
            getCommits: function (sourceRefName, targetRefName,repositoryId) {
                var between = {
                    "itemVersion": {
                        "versionType": "branch",
                        "version": targetRefName
                    },
                    "compareVersion": {
                        "versionType": "branch",
                        "version": sourceRefName
                    }
                }
                return $.post(commands.commits(repositoryId), between);
            },
            getReviewers: function (repositoryId, pullRequestId) {
                return $.getJSON(commands.reviewers(repositoryId, pullRequestId));
            },
            getIssue: function(issueName) {
                return $.getJSON(jiracmds.issue(issueName));
            },
            getBuilds: function (branchName) {
                return $.getJSON(temcitycmds.buildsForBranch(branchName));
            },
            getBuild: function (buildId) {
                return $.getJSON(temcitycmds.build(buildId));
            }
        }
    };
});
