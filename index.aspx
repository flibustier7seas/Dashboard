<%@ Page Language="C#" %>
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
        
         <div data-bind="template: { if: listOfPullRequest().isLoaded, name: 'pullRequestsView', data: listOfPullRequest }"></div>

    </div>

</body>
</html>
