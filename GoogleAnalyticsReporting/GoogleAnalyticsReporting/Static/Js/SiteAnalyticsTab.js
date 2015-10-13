Type.registerNamespace("GoogleAnalyticsReporting");


(function (w, d, s, g, js, fs) {
    g = w.gapi || (w.gapi = {}); g.analytics = { q: [], ready: function (f) { this.q.push(f); } };
    js = d.createElement(s); fs = d.getElementsByTagName(s)[0];
    js.src = 'https://apis.google.com/js/platform.js';
    fs.parentNode.insertBefore(js, fs); js.onload = function () { g.load('analytics'); };
}(window, document, 'script'));

!function (t) { function e(s) { if (i[s]) return i[s].exports; var a = i[s] = { exports: {}, id: s, loaded: !1 }; return t[s].call(a.exports, a, a.exports, e), a.loaded = !0, a.exports } var i = {}; return e.m = t, e.c = i, e.p = "", e(0) }([function (t, e) { "use strict"; gapi.analytics.ready(function () { function t(t) { if (s.test(t)) return t; var a = i.exec(t); if (a) return e(+a[1]); if ("today" == t) return e(0); if ("yesterday" == t) return e(1); throw new Error("Cannot convert date " + t) } function e(t) { var e = new Date; e.setDate(e.getDate() - t); var i = String(e.getMonth() + 1); i = 1 == i.length ? "0" + i : i; var s = String(e.getDate()); return s = 1 == s.length ? "0" + s : s, e.getFullYear() + "-" + i + "-" + s } var i = /(\d+)daysAgo/, s = /\d{4}\-\d{2}\-\d{2}/; gapi.analytics.createComponent("DateRangeSelector", { execute: function () { var e = this.get(); e["start-date"] = e["start-date"] || "7daysAgo", e["end-date"] = e["end-date"] || "yesterday", this.container = "string" == typeof e.container ? document.getElementById(e.container) : e.container, e.template && (this.template = e.template), this.container.innerHTML = this.template; var i = this.container.querySelectorAll("input"); return this.startDateInput = i[0], this.startDateInput.value = t(e["start-date"]), this.endDateInput = i[1], this.endDateInput.value = t(e["end-date"]), this.setValues(), this.setMinMax(), this.container.onchange = this.onChange.bind(this), this }, onChange: function () { this.setValues(), this.setMinMax(), this.emit("change", { "start-date": this["start-date"], "end-date": this["end-date"] }) }, setValues: function () { this["start-date"] = this.startDateInput.value, this["end-date"] = this.endDateInput.value }, setMinMax: function () { this.startDateInput.max = this.endDateInput.value, this.endDateInput.min = this.startDateInput.value }, template: '<div class="DateRangeSelector">  <div class="DateRangeSelector-item">    <label>Start Date</label>     <input type="date">  </div>  <div class="DateRangeSelector-item">    <label>End Date</label>     <input type="date">  </div></div>' }) }) }]);
//# sourceMappingURL=date-range-selector.js.map

!function (t) { function e(r) { if (i[r]) return i[r].exports; var s = i[r] = { exports: {}, id: r, loaded: !1 }; return t[r].call(s.exports, s, s.exports, e), s.loaded = !0, s.exports } var i = {}; return e.m = t, e.c = i, e.p = "", e(0) }([function (t, e, i) { "use strict"; function r(t) { return t && t.__esModule ? t : { "default": t } } var s = i(1), n = r(s); gapi.analytics.ready(function () { function t(t, e, i) { t.innerHTML = e.map(function (t) { var e = t.id == i ? "selected " : " "; return "<option " + e + 'value="' + t.id + '">' + t.name + "</option>" }).join("") } function e(t) { return t.ids || t.viewId ? { prop: "viewId", value: t.viewId || t.ids && t.ids.replace(/^ga:/, "") } : t.propertyId ? { prop: "propertyId", value: t.propertyId } : t.accountId ? { prop: "accountId", value: t.accountId } : void 0 } gapi.analytics.createComponent("ViewSelector2", { execute: function () { return this.setup_(function () { this.updateAccounts_(), this.changed_ && (this.render_(), this.onChange_()) }.bind(this)), this }, set: function (t) { if (!!t.ids + !!t.viewId + !!t.propertyId + !!t.accountId > 1) throw new Error('You cannot specify more than one of the following options: "ids", "viewId", "accountId", "propertyId"'); if (t.container && this.container) throw new Error("You cannot change containers once a view selector has been rendered on the page."); var e = this.get(); return (e.ids != t.ids || e.viewId != t.viewId || e.propertyId != t.propertyId || e.accountId != t.accountId) && (e.ids = null, e.viewId = null, e.propertyId = null, e.accountId = null), gapi.analytics.Component.prototype.set.call(this, t) }, setup_: function (t) { function e() { n["default"].get().then(function (e) { i.summaries = e, i.accounts = i.summaries.all(), t() }, function (t) { i.emit("error", t) }) } var i = this; gapi.analytics.auth.isAuthorized() ? e() : gapi.analytics.auth.on("success", e) }, updateAccounts_: function () { var t, i, r, s = this.get(), n = e(s); if (n) switch (n.prop) { case "viewId": t = this.summaries.getProfile(n.value), i = this.summaries.getAccountByProfileId(n.value), r = this.summaries.getWebPropertyByProfileId(n.value); break; case "propertyId": r = this.summaries.getWebProperty(n.value), i = this.summaries.getAccountByWebPropertyId(n.value), t = r && r.views && r.views[0]; break; case "accountId": i = this.summaries.getAccount(n.value), r = i && i.properties && i.properties[0], t = r && r.views && r.views[0] } else i = this.accounts[0], r = i && i.properties && i.properties[0], t = r && r.views && r.views[0]; i || r || t ? (i != this.account || r != this.property || t != this.view) && (this.changed_ = { account: i && i != this.account, property: r && r != this.property, view: t && t != this.view }, this.account = i, this.properties = i.properties, this.property = r, this.views = r && r.views, this.view = t, this.ids = t && "ga:" + t.id) : this.emit("error", new Error("You do not have access to " + n.prop.slice(0, -2) + " : " + n.value)) }, render_: function () { var e = this.get(); this.container = "string" == typeof e.container ? document.getElementById(e.container) : e.container, this.container.innerHTML = e.template || this.template; var i = this.container.querySelectorAll("select"), r = this.accounts, s = this.properties || [{ name: "(Empty)", id: "" }], n = this.views || [{ name: "(Empty)", id: "" }]; t(i[0], r, this.account.id), t(i[1], s, this.property && this.property.id), t(i[2], n, this.view && this.view.id), i[0].onchange = this.onUserSelect_.bind(this, i[0], "accountId"), i[1].onchange = this.onUserSelect_.bind(this, i[1], "propertyId"), i[2].onchange = this.onUserSelect_.bind(this, i[2], "viewId") }, onChange_: function () { var t = { account: this.account, property: this.property, view: this.view, ids: this.view && "ga:" + this.view.id }; this.changed_ && (this.changed_.account && this.emit("accountChange", t), this.changed_.property && this.emit("propertyChange", t), this.changed_.view && (this.emit("viewChange", t), this.emit("idsChange", t), this.emit("change", t.ids))), this.changed_ = null }, onUserSelect_: function (t, e) { var i = {}; i[e] = t.value, this.set(i), this.execute() }, template: '<div class="ViewSelector2">  <div class="ViewSelector2-item">    <label>Account</label>    <select class="FormField"></select>  </div>  <div class="ViewSelector2-item">    <label>Property</label>    <select class="FormField"></select>  </div>  <div class="ViewSelector2-item">    <label>View</label>    <select class="FormField"></select>  </div></div>' }) }) }, function (t, e, i) { function r() { var t = gapi.client.request({ path: o }).then(function (t) { return t }); return new t.constructor(function (e, i) { var r = []; t.then(function s(t) { var a = t.result; a.items ? r = r.concat(a.items) : i(new Error("You do not have any Google Analytics accounts. Go to http://google.com/analytics to sign up.")), a.startIndex + a.itemsPerPage <= a.totalResults ? gapi.client.request({ path: o, params: { "start-index": a.startIndex + a.itemsPerPage } }).then(s) : e(new n(r)) }).then(null, i) }) } var s, n = i(2), o = "/analytics/v3/management/accountSummaries"; t.exports = { get: function (t) { return t && (s = null), s || (s = r()) } } }, function (t, e) { function i(t) { this.accounts_ = t, this.webProperties_ = [], this.profiles_ = [], this.accountsById_ = {}, this.webPropertiesById_ = this.propertiesById_ = {}, this.profilesById_ = this.viewsById_ = {}; for (var e, i = 0; e = this.accounts_[i]; i++) if (this.accountsById_[e.id] = { self: e }, e.webProperties) { r(e, "webProperties", "properties"); for (var s, n = 0; s = e.webProperties[n]; n++) if (this.webProperties_.push(s), this.webPropertiesById_[s.id] = { self: s, parent: e }, s.profiles) { r(s, "profiles", "views"); for (var o, a = 0; o = s.profiles[a]; a++) this.profiles_.push(o), this.profilesById_[o.id] = { self: o, parent: s, grandParent: e } } } } function r(t, e, i) { Object.defineProperty ? Object.defineProperty(t, i, { get: function () { return t[e] } }) : t[i] = t[e] } i.prototype.all = function () { return this.accounts_ }, r(i.prototype, "all", "allAccounts"), i.prototype.allWebProperties = function () { return this.webProperties_ }, r(i.prototype, "allWebProperties", "allProperties"), i.prototype.allProfiles = function () { return this.profiles_ }, r(i.prototype, "allProfiles", "allViews"), i.prototype.get = function (t) { if (!!t.accountId + !!t.webPropertyId + !!t.propertyId + !!t.profileId + !!t.viewId > 1) throw new Error('get() only accepts an object with a single property: either "accountId", "webPropertyId", "propertyId", "profileId" or "viewId"'); return this.getProfile(t.profileId || t.viewId) || this.getWebProperty(t.webPropertyId || t.propertyId) || this.getAccount(t.accountId) }, i.prototype.getAccount = function (t) { return this.accountsById_[t] && this.accountsById_[t].self }, i.prototype.getWebProperty = function (t) { return this.webPropertiesById_[t] && this.webPropertiesById_[t].self }, r(i.prototype, "getWebProperty", "getProperty"), i.prototype.getProfile = function (t) { return this.profilesById_[t] && this.profilesById_[t].self }, r(i.prototype, "getProfile", "getView"), i.prototype.getAccountByProfileId = function (t) { return this.profilesById_[t] && this.profilesById_[t].grandParent }, r(i.prototype, "getAccountByProfileId", "getAccountByViewId"), i.prototype.getWebPropertyByProfileId = function (t) { return this.profilesById_[t] && this.profilesById_[t].parent }, r(i.prototype, "getWebPropertyByProfileId", "getPropertyByViewId"), i.prototype.getAccountByWebPropertyId = function (t) { return this.webPropertiesById_[t] && this.webPropertiesById_[t].parent }, r(i.prototype, "getAccountByWebPropertyId", "getAccountByPropertyId"), t.exports = i }]);
//# sourceMappingURL=view-selector2.js.map



function XMLFromString(sXML) {
    if (window.ActiveXObject) {
        var oXML = new ActiveXObject("Microsoft.XMLDOM");
        oXML.loadXML(sXML);
        return oXML;
    } else {
        return (new DOMParser()).parseFromString(sXML, "text/xml");
    }
}

GoogleAnalyticsReporting.SiteAnalyticsTab = function GoogleAnalyticsReporting$SiteAnalyticsTab$SiteAnalyticsTab(element) {
    Tridion.OO.enableInterface(this, "GoogleAnalyticsReporting.SiteAnalyticsTab");
    this.addInterface("Tridion.Controls.DeckPage", [element]); //My extension is like this
};

GoogleAnalyticsReporting.SiteAnalyticsTab.prototype.initialize = function SiteAnalyticsTab$initialize() {
    this.callBase("Tridion.Controls.DeckPage", "initialize");
    $evt.addEventHandler($display.getItem(), "load", this.getDelegate(this.updateView));
};

GoogleAnalyticsReporting.SiteAnalyticsTab.prototype.select = function SiteAnalyticsTab$select() {

    this.callBase("Tridion.Controls.DeckPage", "select");
    this.updateView();
};

GoogleAnalyticsReporting.SiteAnalyticsTab.prototype.updateView = function SiteAnalyticsTab$updateView() {




    var dateRange1 = {
        'start-date': '30daysAgo',
        'end-date': 'yesterday'
    };

    this.GAinitialized = false;
    this.profileId = "";//"65073647";
    this.serviceAccount = "";//"119036719248-s3la2r68jg2hj5if00kta1h55g88ai5o@developer.gserviceaccount.com";
    this.keyPath = "";//"C:\\Program Files (x86)\\Tridion\\web\\Alchemy\\Plugins\\GoogleAnalyticsReporting\\assets\\API Project-22c047b8c4ca.p12";

    var token = "";
    if (this.isSelected()) {

        var c = $display.getItem();
        console.log(c);
        var meta = c.getMetadata();
        if (meta != "") {
            var metaXml = XMLFromString(meta);
            this.profileId = metaXml.getElementsByTagName("gaProfile")[0].textContent;
            this.serviceAccount = metaXml.getElementsByTagName("gaServiceAccount")[0].textContent;
            this.keyPath = metaXml.getElementsByTagName("keyPath")[0].textContent;
            this.GAinitialized = this.profileId && this.serviceAccount && this.keyPath;
        }

        if (!this.GAinitialized) {
            alert("Could not initialize Google Analytics. Make sure the Google Analytics settings are defined in your publication Metadata schema")
        }
        else {

            Alchemy.Plugins.GoogleAnalyticsReporting.Api.GoogleAnalyticsService.authenticate({
                Query: "&metrics=ga:visits,ga:sessions&start-date=2012-12-01&end-date=2014-12-08",
                ProfileId: this.profileId,
                ServiceAccount: this.serviceAccount,
                KeyPath: this.keyPath
            })
              .success(function (result) {
                  token = result;

                  gapi.analytics.auth.authorize({
                      'serverAuth': {
                          'access_token': token
                      }
                  });

                  var viewSelector = new gapi.analytics.ext.ViewSelector2({
                      container: 'view-selector-container',
                  }).execute();

                  var dateRangeSelector1 = new gapi.analytics.ext.DateRangeSelector({
                      container: 'date-range-selector-1-container'
                  })
                 .set(dateRange1)
                 .execute();

                  var dateRangeSelector2 = new gapi.analytics.ext.DateRangeSelector({
                      container: 'date-range-selector-2-container'
                  })
               .set(dateRange1)
               .execute();
                  var dateRangeSelector3 = new gapi.analytics.ext.DateRangeSelector({
                      container: 'date-range-selector-3-container'
                  })
               .set(dateRange1)
               .execute();
                  var dateRangeSelector4 = new gapi.analytics.ext.DateRangeSelector({
                      container: 'date-range-selector-4-container'
                  })
               .set(dateRange1)
               .execute();



                  var dataChart4 = new gapi.analytics.googleCharts.DataChart({
                      query: {
                          'ids': 'ga:' + this.profileId,
                          'metrics': 'ga:sessions',
                          'dimensions': 'ga:country',
                          'start-date': '30daysAgo',
                          'end-date': 'yesterday',
                          'max-results': 6,
                          sort: '-ga:sessions'
                      },
                      chart: {
                          container: 'chart-4-container',
                          type: 'GEO',
                          options: {
                              width: '100%',
                              title: 'Sessions per country',
                          }
                      }
                  });
                  dataChart4.execute();


                  /**
                   * Creates a new DataChart instance showing top 5 most popular demos/tools
                   * amongst returning users only.
                   * It will be rendered inside an element with the id "chart-3-container".
                   */
                  var dataChart2 = new gapi.analytics.googleCharts.DataChart({
                      query: {
                          'ids': 'ga:' + this.profileId,
                          metrics: 'ga:pageviews',
                          dimensions: 'ga:date',
                          'start-date': '30daysAgo',
                          'end-date': 'yesterday'
                      },
                      chart: {
                          container: 'chart-2-container',
                          type: 'LINE',
                          options: {
                              width: '100%'
                          }
                      }
                  });
                  dataChart2.execute();
                  /**
                   * Creates a new DataChart instance showing top 5 most popular demos/tools
                   * amongst returning users only.
                   * It will be rendered inside an element with the id "chart-3-container".
                   */
                  var dataChart3 = new gapi.analytics.googleCharts.DataChart({
                      query: {
                          'ids': 'ga:' + this.profileId,
                          metrics: 'ga:sessions',
                          dimensions: 'ga:browser',
                          'start-date': '30daysAgo',
                          'end-date': 'yesterday'
                      },
                      chart: {
                          container: 'chart-3-container',
                          type: 'PIE',
                          options: {
                              width: '100%',
                              pieHole: 4 / 9
                          }
                      }
                  });
                  dataChart3.execute();

                  /**
                  * Creates a new DataChart instance showing top 5 most popular demos/tools
                  * amongst returning users only.
                  * It will be rendered inside an element with the id "chart-3-container".
                  */
                  var dataChart1 = new gapi.analytics.googleCharts.DataChart({
                      query: {
                          'ids': 'ga:' + this.profileId,
                          metrics: 'ga:sessions',
                          dimensions: 'ga:date',
                          'start-date': '30daysAgo',
                          'end-date': 'yesterday'
                      },
                      chart: {
                          container: 'chart-1-container',
                          type: 'LINE',
                          options: {
                              width: '100%'
                          }
                      }
                  });
                  dataChart1.execute();

                  /**
      * Register a handler to run whenever the user changes the view.
      * The handler will update both dataCharts as well as updating the title
      * of the dashboard.
      */
                  viewSelector.on('viewChange', function (data) {
                      dataChart1.set({ query: { ids: data.ids } }).execute();
                      dataChart2.set({ query: { ids: data.ids } }).execute();
                      dataChart3.set({ query: { ids: data.ids } }).execute();
                      dataChart4.set({ query: { ids: data.ids } }).execute();

                      /*var title = document.getElementById('view-name');
                      title.innerHTML = data.property.name + ' (' + data.view.name + ')';*/
                  });


                  /**
    * Register a handler to run whenever the user changes the date range from
    * the first datepicker. The handler will update the first dataChart
    * instance as well as change the dashboard subtitle to reflect the range.
    */
                  dateRangeSelector1.on('change', function (data) {
                      dataChart1.set({ query: data }).execute();

                      // Update the "from" dates text.
                      var datefield = document.getElementById('from-dates1');
                      datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
                  });

                  dateRangeSelector2.on('change', function (data) {
                      dataChart2.set({ query: data }).execute();

                      // Update the "from" dates text.
                      var datefield = document.getElementById('from-dates2');
                      datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
                  });
                  dateRangeSelector3.on('change', function (data) {
                      dataChart3.set({ query: data }).execute();

                      // Update the "from" dates text.
                      var datefield = document.getElementById('from-dates3');
                      datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
                  });
                  dateRangeSelector4.on('change', function (data) {
                      dataChart4.set({ query: data }).execute();

                      // Update the "from" dates text.
                      var datefield = document.getElementById('from-dates4');
                      datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
                  });
              });
        }
    }
};


Tridion.Controls.Deck.registerPageType(GoogleAnalyticsReporting.SiteAnalyticsTab, "GoogleAnalyticsReporting.SiteAnalyticsTab");


