(function () {
    var scp = document.createElement('script');
    scp.src = chrome.extension.getURL('web_accessible_resources/index.js');
    document.body.appendChild(scp);
})();