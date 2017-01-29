(function () {
    "use strict";

    function checkUrl(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    function getContent(q) {
        WinJS.xhr({ url: q + ".json" }).then(function (json) {
            var items = JSON.parse(json.responseText);
            var children = items[0].data.children[0].data;

            var isSelf = children.is_self;

            var author = children.author;
            var subreddit = children.subreddit;
            document.getElementById("details").innerHTML = "By " + author + " in /r/" + subreddit;
            document.getElementById("share").innerHTML = "You can share this content !";

            var title = children.title;
            document.getElementById("title").innerHTML = title;
            document.getElementById("subTitle").innerHTML = title;

            if (isSelf) {
                var text = children.selftext;
                document.getElementById("desc").innerHTML = text;
            } else {
                var url = children.url;
                var isImage = checkUrl(url);

                var link;
                if (isImage)
                    link = document.getElementById("img");
                else
                    link = document.getElementById("desc-bis");

                link.src = url;
                link.className = "show";
            }
        });
    }

    WinJS.UI.Pages.define("/pages/content/content.html", {
        ready: function (element, options) {
            getContent(options.link);

            WinJS.Binding.processAll(document.querySelector("body"), options);

            Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView().ondatarequested = function (e) {
                e.request.data.properties.title = "RedditRSS !";
                e.request.data.setUri(new Windows.Foundation.Uri(options.link));
            };
        }
    });
})();
