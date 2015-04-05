var disableSettingsRepository = new DisableSettingsRepository();
disableSettingsRepository.get().then(function (disableSettings) {
    chrome.browserAction.onClicked.addListener(function (tab) {
        isActiveTab(tab.id).then(function (tab) {
            if (!tab) {
                return;
            }
            var url = new URL(tab.url);
            if (disableSettings.contains(url.host)) {
                disableSettings.remove(url.host);
            } else {
                disableSettings.add(url.host);
            }
            disableSettingsRepository.save(disableSettings).then(function () {
                executeTargetURL(tab);
            });
        });
    });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        isActiveTab(tabId).then(function (tab) {
            if (!tab) {
                return;
            }
            executeTargetURL(tab);
        });
    });
    chrome.tabs.onActivated.addListener(function (activeInfo) {
        isActiveTab(activeInfo.tabId).then(function (tab) {
            if (!tab) {
                return;
            }
            executeTargetURL(tab);
        });
    });
    function isActiveTab (tabId) {
        return new Promise(function (resolve, reject) {
            chrome.tabs.get(tabId, function (tab) {
                if (!tab.active) {
                    return resolve(false);
                }
                if (!tab.url) {
                    return resolve(false);
                }
                resolve(tab);
            });
        });
    }
    function executeTargetURL (tab) {
        if (!(/^https?:\/\//).test(tab.url)) {
            chrome.browserAction.setBadgeText({
                'text': ''
            });
            return;
        }
        var url = new URL(tab.url);
        if (disableSettings.contains(url.host)) {
            chrome.browserAction.setBadgeText({
                'text': 'Disable'
            });
            chrome.tabs.executeScript(tab.id, {
                'code': 'window.executeScript && window.executeScript("window.disableRightClick = true;");',
                'allFrames' : true
            });
        } else {
            chrome.browserAction.setBadgeText({
                'text': ''
            });
            chrome.tabs.executeScript(tab.id, {
                'code': 'window.executeScript && window.executeScript("window.disableRightClick = false;");',
                'allFrames' : true
            });
        }
    }
}).catch(console.error.bind(console));
