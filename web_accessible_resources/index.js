(function () {
    window.addEventListener('contextmenu', checkContextmenu, true);
    function checkContextmenu () {
        var stub = function (evn) {
            stub.defaultPrevented = evn.defaultPrevented;
            stub.called = true;
        };
        window.addEventListener('contextmenu', stub, false);
        setTimeout(function () {
            window.removeEventListener('contextmenu', stub, false);
            window.removeEventListener('contextmenu', checkContextmenu, true);
            if (stub.called && !stub.defaultPrevented) {
                return;
            }
            createConfirm();
        });
    }
    function createConfirm () {
        document.body.insertAdjacentHTML('BeforeEnd', '<div style="position: absolute; top: 0; right: 0; border: solid #555 2px; margin: 3px; padding: 3px; background: rgba(200,200,200,0.6);"><label>' + chrome.i18n.getMessage('enable_contextmenu') + '<input type="checkbox"></label></div>');
        document.body.lastChild.querySelector('input').addEventListener('change', toggleContextmenu);
    }
    function toggleContextmenu () {
        window.removeEventListener('contextmenu', stopPropagation, true);
        if (this.checked) {
            window.addEventListener('contextmenu', stopPropagation, true);
        }
    }
    function stopPropagation (e) {
        e.stopPropagation();
    }
})();
