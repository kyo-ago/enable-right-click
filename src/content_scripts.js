(function () {
    window.addEventListener('contextmenu', handleEvent, true);
    function handleEvent (event) {
        event.stopPropagation();
        window.removeEventListener(event.type, handleEvent, true);
        fileEvent(event.type, event);
        fileEvent('mouseup', event);
        window.addEventListener(event.type, handleEvent, true);
    }
    function fileEvent (type, event) {
        var target = event.target;
        var evt = target.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent(type, event.bubbles, event.cancelable,
            target.ownerDocument.defaultView, event.detail,
            event.screenX, event.screenY, event.clientX, event.clientY,
            event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
            event.button, event.relatedTarget
        );
        target.dispatchEvent(evt);
    }
})();
