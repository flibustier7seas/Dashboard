﻿using Microsoft.TeamFoundation.Client;
using System;
using System.Configuration;

public class Settings
{
    private readonly Guid _userId;
    private readonly string _mainUrl;
    private readonly string _userName;

    public Guid UserId
    {
        get
        {
            return _userId;
        }
    }

    public string MainUrl
    {
        get
        {
            return _mainUrl;
        }
    }

    public string UserName
    {
        get
        {
            return _userName;
        }
    }

    public Settings()
    {
        var urlTfs = ConfigurationManager.ConnectionStrings["UrlTfs"].ConnectionString;

        var configurationServer = TfsServer.GetConfiguration(urlTfs);

        _mainUrl = ConfigurationManager.ConnectionStrings["MainUrl"].ConnectionString;
        //_userId = configurationServer.AuthorizedIdentity.TeamFoundationId;
        _userId = new Guid("a26028dd-e61a-4958-a76b-b1f47b7230cb");
        _userName = configurationServer.AuthorizedIdentity.DisplayName;
    }
}