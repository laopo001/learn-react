/**
 * @author dadigua
 */
import { KEY } from '../config/';
import { removeNode, setAccessor } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { buildComponentFromVNode, unmountComponent } from './compontentUtil';
import { VNode } from '../vnode';

export const mounts = [];
let diffCount = 0;
let isSvgMode = false;
let hydrating = false;

export function diff(vnode: VNode, dom: HTMLElement, context, parent) {
    let ret = _diff(vnode, dom, context);
    if (parent) parent.appendChild(ret);
}

function _diff(vnode: any | VNode, dom, context) {
    debugger;
    let out = dom;
    if (vnode == null || typeof vnode === 'boolean') vnode = '';
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        if (dom && dom.splitText !== undefined) {
            if (dom.nodeValue !== vnode) {
                dom.nodeValue = vnode;
            }
        } else {
            out = document.createTextNode(vnode as string);
            if (dom) {
                if (dom.parentNode) dom.replaceChild.appendChild(out, dom);
            }
        }

        out[KEY] = true;
        return out;
    }

    for (let i = 0; i < vnode.children.length; i++) {
        out.appendChild(_diff(vnode.children[i], dom.childNodes[i], context));
    }
    let vnodeName = vnode.name;
    if (typeof vnodeName === 'string') {
        out 
    }
    if (typeof vnodeName === 'function') {
        return buildComponentFromVNode(vnode, dom, context);
    }
    return out;
}
