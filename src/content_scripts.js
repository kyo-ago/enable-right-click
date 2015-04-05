var scp = document.createElement('script');
scp.src = chrome.extension.getURL('web_accessible_resources/index.js');
document.body.appendChild(scp);
function executeScript (script) {
    var scp = document.createElement('script');
    scp.textContent = script;
    document.body.appendChild(scp);
}
