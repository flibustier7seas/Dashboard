define(["jquery", "ko", "i18n!nls/tr", "../utils"], function ($, ko, tr, utils) {
    return function (pullRequest, tfs, tc) {
        var self = this;
        
        this.title = ko.observable(pullRequest.title);
        this.url = ko.observable(pullRequest.url);
        this.repositoryUrl = ko.observable(pullRequest.repositoryUrl);
        this.repositoryId = ko.observable(pullRequest.repositoryId);
        this.repositoryName = ko.observable(pullRequest.repositoryName);
        this.createdByDisplayName = ko.observable(pullRequest.createdByDisplayName);
        this.creationDate = ko.observable(pullRequest.creationDate);
        this.creationDateToText = ko.observable(utils.dateToText(pullRequest.creationDate));
        this.createdByLogin = ko.observable(pullRequest.createdByLogin);
        this.status = ko.observable(pullRequest.status);
        this.lastMergeSourceCommitId = ko.observable(pullRequest.lastMergeSourceCommitId);
        this.sourceRefName = ko.observable(pullRequest.sourceRefName);
        this.targetRefName = ko.observable(pullRequest.targetRefName);
        this.mergeStatus = ko.observable(pullRequest.mergeStatus);
        this.description = ko.observable(pullRequest.description);

        ///NOTE: Данные заполняемые фабрикой
        this.priorityName = ko.observable("");
        this.priorityIconUrl = ko.observable("");
        this.statusName = ko.observable("");
        this.issueTypeName = ko.observable("");
        this.issueTypeIconUrl = ko.observable("");
        this.issueUrl = ko.observable("");
        this.updateToText = ko.observable();
        this.update = ko.observable();
        this.reviewers = ko.observableArray();

        ///NOTE: Данные расчетные
        this.titleMinVote = ko.observable();
        this.minVote = ko.pureComputed(function () {
            var compare = utils.getFunctionCompare("vote", false);
            var min = utils.getMaxOfArray(self.reviewers(), compare);

            if (min) {
                self.titleMinVote(min.titleVote);
                return min.vote;
            } else {
                self.titleMinVote("No reviewers");
                return 20;
            }
        });

        ///NOTE: Данные подгружаемые по требованию
        this.commitsArray = ko.observableArray();
        this.commitIsLoad = false;
        this.commits = ko.pureComputed(function () {
            if (!self.commitIsLoad) {
                self.commitIsLoad = true;
                tfs.getCommits(self.sourceRefName(), self.targetRefName(), self.repositoryId()).then(function (data) {
                    self.commitsArray(data);
                    return self.commitsArray;
                });
            }
            return self.commitsArray();
        });

        this.buildsArray = ko.observableArray();
        this.buildIsLoad = false;
        this.builds = ko.pureComputed(function () {
            if (!self.buildIsLoad) {
                self.buildIsLoad = true;
                tc.getBuildsId(self.sourceRefName()).then(function (items) {
                    items.forEach(function (item) {
                        tc.getBuild(item).then(function (build) {
                            self.buildsArray.push(build);
                        });
                    });
                });
            }
            return self.buildsArray();
        });
    };
});