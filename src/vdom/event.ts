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

const Reverse_EVENTOBJ = {};

export function eventFormat(e) {
    e.persist = function () { return e; };
    e.nativeEvent = e;
    e.stop = false;
    // const old_stopPropagation = e.stopPropagation;
    e.stopPropagation = function () {
        e.stop = true;
    }
    // e.nativeEvent.stopPropagation = old_stopPropagation;
    return e;
}

function func(e: any) {
    // if (e.type === 'selectionchange') {
    //     console.dir(e.type)
    // }

    let type = EVENTOBJ[e.type];
    let node: any = e.target;
    if (type === 'onSelect') {
        if (document.activeElement) {
            node = document.activeElement;
        } else {
            let selection = window.getSelection()
            node = selection.baseNode;
        }
        // e.target = node;
    }

    if ((node.tagName === 'INPUT' && node.type === 'text') || node.tagName === 'textarea') {
        if (e.type === 'change') {
            return;
        }
        // if (e.type === 'mouseup') {
        //     type = 'onSelect';
        // }
        if (type === 'onInput') {
            type = 'onChange';
        }
    }

    const path = [];
    while (node) {
        path.push(node);
        // node.__listeners__ && node.__listeners__[type] && node.__listeners__[type](eventFormat(e) || e);
        node = node.parentNode;
    }
    let event = eventFormat(e);
    // 模拟捕获
    for (let i = path.length - 1; i >= 0; i--) {
        if (event.stop) { break; }
        let node = path[i];
        let captureType = type + 'Capture'
        e.reactEventType = captureType;
        node.__listeners__ && node.__listeners__[captureType] && node.__listeners__[captureType](event);
    }
    // 模拟冒泡
    for (let i = 0; i < path.length; i++) {
        if (event.stop) { break; }
        let node = path[i];
        e.reactEventType = type;
        node.__listeners__ && node.__listeners__[type] && node.__listeners__[type](event);
    }
}

for (let x in EVENTOBJ) {
    Reverse_EVENTOBJ[EVENTOBJ[x]] = x;
    if (!(EVENTOBJ[x] in OTHER_EVENT)) {
        document.addEventListener(x, func, true)
    }
}



export { Reverse_EVENTOBJ };