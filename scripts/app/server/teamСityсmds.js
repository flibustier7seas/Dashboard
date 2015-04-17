define(["jquery", "../utils", "../models/build"], function ($,utils, buildModel) {
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
            getBuild: function (buildId) {
                return $.getJSON(temcitycmds.build(buildId)).then(function (obj) {
                    return new buildModel(
                        obj.buildTypeId,
                        obj.state,
                        obj.status,
                        obj.webUrl,
                        obj.statusText,
                        utils.dateToTextTC(obj.startDate),
                        utils.timeDifference(obj.startDate, obj.finishDate)
                        );
                });
            },
            getBuildsId: function (branchName) {
                console.log("getBuildsId: " + branchName);
                return $.getJSON(temcitycmds.buildsForBranch(branchName)).then(function (data) {
                    return $.map(data.build || [], function (item) {
                        return item.id;
                    });
                });
            }
        }
    };
});
