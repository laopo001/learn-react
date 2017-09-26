/**
 * @author dadigua
 */
import { KEY } from '../config/';
import { removeNode } from './dom';
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

function _diff(dom, vnode, context, mountAll, componentRoot) {
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
