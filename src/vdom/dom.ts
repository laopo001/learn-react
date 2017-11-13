/**
 * @author dadigua
 */
import { IS_NON_DIMENSIONAL } from '../config/';
const options: any = {};

export function removeNode(node) {
    let parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
}


export function setAttribute(dom, name, value, oldvalue) {
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
            if (typeof oldvalue !== 'string') {
                for (let i in oldvalue) if (!(i in value)) dom.style[i] = '';
            }
            for (let i in value) {
                dom.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? (value[i] + 'px') : value[i];
            }
        }
    } else if (name === 'dangerouslySetInnerHTML') {
        if (value) dom.innerHTML = value.__html || '';
    } else if (name[0] === 'o' && name[1] === 'n') {
        let useCapture = name !== (name = name.replace(/Capture$/, ''));
        name = name.toLowerCase().substring(2);
        if (value) {
            if (!oldvalue) dom.addEventListener(name, eventProxy, useCapture);
        }
        else {
            dom.removeEventListener(name, eventProxy, useCapture);
        }
        (dom._listeners || (dom._listeners = {}))[name] = value;
    } else if (name in dom) {
        try {
            dom[name] = value || '';
            if (value == null || value === false) dom.removeAttribute(name);
        } catch (e) {
            dom.setAttribute(name, value);
        }
    } else {
        dom.setAttribute(name, value);
    }
}


function eventProxy(e) {
    return this._listeners[e.type](options.event && options.event(e) || e);
}

export function insertAfter(newEl, targetEl) {
    const parentEl = targetEl.parentNode;

    if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}