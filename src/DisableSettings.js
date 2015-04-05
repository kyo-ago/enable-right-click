function DisableSettings (data) {
    this.data = data || [];
}
DisableSettings.prototype.contains = function (data) {
    return this.data.filter(function (cur) {
        return cur['regexp'].test(data);
    }).length;
};
DisableSettings.prototype.add = function (data) {
    if (this.contains(data)) {
        return;
    }
    this.data.push({
        'regexp': new RegExp(data.replace(/\W/g, '\\$&').replace(/\\\*/g, '.*')),
        'data': data
    });
};
DisableSettings.prototype.remove = function (data) {
    this.data = this.data.filter(function (cur) {
        return !cur['regexp'].test(data);
    });
};
DisableSettings.prototype.getList = function () {
    return this.data.map(function (cur) {
        return cur['data'];
    });
};

function DisableSettingsRepository () {}
DisableSettingsRepository.prototype.get = function () {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get('disableSettings', function (data) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError.message);
            }
            var hosts = data['disableSettings'] || [
                '*.google.com',
                '*.live.com'
            ];
            var disableSettings = new DisableSettings();
            hosts.forEach(disableSettings.add.bind(disableSettings));
            resolve(disableSettings);
        });
    });
};
DisableSettingsRepository.prototype.save = function (disableSettings) {
    return new Promise(function (resolve, reject) {
        var data = {
            'disableSettings' : disableSettings.getList()
        };
        chrome.storage.sync.set(data, function () {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError.message);
            }
            resolve();
        });
    });
};
