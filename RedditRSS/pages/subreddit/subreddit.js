(function () {
    "use strict";

    var subredditList = new WinJS.Binding.List();
    WinJS.Namespace.define("Subreddit", { ItemList: subredditList });

    function getSubredditRss(value) {
        WinJS.xhr({ url: "http://www.reddit.com" + value + ".rss" }).done(
            function complete(result) {
                subredditList.splice(0, subredditList.length);

                var items = result.responseXML.querySelectorAll("item");
                for (var n = 0; n < items.length; n++) {
                    var subreddit = {};
    
                    var title = items[n].querySelector("title").textContent;
                    subreddit.title = title.length > 100 ? title.substring(0, 100) + "..." : title;
                    subreddit.link = items[n].querySelector("link").textContent;
                    subreddit.date = items[n].querySelector("pubDate").textContent;
                    subreddit.thumbnail = items[n].querySelector("thumbnail") ? items[n].querySelector("thumbnail").getAttribute("url") : "http://upload.wikimedia.org/wikipedia/fr/thumb/f/fc/Reddit-alien.png/150px-Reddit-alien.png";
    
                    subredditList.push(subreddit);
                }
            },
            function error(result) {
                subredditList.splice(0, subredditList.length);

                var subreddit = {};

                subreddit.title = "This subreddit is private !";
                subreddit.thumbnail = "https://nyobetabeat.files.wordpress.com/2012/10/screen-shot-2012-10-10-at-2-31-57-pm.png?w=300&h=262";

                subredditList.push(subreddit);
            }
        );
    }

    function itemInvoked(e) {
        var content = subredditList.getAt(e.detail.itemIndex);
        if (typeof content.link != 'undefined')
            WinJS.Navigation.navigate("/pages/content/content.html", content);
    }

    function refresh() {
        var value = document.getElementById("title").innerHTML;
        getSubredditRss(value);
    }

    WinJS.UI.Pages.define("/pages/subreddit/subreddit.html", {
        ready: function (element, options) {
            document.getElementById("refresh").addEventListener("click", refresh, false);
            document.getElementById("title").innerHTML = options.subreddit;
            getSubredditRss(options.subreddit);

            var subreddit = document.getElementById("subreddit");
            subreddit.addEventListener("iteminvoked", itemInvoked);
        }
    });
})();
