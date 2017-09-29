/**
 * @author dadigua
 */
import { IS_NON_DIMENSIONAL } from '../config/';
const options: any = {};

export function removeNode(node) {
    let parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
}

export function setAccessor(node, name, old, value, isSvg) {
    if (name === 'className') name = 'class';


    if (name === 'key') {
        // ignore
    }
    else if (name === 'ref') {
        if (old) old(null);
        if (value) value(node);
    }
    else if (name === 'class' && !isSvg) {
        node.className = value || '';
    }
    else if (name === 'style') {
        if (!value || typeof value === 'string' || typeof old === 'string') {
            node.style.cssText = value || '';
        }
        if (value && typeof value === 'object') {
            if (typeof old !== 'string') {
                for (let i in old) if (!(i in value)) node.style[i] = '';
            }
            for (let i in value) {
                node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? (value[i] + 'px') : value[i];
            }
        }
    }
    else if (name === 'dangerouslySetInnerHTML') {
        if (value) node.innerHTML = value.__html || '';
    }
    else if (name[0] === 'o' && name[1] === 'n') {
        let useCapture = name !== (name = name.replace(/Capture$/, ''));
        name = name.toLowerCase().substring(2);
        if (value) {
            if (!old) node.addEventListener(name, eventProxy, useCapture);
        }
        else {
            node.removeEventListener(name, eventProxy, useCapture);
        }
        (node._listeners || (node._listeners = {}))[name] = value;
    }
    else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
        setProperty(node, name, value == null ? '' : value);
        if (value == null || value === false) node.removeAttribute(name);
    }
    else {
        let ns = isSvg && (name !== (name = name.replace(/^xlink\:?/, '')));
        if (value == null || value === false) {
            if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
            else node.removeAttribute(name);
        }
        else if (typeof value !== 'function') {
            if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
            else node.setAttribute(name, value);
        }
    }
}

function setProperty(node, name, value) {
    try {
        node[name] = value;
    } catch (e) { }
}

function eventProxy(e) {
    return this._listeners[e.type](options.event && options.event(e) || e);
}