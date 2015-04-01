using System;
using Microsoft.TeamFoundation.Client;

public class Profiles
{
    private readonly Guid _userId;
    private readonly string _userName;

    public Guid UserId
    {
        get
        {
            return _userId;
        }
    }

    public string UserName
    {
        get
        {
            return _userName;
        }
    }

    public Profiles(TfsConfigurationServer configurationServer)
    {
        _userId = configurationServer.AuthorizedIdentity.TeamFoundationId;
        _userName = configurationServer.AuthorizedIdentity.DisplayName;

        //_userId = new Guid("a26028dd-e61a-4958-a76b-b1f47b7230cb");
    }
}