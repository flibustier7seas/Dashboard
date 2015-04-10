﻿<%@ Page Language="C#" %>
<%@ Import Namespace="Dashboard" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>TFS Dashboard</title>
    <script src="scripts/libs/require.js" data-main="scripts/bootstrap"></script>
    <link href="style/bootstrap.min.css" rel="stylesheet">
    <link href="style/styleSheet.css" rel="stylesheet">

    <script type="text/javascript">
        var user = { id: "<%=Settings.CurrentUser.Id%>", name: "<%=Settings.CurrentUser.Name %>" };
        var services = {
            tfs: "<%=Settings.Services.TfsUrl%>",
            jira: "<%=Settings.Services.JiraUrl%>",
            teamcity: "<%=Settings.Services.TeamCityUrl%>",
        };
    </script>
</head>
<body>

    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav" data-bind="foreach: menuHeaders">
                    <li><a href="#" data-bind="click: $root.setActiveMenu, text: title"></a></li>
                </ul>
                <a class="navbar-brand navbar-right" data-bind="text: userName"></a>
            </div>
        </div>
    </div>

    <div class="container-fluid">

        <div data-bind="with: listOfPullRequest, visible: menuHeaders()[0].active">

            <button class="btn btn-primary" data-toggle="modal" data-target="#modalStatistic">Statistic</button>

            <div class="row">
                <div class="btn-group" data-toggle="buttons" data-bind="foreach: filters">
                    <label class="btn btn-primary" data-bind="click: $parent.setActiveFilter">
                        <input type="radio" name="options" />
                        <span data-bind="text: title"></span>
                    </label>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-6">
                    <select class="col-md-2 form-control" data-bind="options: headers, value: propertyForFilters, optionsText: 'title', optionsValue: 'sortPropertyName'"></select>
                </div>
                <div class="col-xs-6">
                    <input class="col-md-3 form-control" type="text" data-bind="textInput: textForFilters" />
                </div>
            </div>
            <div class="row">
                <table class="table table-hover table-bordered">
                    <thead>
                        <tr class="text-info" data-bind="foreach: headers">
                            <th>
                                <span data-bind="text: title"></span>
                                <a class="glyphicon glyphicon-arrow-up" href="#" data-bind="click: function (data) { $parent.sort(data, true) }, style: { 'opacity': opacityUp }"></a>
                                <a class="glyphicon glyphicon-arrow-down" href="#" data-bind="click: function (data) { $parent.sort(data, false) }, style: { 'opacity': opacityDown }"></a>
                            </th>
                        </tr>
                    </thead>

                    <tbody data-bind="foreach: newListOfPullRequest">
                        <tr class="text-left" data-toggle="modal" data-target="#myModal" data-bind="click: $parent.setPullRequest">
                            <td class="col-md-1">
                                <a data-bind="text: repositoryName, attr: { href: repositoryUrl }" target="_blank"></a>
                            </td>
                            <td class="col-md-2" data-bind="text: createdByDisplayName"></td>
                            <td class="col-md-4">
                                <a data-bind="text: title, attr: { href: url }" target="_blank"></a>
                            </td>
                            <td class="col-md-2" data-bind="text: creationDateToText"></td>
                            <td class="col-md-2" data-bind="text: updateToText"></td>
                            <td class="col-md-1" data-bind="text: titleMinVote"></td>
                            <td>
                                <a data-bind="text: statusName, attr: { href: issueUrl }" target="_blank"></a>
                            </td>
                            <td class="col-md-1" data-bind="text: priorityName"></td>
                            <td class="col-md-1" data-bind="text: issueTypeName"></td>
                            
                        </tr>
                    </tbody>
                </table>
                <div class="col-xs-2">
                    <input class="form-control" placeholder="Count records" data-bind="value: countRecords" />
                </div>

                <div class="btn-group" data-toggle="buttons" data-bind="foreach: numberOfPagesButton">
                    <label class="btn btn-success" data-bind="click: $parent.setPage">
                        <input type="radio" name="options" />
                        <span data-bind="text: num"></span>
                    </label>
                </div>
            </div>
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content" data-bind="with: chosenPullRequest">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title" data-bind="text: title"></h4>
                        </div>
                        <div class="modal-body">
                            <p>
                                <label>Repository</label>: <span data-bind="text: repositoryName"></span>
                            </p>
                            <p>
                                <label>Created By</label>: <span data-bind="text: createdByDisplayName"></span>
                            </p>
                            <p>
                                <label>Creation Date</label>: <span data-bind="text: creationDate"></span>
                            </p>
                            <p>
                                <label>SourceRefName</label>: <span data-bind="text: sourceRefName"></span>
                            </p>
                            <p>
                                <label>TargetRefName</label>: <span data-bind="text: targetRefName"></span>
                            </p>
                            <p>
                                <label>Merge Status</label>: <span data-bind="text: mergeStatus"></span>
                            </p>
                            <p>
                                <label>Description</label>: <span data-bind="text: description"></span>
                            </p>

                            <table class="table">
                                <caption>Reviewers</caption>
                                <thead>
                                    <tr>
                                        <th>Display Name</th>
                                        <th>Title Vote</th>
                                    </tr>
                                </thead>
                                <tbody data-bind="foreach: reviewers">
                                    <tr>
                                        <td data-bind="text: displayName"></td>
                                        <td data-bind="text: titleVote"></td>
                                    </tr>
                                </tbody>
                            </table>

                            <table class="table">
                                <caption>Commits (top 10)</caption>
                                <thead>
                                    <tr>
                                        <th>Push date</th>
                                        <th>Comment</th>
                                    </tr>
                                </thead>
                                <tbody data-bind="foreach: commits">
                                    <tr>
                                        <td data-bind="text: pushDate"></td>
                                        <td data-bind="text: comment"></td>
                                    </tr>
                                </tbody>
                            </table>

                            <table class="table">
                                <caption>Builds</caption>
                                <thead>
                                    <tr>
                                        <th>buildTypeId</th>
                                        <th>state</th>
                                        <th>status</th>
                                        <th>Status text</th>
                                        <th>Start date</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody data-bind="foreach: builds">
                                    <tr>
                                        <td>
                                            <a data-bind="text: buildTypeId, attr: { href: webUrl }" target="_blank"></a>
                                        </td>
                                        <td data-bind="text: state"></td>
                                        <td data-bind="text: status"></td>
                                        <td data-bind="text: statusText"></td>
                                        <td data-bind="text: startDate"></td>
                                        <td data-bind="text: time"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalStatistic" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title">Statistic</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4" data-bind="foreach: statistic">
                                    <a data-bind="text: title"></a>:<a data-bind="    text: count"></a><br />
                                </div>
                                <div class="col-md-4">
                                    <canvas id="pie" height="300" width="300"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>

</body>
</html>