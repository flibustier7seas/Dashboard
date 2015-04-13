define(["jquery"], function ($) {
    return function (teamcityUrl) {

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
            getBuilds: function (branchName) {
                return $.getJSON(temcitycmds.buildsForBranch(branchName));
            },
            getBuild: function (buildId) {
                return $.getJSON(temcitycmds.build(buildId));
            }
        }
    };
});
