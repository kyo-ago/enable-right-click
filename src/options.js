var enableClickApp = angular.module('EnableClickApp', []).controller('EnableClick', function ($scope) {
    $scope.disableSettings = [];
    var disableSettingsRepository = new DisableSettingsRepository();
    disableSettingsRepository.get().then(function (disableSettings) {
        $scope.disableSettings = disableSettings.getList();
        $scope.$apply();
    }).catch(console.error.bind(console));

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
        $scope.disableSettings.push('');
    };
    function save () {
        var disableSettings = new DisableSettings();
        $scope.disableSettings.filter(function (cur) {
            return cur;
        }).forEach(disableSettings.add.bind(disableSettings));
        disableSettingsRepository.save(disableSettings);
    }
});