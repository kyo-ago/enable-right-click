var disableSettingsRepository = new DisableSettingsRepository();
disableSettingsRepository.get().then(function (disableSettings) {
    chrome.storage.onChanged.addListener(() => {
        disableSettingsRepository.get().then((newDisableSettings) => {
            disableSettings = newDisableSettings;
        });
    });
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
        if (disableSettings.contains(url.href)) {
            chrome.browserAction.setBadgeText({
                'tabId': tab.id,
                'text': 'Disable'
            });
            chrome.tabs.executeScript(tab.id, {
                'code': 'window.postWebAccessibleResourceMessage && window.postWebAccessibleResourceMessage(true);',
                'allFrames' : true
            });
        } else {
            chrome.browserAction.setBadgeText({
                'tabId': tab.id,
                'text': ''
            });
            chrome.tabs.executeScript(tab.id, {
                'code': 'window.postWebAccessibleResourceMessage && window.postWebAccessibleResourceMessage(false);',
                'allFrames' : true
            });
        }
    }
}).catch(console.error.bind(console));
