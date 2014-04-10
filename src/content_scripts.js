(function (init_) {
    var init = setTimeout.bind(this, init_);
    if (document.readyState !== 'complete') {
        window.addEventListener('load', init, true);
    } else {
        init();
    }
})(function () {
    var scp = document.createElement('script');
    scp.src = chrome.extension.getURL('web_accessible_resources/index.js');
    document.body.appendChild(scp);
});