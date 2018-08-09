export const EVENTOBJ = {
    // Clipboard Events
    "copy": "onCopy", "cut": "onCut", "paste": "onPaste",
    // Composition Events
    "compositionend": "onCompositionEnd", "compositionstart": "onCompositionStart", "compositionupdate": "onCompositionUpdate",
    // Keyboard Events
    "keydown": "onKeyDown", "keypress": "onKeyPress", "keyup": "onKeyUp",
    // Focus Events
    "focus": "onFocus", "blur": "onBlur",
    // Form Events
    "change": "onChange", "beforeinput": "onBeforeInput", "input": "onInput", "submit": "onSubmit",
    // Mouse Events
    "click": "onClick", "contextmenu": "onContextMenu", "dbclick": "onDoubleClick", "drag": "onDrag", "dragend": "onDragEnd", "dragenter": "onDragEnter", "dragexit": "onDragExit",
    "dragleave": "onDragLeave", "dragover": "onDragOver", "dragstart": "onDragStart", "drop": "onDrop", "mousedown": "onMouseDown",
    // onMouseEnter 和 onMouseLeave 事件由失去焦点的元素到正在输入的元素传播，并不是普通的冒泡，也没有捕获阶段。
    "mouseenter": "onMouseEnter", "mouseleave": "onMouseLeave",
    "mousemove": "onMouseMove", "mouseout": "onMouseOut", "mouseover": "onMouseOver", "mouseup": "onMouseUp",
    // Selection Events
    "select": "onNativeSelect",
    "selectionchange": "onSelect",
    // Touch Events
    "touchcancel": "onTouchCancel", "touchend": "onTouchEnd", "touchmove": "onTouchMove", "touchstart": "onTouchStart",
    // UI Events
    "scroll": "onScroll",
    // Wheel Events
    "wheel": "onWheel",
    // Media Events
    "abort": "onAbort", "canplay": "onCanPlay", "canplaythrough": "onCanPlayThrough", "durationchange": "onDurationChange", "emptied": "onEmptied", "encrypted": "onEncrypted",
    "ended": "onEnded", "error": "onError", "loadeddata": "onLoadedData", "loadedmetadata": "onLoadedMetadata", "loadstart": "onLoadStart", "pause": "onPause", "play": "onPlay",
    "playing": "onPlaying", "progress": "onProgress", "ratechange": "onRateChange", "seeked": "onSeeked", "seeking": "onSeeking", "stalled": "onStalled", "suspend": "onSuspend",
    "timeupdate": "onTimeUpdate", "volumechange": "onVolumeChange", "waiting": "onWaiting",
    // Image Events
    "load": "onLoad",// "error": "onError",
    // Animation Events
    "animationstart": "onAnimationStart", "animationend": "onAnimationEnd", "animationiteration": "onAnimationIteration",
    // Transition Events
    "transitionend": "onTransitionEnd",
    // Other Events
    "toggle": "onToggle"
}

export const OTHER_EVENT = {
    "onMouseEnter": "mouseenter", "onMouseLeave": "mouseleave",
}

// export function eventFormat(e) {
//     e.persist = function () { return e; };
//     e.nativeEvent = e;
//     e.stop = false;
//     // const old_stopPropagation = e.stopPropagation;
//     e.stopPropagation = function () {
//         e.stop = true;
//     }
//     // e.nativeEvent.stopPropagation = old_stopPropagation;
//     return e;
// }

let can_trigger_select = false;
let wait_trigger_select = false;
let is_trigger_selectionchange_event = false;

function dispatchEvent(e: any, b?) {

    let syntheticEvent;
    if (b) {
        syntheticEvent = e;
    } else {
        syntheticEvent = new SyntheticEvent(e);
    }

    if (syntheticEvent.type === 'keydown' || syntheticEvent.type === 'mouseup') {
        can_trigger_select = true;
    }
    if (syntheticEvent.type === 'keyup') {
        can_trigger_select = false;
    }
    if (syntheticEvent.type === 'mousedown') {
        wait_trigger_select = true;
    }
    if (syntheticEvent.changetype || syntheticEvent.type === 'selectionchange') {
        if (can_trigger_select) {
            can_trigger_select = false;
            is_trigger_selectionchange_event = false;
            wait_trigger_select = false;
        } else {
            if (wait_trigger_select) {
                is_trigger_selectionchange_event = true;
            }
            return;
        }
    }
    let type = EVENTOBJ[syntheticEvent.changetype || syntheticEvent.type];

    let node: any = syntheticEvent.target;
    if (syntheticEvent.type === 'selectionchange') {
        if (document.activeElement) {
            node = document.activeElement;
        } else {
            let selection = window.getSelection()
            node = selection.baseNode;
        }
        syntheticEvent.target = node;
    }

    if ((node.tagName === 'INPUT' && node.type === 'text') || node.tagName === 'textarea') {
        if (syntheticEvent.type === 'change') {
            return;
        }
        if (type === 'onInput') {
            type = 'onChange';
        }
    }

    if (EVENT_LISTENER[type]) {
        const path = [];
        while (node) {
            path.push(node);
            node = node.parentNode;
        }
        // let event = eventFormat(syntheticEvent);
        // 模拟捕获
        let captureType = type + 'Capture'

        syntheticEvent.reactEventType = captureType;
        for (let i = path.length - 1; i >= 0; i--) {
            if (syntheticEvent.stop) { break; }
            let node = path[i];
            let captureType = type + 'Capture'
            syntheticEvent.currentTarget = node;
            if (i === 0) {
                syntheticEvent.eventPhase = 2;
            } else {
                syntheticEvent.eventPhase = 1;
            }
            node.__listeners__ && node.__listeners__[captureType] && node.__listeners__[captureType](syntheticEvent);
        }
        // 模拟冒泡
        syntheticEvent.reactEventType = type;
        for (let i = 0; i < path.length; i++) {
            if (syntheticEvent.stop) { break; }
            let node = path[i];
            syntheticEvent.currentTarget = node;
            if (i === 0) {
                syntheticEvent.eventPhase = 2;
            } else {
                syntheticEvent.eventPhase = 3;
            }
            node.__listeners__ && node.__listeners__[type] && node.__listeners__[type](syntheticEvent);
        }

    }
    if (syntheticEvent.type === 'keydown' && syntheticEvent.code === 'Backspace' && !b) {
        syntheticEvent.changetype = 'selectionchange';
        dispatchEvent(syntheticEvent, true)
    }
    if (syntheticEvent.type === 'mouseup' && !b && is_trigger_selectionchange_event) {
        syntheticEvent.changetype = 'selectionchange';
        dispatchEvent(syntheticEvent, true)
    }
}
const Reverse_EVENTOBJ = {};
const EVENT_LISTENER = {};


for (let x in EVENTOBJ) {
    Reverse_EVENTOBJ[EVENTOBJ[x]] = x;
    EVENT_LISTENER[EVENTOBJ[x]] = false;
    if (!(EVENTOBJ[x] in OTHER_EVENT)) {
        document.addEventListener(x, dispatchEvent, true)
    }
}
export { Reverse_EVENTOBJ, EVENT_LISTENER };

export class SyntheticEvent {
    nativeEvent;
    target;
    type;
    changetype;
    reactEventType;
    eventPhase = 0;
    code;
    defaultPrevented = false;
    currentTarget;
    constructor(e) {
        this.nativeEvent = e;
        for (let x in e) {
            if (!(x === 'stopPropagation' || x === 'preventDefault' || x === 'eventPhase' || x === 'srcElement')) {
                this[x] = e[x];
            }

        }
        this.eventPhase = 0;
    }
    persist() {
        return Object.assign({}, this);
    };
    stop = false;
    // const old_stopPropagation = e.stopPropagation;
    stopPropagation() {

        this.stop = true;
    }
    preventDefault() {
        this.defaultPrevented = true;
        var event = this.nativeEvent;
        if (!event) {
            return;
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;

    }
}


