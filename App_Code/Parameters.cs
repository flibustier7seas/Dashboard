using System.Collections.Generic;
using System.Configuration;
using System.Linq;

public static class Parameters
{
    public static string GetUrlTfs()
    {
        return ConfigurationManager.ConnectionStrings["UrlTfs"].ConnectionString;
    }

    public static IEnumerable<KeyValuePair<string, string>> GetConstants()
    {
        var keys = ConfigurationManager.AppSettings.AllKeys;
        var constants = keys.ToDictionary(key => key, key => ConfigurationManager.AppSettings[key]);
        return constants;
    }
}