/**
 * @author dadigua
 */
import { IS_NON_DIMENSIONAL } from '../config/';
import { EVENTOBJ, OTHER_EVENT, Reverse_EVENTOBJ, SyntheticEvent } from './event';

const options: any = {
    event(e) {
        e.persist = Object;
        e.nativeEvent = e;
        return e;
    }

};
const events = {
    focus: 'focusin',
    blur: 'focusout'
};
export function removeNode(node) {
    let parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
}


export function setAttribute(dom, name, value, prevProps, nextProps) {
    let oldvalue = prevProps[name];
    if (name === 'className') name = 'class';
    if (name === 'key') {
        dom.setAttribute(name, value);
    }
    else if (name === 'ref') {
        if (typeof value === 'function') {
            value(dom);
        }
    } else if (name === 'class') {
        dom.className = value || '';
    } else if (name === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        }
        if (value && typeof value === 'object') {
            const keys = {};
            if (typeof oldvalue === 'object') {
                for (let key in oldvalue) {
                    if (key in value) {
                        if (oldvalue[key] === value[key]) keys[key] = true;
                    } else {
                        dom.style[key] = '';
                    }
                }
            }
            for (let key in value) {
                if (keys[key] !== true) {
                    dom.style[key] = typeof value[key] === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? (value[key] + 'px') : value[key];
                }
            }
        }
    } else if (name === 'dangerouslySetInnerHTML') {
        if (value) dom.innerHTML = value.__html || '';
    } else if (name[0] === 'o' && name[1] === 'n') {
        // if (!(name in Reverse_EVENTOBJ)) {
        //     // console.error('未知的事件');
        //     return;
        // }
        if (name in OTHER_EVENT) {
            // name = name.replace(/Capture$/, '')
            let useCapture = false;
            // let domName = name.toLowerCase().substring(2);
            let domName = Reverse_EVENTOBJ[name];
            if (value) {
                if (!oldvalue) {
                    // if ((dom.nodeName === 'INPUT' || dom.nodeName === 'TEXTAREA') && name === 'change') {
                    //     name = 'input';
                    // }
                    // if (name in events && !useCapture) {
                    //     name = events[name];
                    // }
                    dom.addEventListener(domName, eventProxy, useCapture);
                }

            }
            else {
                dom.removeEventListener(domName, eventProxy, useCapture);
            }

        }
        (dom.__listeners__ || (dom.__listeners__ = {}))[name] = value;
    } else if (name in dom) {
        try {
            // 有些属性不能设置到dom上。
            dom[name] = value || '';
        } catch (e) {
            // dom.setAttribute(name, value);
        }
    } else {
        if (value == null || value === false) { dom.removeAttribute(name); }
        else {
            dom.setAttribute(name, value);
        }

    }
}


function eventProxy(e) {
    const type = EVENTOBJ[e.type];
    return this.__listeners__[type](new SyntheticEvent(e));
}

export function insertAfter(newEl, targetEl, out?) {
    const parentEl = out == null ? targetEl.parentNode : out;

    if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}