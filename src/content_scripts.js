(function () {
    chrome.storage.sync.get('disableSettings', function (value) {
        var disableSettings = value['disableSettings'] || [
            {
                'url': '*.google.com'
            },
            {
                'url': '*.live.com'
            }
        ];
        var match = disableSettings.filter(function (current) {
            var re = new RegExp(current['url'].replace(/([.?+^$[\]\\(){}|\/-])/g, "\\$1").replace(/\*/g, '.*'));
            return re.test(location.host);
        });
        if (match.length) {
        	return;
        }
        var scp = document.createElement('script');
        scp.src = chrome.extension.getURL('web_accessible_resources/index.js');
        document.body.appendChild(scp);
    });
})();