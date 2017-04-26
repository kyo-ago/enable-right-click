var enableClickApp = angular.module('EnableClickApp', []).controller('EnableClick', function ($scope) {
    $scope.disableSettings = [];
    var disableSettingsRepository = new DisableSettingsRepository();
    disableSettingsRepository.get().then(function (disableSettings) {
        $scope.disableSettings = disableSettings.getList();
        $scope.$apply();
    }).catch(console.error.bind(console));

    $scope.delete = function (index) {
        $scope.disableSettings.splice(index, 1);
        save();
    };
    $scope.change = function (index, target) {
        $scope.disableSettings[index] = target;
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