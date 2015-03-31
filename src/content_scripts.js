(function () {
    if ((/(\.google\.com|\.live\.com)$/i).test(location.host)) {
        return;
    }
    var scp = document.createElement('script');
    scp.src = chrome.extension.getURL('web_accessible_resources/index.js');
    document.body.appendChild(scp);
})();