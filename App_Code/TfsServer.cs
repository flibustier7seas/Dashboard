using System;
using Microsoft.TeamFoundation.Client;

public static class TfsServer
{
    public static TfsConfigurationServer GetConfiguration(string path)
    {
        var tfsUri = new Uri(path);
        return TfsConfigurationServerFactory.GetConfigurationServer(tfsUri);
    }

}