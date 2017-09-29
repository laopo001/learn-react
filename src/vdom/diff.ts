/**
 * @author dadigua
 */
import { KEY } from '../config/';
import { removeNode, setAccessor } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';


export const mounts = [];
let diffCount = 0;
let isSvgMode = false;
let hydrating = false;

export function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    if (!diffCount++) {
        isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
        hydrating = dom != null && !(KEY in dom);
    }
    let res = _diff(dom, vnode, context, mountAll, componentRoot);
    if (parent && res.parentNode !== parent) { parent.appendChild(res); }
    if (!--diffCount) {
        hydrating = false;
        if (!componentRoot) { }
    }
}

function _diff(dom, vnode, context, mountAll, componentRoot?) {
    let out = dom, prevSvgMode = isSvgMode;
    if (vnode == null || typeof vnode === 'boolean') { vnode = ''; }

    if (typeof vnode === 'string' || typeof vnode === 'number') {
        if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
            if (dom.nodeValue !== vnode) {
                dom.nodeValue = vnode;
            }
        } else {
            out = document.createTextNode(vnode as string);
            if (dom) {
                if (dom.parentNode) { dom.parentNode.replaceChild(out, dom); }
                recollectNodeTree(dom, true);
            }
        }
        out[KEY] = true;
        return out;
    }
    let vnodeName = vnode.nodeName;
    if (typeof vnodeName === 'function') {
        return buildComponentFromVNode(dom, vnode, context, mountAll);
    }
    isSvgMode = vnodeName === 'svg' ? true : vnodeName = 'foreignObject' ? false : isSvgMode;
    vnodeName = String(vnodeName);
    if (!dom || isNamedNode(dom, vnodeName)) {
        out = createNode(vnodeName, isSvgMode);
        if (dom) {
            while (dom.firstChild) out.appendChild(dom.firstChild);
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
            recollectNodeTree(dom, true);
        }
    }
    let fc = out.firstChild, props = out[KEY], vchildren = vnode.children;

    if (props == null) {
        props = out[KEY] = {};
        for (let a = out.attributes, i = a.length; i--;) props[a[i].name] = a[i].value;
    }

    if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc.splitText !== undefined && fc.nextSibling == null) {
        if (fc.nodeValue !== vchildren[0]) {
            fc.nodeValue = vchildren[0];
        }
    } else if (vchildren && vchildren.length || fc != null) {
        innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
    }
    diffAttributes(out, vnode.attributes, props);
    isSvgMode = prevSvgMode;
    return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    let originalChildren = dom.children,
        children = [],
        keyed = {},
        keyedLen = 0,
        min = 0,
        len = originalChildren.length,
        childrenLen = 0,
        vLen = vchildren ? vchildren.length : 0,
        j, c, f, vchild, child;
    if (len !== 0) {
        for (let i = 0; i < len; i++) {
            let child = originalChildren[i];
            let props = child[KEY];
            let key = vLen && props ? child._component ? child._component.__key : props.key : null;
            if (key != null) {
                keyedLen++;
                keyed[key] = child;
            } else if (props || (child.splitText !== undefined ? (isHydrating ? child.nodeValue.trim() : true) : isHydrating)) {
                children[childrenLen++] = child;
            }
        }
    }
    if (vLen !== 0) {
        for (let i = 0; i < vLen; i++) {
            vchild = vchildren[i];
            child = null;
            let key = vchild.key;
            if (key != null) {
                if (keyedLen && keyed[key] !== undefined) {
                    child = keyed[key];
                    keyed[key] = undefined;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) {
                for (j = min; j < childrenLen; j++) {
                    if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            child = _diff(child, vchild, context, mountAll);
            f = originalChildren[i];
            if (child && child !== dom && child !== f) {
                if (f == null) {
                    dom.appendChild(child);
                } else if (child === f.nextSibling) {
                    removeNode(f);
                } else {
                    dom.insertBefore(child, f);
                }
            }
        }
    }

    if (keyedLen) {
        for (let i in keyed) if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    }

    while (min < childrenLen) {
        if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
    }
}

export function flushMounts() {
    let c;
    while (c = mounts.pop()) {
        if (c.componentDidMount) {
            c.componentDidMount();
        }
    }
}

export function recollectNodeTree(node, unmountOnly) {
    let component = node._component;
    if (component) {
        unmountComponent(component);
    } else {
        if (node[KEY] != null && node[KEY].ref) {
            node[KEY].ref(null);
        }
        if (unmountOnly === false || node[KEY] == null) {
            removeNode(node);
        }
        removeChildren(node);
    }
}

export function removeChildren(node) {
    node = node.lastChild;
    while (node) {
        let next = node.previousSibling;
        recollectNodeTree(node, true);
        node = next;
    }
}

function diffAttributes(dom, attrs, old) {
    let name;
    for (name in old) {
        if (!(attrs && attrs[name] != null) && old[name] != null) {
            setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
        }
    }
    for (name in attrs) {
        if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
            setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
        }
    }
}