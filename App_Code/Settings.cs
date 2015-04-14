using System;
using System.Configuration;
using System.Web;
using Microsoft.TeamFoundation.Client;

namespace Dashboard
{
    public static class Settings
    {
        private static readonly Lazy<ServiceUrls> services = new Lazy<ServiceUrls>(() =>
            new ServiceUrls
            {
                TfsUrl = ConfigurationManager.AppSettings["Tfs"],
                JiraUrl = ConfigurationManager.AppSettings["JIRA"],
                TeamCityUrl = ConfigurationManager.AppSettings["TeamCity"],
            });

        private static readonly Lazy<UserInfo> currentUser = new Lazy<UserInfo>(
            delegate
            {
                var configuration = GetTfsConfiguration(Services.TfsUrl);
                var identity = configuration.AuthorizedIdentity;
                var userId = identity.TeamFoundationId;
                var userName = identity.DisplayName;
                var login = UserLogin;
                return new UserInfo(userId, userName,login);
            });

        public static ServiceUrls Services
        {
            get
            {
                return services.Value;
            }
        }

        public static UserInfo CurrentUser
        {
            get { return currentUser.Value; }
        }

        private static TfsConfigurationServer GetTfsConfiguration(string path)
        {
            if (path == null)
            {
                throw new ArgumentNullException("path");
            }
            
            return TfsConfigurationServerFactory.GetConfigurationServer(new Uri(path));
        }

        private static string UserLogin
        {
            get
            {
                return HttpContext.Current.User.Identity.Name.Replace(@"\", @"\\"); 
            }
        }
    }

    public class UserInfo
    {
        public UserInfo(Guid id, string name, string login)
        {
            Id = id;
            Name = name;
            Login = login;
        }

        public Guid Id { get; private set; }

        public string Name { get; private set; }

        public string Login { get; private set; }
    }

    public class ServiceUrls
    {
        public string TfsUrl { get; set; }
        public string JiraUrl { get; set; }
        public string TeamCityUrl { get; set; }
    }
}

