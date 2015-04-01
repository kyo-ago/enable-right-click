var enableClickApp = angular.module('EnableClickApp', []).controller('EnableClick', function ($scope) {
    $scope.disableSettings = [];
    $scope.delete = function (target) {
        $scope.disableSettings = $scope.disableSettings.filter(function (current) {
            return target !== current;
        });
        save();
    };
    $scope.change = function (target) {
        save();
    };
    $scope.add = function (target) {
        $scope.disableSettings.push({});
    };
    function save () {
        chrome.storage.sync.set({
            'disableSettings' : $scope.disableSettings.filter(function (current) {
                return current['url'];
            }).map(function (current) {
                delete current['$$hashKey'];
                return current;
            })
        });
    }
    chrome.storage.sync.get('disableSettings', function (value) {
        $scope.disableSettings = value['disableSettings'] || [
            {
                'url': '*.google.com'
            },
            {
                'url': '*.live.com'
            }
        ];
        $scope.$apply();
    });
});