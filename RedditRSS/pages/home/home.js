(function () {
    "use strict";

    var home = 0;
    var redditList = new WinJS.Binding.List();
    WinJS.Namespace.define("Reddit", { ItemList: redditList });

    function sendTileUpdate(title, img) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.TileTemplateType.tileSquarePeekImageAndText04;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].innerText = title;

        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", img);

        var tileNotification = new notifications.TileNotification(tileXml);
        notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
    }

    function clearTile() {
        var notifications = Windows.UI.Notifications;
        notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
    }

    function getRedditRss() {
        WinJS.xhr({ url: "http://www.reddit.com/.rss" }).then(function (rss) {
            clearTile();

            var items = rss.responseXML.querySelectorAll("item");
            for (var n = 0; n < items.length; n++) {
                var reddit = {};

                var title = items[n].querySelector("title").textContent;
                reddit.title = title.length > 100 ? title.substring(0, 100) + "..." : title;
                reddit.category = items[n].querySelector("category").textContent;
                reddit.link = items[n].querySelector("link").textContent;
                reddit.date = items[n].querySelector("pubDate").textContent;
                reddit.thumbnail = items[n].querySelector("thumbnail") ? items[n].querySelector("thumbnail").getAttribute("url") : "http://upload.wikimedia.org/wikipedia/fr/thumb/f/fc/Reddit-alien.png/150px-Reddit-alien.png";

                redditList.push(reddit);

                if (n == 0)
                    sendTileUpdate(reddit.title, reddit.thumbnail);
            }
        });
    }

    function itemInvoked(e) {
        var content = redditList.getAt(e.detail.itemIndex);
        WinJS.Navigation.navigate("/pages/content/content.html", content);
    }

    function linkClickEventHandler(eventInfo) {
        eventInfo.preventDefault();
        var link = eventInfo.target;
        WinJS.Navigation.navigate(link.href);
    }

    function showFlyout(flyout, anchor, placement) {
        flyout.winControl.show(anchor, placement);
    }

    function hideFlyout(flyout) {
        flyout.winControl.hide();
    }

    function showRespondFlyout() {
        showFlyout(respondFlyout, redditMenu, "bottom");
    }

    function search() {
        hideFlyout(respondFlyout);
        WinJS.Navigation.navigate("/pages/search/search.html");
    }

    function refresh() {
        redditList.splice(0, redditList.length);
        getRedditRss();
    }

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            // Initialize event listeners.
            document.getElementById("redditMenu").addEventListener("click", showRespondFlyout, false);
            document.getElementById("searchMenuItem").addEventListener("click", search, false);
            document.getElementById("refresh").addEventListener("click", refresh, false);

            WinJS.Utilities.query("a").listen("click", linkClickEventHandler, false);
            var reddit = document.getElementById("reddit");
            reddit.addEventListener("iteminvoked", itemInvoked);

            if (home == 0) {
                getRedditRss();
                home++;
            }
        }
    });
})();
