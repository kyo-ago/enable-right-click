(function () {
    function Mutation (callback) {
        this.isCalled = false;
        this.isUnbound = false;
        this.callback = callback;
        this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
        this.bind();
    }
    Mutation.prototype.bind = function () {
        this.events.forEach(function (name) {
            document.addEventListener(name, this, true);
        }.bind(this));
    };
    Mutation.prototype.handleEvent = function () {
        this.isCalled = true;
        this.unbind();
    };
    Mutation.prototype.unbind = function () {
        if (this.isUnbound) {
            return;
        }
        this.events.forEach(function (name) {
            document.removeEventListener(name, this, true);
        }.bind(this));
        this.isUnbound = true;
    };

    function Synchronizetion () {
        this._setTimeout = window.setTimeout;
        this._requestAnimationFrame = window.requestAnimationFrame;
        this._Promise = window.Promise;
        this.isRestoration = false;
        this.calledPromise = false;
        window.requestAnimationFrame = window.setTimeout = function (callback) {
            callback();
        };
        window.Promise = function () {
            this._Promise.apply(this, arguments);
            this.calledPromise = true;
            window.Promise = this._Promise;
        };
    }
    Synchronizetion.prototype.restore = function () {
        if (this.isRestoration) {
            return;
        }
        window.setTimeout = this._setTimeout;
        window.requestAnimationFrame = this._requestAnimationFrame;
        if (!this.calledPromise) {
            window.Promise = this._Promise;
        }
        this.isRestoration = true;
    };

    function EventHandler (event) {
        this.event = event;
        this.contextmenuEvent = this.createEvent(this.event.type);
        this.mouseupEvent = this.createEvent('mouseup');
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
    }
    EventHandler.prototype.createEvent = function (type) {
        var target = this.event.target;
        var event = target.ownerDocument.createEvent('MouseEvents');
        event.initMouseEvent(type, this.event.bubbles, this.event.cancelable,
            target.ownerDocument.defaultView, this.event.detail,
            this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
            this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
            this.event.button, this.event.relatedTarget
        );
        return event;
    };
    EventHandler.prototype.fire = function () {
        var target = this.event.target;
        var contextmenuHandler = function (event) {
            this.isCanceled = event.defaultPrevented;
            event.preventDefault();
        }.bind(this);
        window.addEventListener(this.event.type, contextmenuHandler, false);
        target.dispatchEvent(this.contextmenuEvent);
        window.removeEventListener(this.event.type, contextmenuHandler, false);
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
        target.dispatchEvent(this.mouseupEvent);
    };

    var disableRightClick = false;
    window.addEventListener('message', function (event) {
        if (!event.data || event.data.type !== 'enable-right-click') {
            return;
        }
        disableRightClick = !!event.data.disableRightClick;
        event.stopPropagation();
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener('contextmenu', handleEvent, true);
    function handleEvent (event) {
        if (disableRightClick) {
            return;
        }

        event.stopPropagation();
        event.stopImmediatePropagation();
        var handler = new EventHandler(event);

        window.removeEventListener(event.type, handleEvent, true);
        var sync = new Synchronizetion();
        var mutation = new Mutation(function () {
            sync.restore();
        });

        var _alert = window.alert;
        window.alert = function () {};
        handler.fire();
        window.alert = _alert;

        sync.restore();
        mutation.unbind();
        window.addEventListener(event.type, handleEvent, true);

        if (handler.isCanceled && (mutation.isCalled || sync.calledPromise)) {
            event.preventDefault();
        }
    }
})();
