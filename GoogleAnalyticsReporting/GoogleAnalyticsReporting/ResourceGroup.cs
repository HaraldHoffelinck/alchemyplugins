using Alchemy4Tridion.Plugins.GUI.Configuration;
using Alchemy4Tridion.Plugins.GUI.Configuration.Elements;

namespace GoogleAnalyticsReporting
{
    public class ResourceGroup : Alchemy4Tridion.Plugins.GUI.Configuration.ResourceGroup
    {
        public ResourceGroup()
        {
            AddFile("GoogleAnalytics.css");
            AddFile("Chart.js");
            AddFile("Moment.js");
            AddFile("SiteAnalyticsTab.js");
            Dependencies.Add("Tridion.Web.UI.Editors.CME");
            Dependencies.Add("Tridion.Web.UI.Editors.CME.commands");
            AddWebApiProxy();
        }
    }
}
