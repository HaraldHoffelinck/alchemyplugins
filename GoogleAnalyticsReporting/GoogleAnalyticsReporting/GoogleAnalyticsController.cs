using Alchemy4Tridion.Plugins;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.IO;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace GoogleAnalyticsReporting
{
    /// <summary>
    /// An ApiController to create web services that your plugin can interact with.
    /// </summary>
    /// <remarks>
    /// The AlchemyRoutePrefix accepts a Service Name as its first parameter.  This will be used by both
    /// the generated Url's as well as the generated JS proxy.
    /// <c>/Alchemy/Plugins/{YourPluginName}/api/{ServiceName}/{action}</c>
    /// <c>Alchemy.Plugins.YourPluginName.Api.Service.action()</c>
    /// 
    /// The attribute is optional and if you exclude it, url's and methods will be attached to "api" instead.
    /// <c>/Alchemy/Plugins/{YourPluginName}/api/{action}</c>
    /// <c>Alchemy.Plugins.YourPluginName.Api.action()</c>
    /// </remarks>
    [AlchemyRoutePrefix("GoogleAnalyticsService")]
    public class GoogleAnalyticsController : AlchemyApiController
    {

        [ImportMany] // This is a signal to the MEF framework to load all matching exported assemblies.
        private IEnumerable<IPlugin> Plugins { get; set; }


        /// // GET /Alchemy/Plugins/{YourPluginName}/api/{YourServiceName}/YourRoute
        /// <summary>
        /// Just a simple example..
        /// </summary>
        /// <returns>A string "Your Response" as the response message.</returns>
        /// </summary>
        /// <remarks>
        /// All of your action methods must have both a verb attribute as well as the RouteAttribute in
        /// order for the js proxy to work correctly.
        /// </remarks>
        [HttpPost]
        [Route("GetAnalytics")]
        public string GetAnalytics(QueryModel query)
        {
            var auth = GetAccessToken(query.ServiceAccount, query.KeyPath, SCOPE_ANALYTICS_READONLY);

            Console.WriteLine("Google access token: {0}", auth["access_token"]);
            var token = auth["access_token"];

            HttpWebRequest r = (HttpWebRequest)WebRequest.Create(string.Format("https://www.googleapis.com/analytics/v3/data/ga?ids=ga:{0}{1}&access_token={2}", query.ProfileId, query.Query, token));
            r.Method = "Get";
            HttpWebResponse res = (HttpWebResponse)r.GetResponse();
            Stream sr = res.GetResponseStream();
            StreamReader sre = new StreamReader(sr);

            string s = sre.ReadToEnd();
            return s;
        }

        [HttpPost]
        [Route("Authenticate")]
        public string Authenticate(QueryModel query)
        {
            var auth = GetAccessToken(query.ServiceAccount, query.KeyPath, SCOPE_ANALYTICS_READONLY);
            var token = auth["access_token"];
            return token;
        }

        public const string SCOPE_ANALYTICS_READONLY = "https://www.googleapis.com/auth/analytics.readonly";

        public static dynamic GetAccessToken(string clientIdEMail, string keyFilePath, string scope)
        {
            // certificate
            var certificate = new X509Certificate2(keyFilePath, "notasecret");

            // header
            var header = new { typ = "JWT", alg = "RS256" };

            // claimset
            var times = GetExpiryAndIssueDate();
            var claimset = new
            {
                iss = clientIdEMail,
                scope = scope,
                aud = "https://accounts.google.com/o/oauth2/token",
                iat = times[0],
                exp = times[1],
            };

            JavaScriptSerializer ser = new JavaScriptSerializer();

            // encoded header
            var headerSerialized = ser.Serialize(header);
            var headerBytes = Encoding.UTF8.GetBytes(headerSerialized);
            var headerEncoded = Convert.ToBase64String(headerBytes);

            // encoded claimset
            var claimsetSerialized = ser.Serialize(claimset);
            var claimsetBytes = Encoding.UTF8.GetBytes(claimsetSerialized);
            var claimsetEncoded = Convert.ToBase64String(claimsetBytes);

            // input
            var input = headerEncoded + "." + claimsetEncoded;
            var inputBytes = Encoding.UTF8.GetBytes(input);

            // signiture
            var rsa = certificate.PrivateKey as RSACryptoServiceProvider;
            var cspParam = new CspParameters
            {
                KeyContainerName = rsa.CspKeyContainerInfo.KeyContainerName,
                KeyNumber = rsa.CspKeyContainerInfo.KeyNumber == KeyNumber.Exchange ? 1 : 2
            };
            var aescsp = new RSACryptoServiceProvider(cspParam) { PersistKeyInCsp = false };
            var signatureBytes = aescsp.SignData(inputBytes, "SHA256");
            var signatureEncoded = Convert.ToBase64String(signatureBytes);

            // jwt
            var jwt = headerEncoded + "." + claimsetEncoded + "." + signatureEncoded;

            var client = new WebClient();
            client.Encoding = Encoding.UTF8;
            var uri = "https://accounts.google.com/o/oauth2/token";
            var content = new NameValueCollection();

            content["assertion"] = jwt;
            content["grant_type"] = "urn:ietf:params:oauth:grant-type:jwt-bearer";

            string response = Encoding.UTF8.GetString(client.UploadValues(uri, "POST", content));

            var result = ser.Deserialize<dynamic>(response);

            return result;
        }

        private static int[] GetExpiryAndIssueDate()
        {
            var utc0 = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            var issueTime = DateTime.UtcNow;

            var iat = (int)issueTime.Subtract(utc0).TotalSeconds;
            var exp = (int)issueTime.AddMinutes(55).Subtract(utc0).TotalSeconds;

            return new[] { iat, exp };
        }

    }

    public class QueryModel
    {
        public string Query { get; set; }
        public string ProfileId { get; set; }
        public string ServiceAccount { get; set; }
        public string KeyPath { get; set; }
    }
}

