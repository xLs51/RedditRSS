(function () {
    "use strict";

    var searchList = new WinJS.Binding.List();
    WinJS.Namespace.define("Search", { ItemList: searchList });

    function getRedditSearch(q) {
        WinJS.xhr({ url: "http://www.reddit.com/subreddits/search.json?q=" + q }).then(function (json) {
            var items = JSON.parse(json.responseText);
            var children = items.data.children;

            for (var n = 0; n < children.length; n++) {
                var search = {};
                search.subreddit = children[n].data.url;
                searchList.push(search);
            }
        });
    }

    function searchButton(eventInfo) {
        searchList.splice(0, searchList.length);
        var subreddit = document.getElementById("search").value;
        getRedditSearch(subreddit);
    }

    function itemInvoked(e) {
        var subreddit = searchList.getAt(e.detail.itemIndex);
        WinJS.Navigation.navigate("/pages/subreddit/subreddit.html", subreddit);
    }

    WinJS.UI.Pages.define("/pages/search/search.html", {
        ready: function (element, options) {
            WinJS.Namespace.define("Search", { SearchButton: searchButton });
            var subreddit = document.getElementById("search-list");
            subreddit.addEventListener("iteminvoked", itemInvoked);
        }
    });
})();
