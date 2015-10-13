using Alchemy4Tridion.Plugins.GUI.Configuration;
using Alchemy4Tridion.Plugins.GUI.Configuration.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleAnalyticsReporting
{
    public class SiteAnalyticsTab : TabPageExtension
    {
        public SiteAnalyticsTab()
        {
            this.Name = "Google Analytics";
            this.AssignId = "SiteAnalytics";
            this.Control = "~/Plugins/GoogleAnalyticsReporting/assets/controls/SiteAnalytics.ascx";
            this.PageType = "GoogleAnalyticsReporting.SiteAnalyticsTab";
            this.Dependencies.Add<ResourceGroup>();
            this.InsertBefore = "InfoTab";
            //var ApplyView = new ApplyView();
            //ApplyView.Name = Constants.Views.PageView;
            //ApplyView.ControlId ="SiteAnalyticsTab";
            //this.Apply.Views.Add(ApplyView);

            Apply.ToView(Constants.Views.PageView);
            Apply.ToView("PublicationView");
        }
    }
}
