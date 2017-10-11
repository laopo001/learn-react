/**
 * @author dadigua
 */
import { KEY, RenderMode } from '../config/';
import { removeNode, setAttribute } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { buildComponentFromVNode, unmountComponent, renderComponent, callDidMount } from './componentUtil';
import { VNode } from '../vnode';

export const mounts = [];
let diffCount = 0;
let isSvgMode = false;
let hydrating = false;

export function create(vnode: VNode, context, parent) {
    let ret = diff(vnode, null, context);
    if (parent) parent.appendChild(ret);
    callDidMount(true);
}

export function diff(vnode: any | VNode, dom, context) {
    let out = dom;
    if (vnode instanceof VNode) {

        if (typeof vnode.name === 'string') {
            if (!dom || !vnode.isSameName(dom)) {
                out = vnode.createDom();
                if (dom) {
                    recollectNodeTree(dom);
                }
            }
            if (vnode.children.length > 0) {
                diffChild(vnode.children, out.childNodes, context, out);
            }
            diffProps(vnode.props, out);
            out.oldVNode = vnode;
        } else if (typeof vnode.name === 'function') {
            out = buildComponentFromVNode(vnode, dom, context);
            out.oldVNode = vnode;
        }
    } else {
        if (vnode == null || typeof vnode === 'boolean') vnode = '';
        if (typeof vnode === 'string' || typeof vnode === 'number') {
            if (dom && dom.splitText !== undefined) {
                if (dom.nodeValue !== vnode) {
                    dom.nodeValue = vnode;
                }
            } else {
                out = document.createTextNode(vnode as string);
                // if (dom) {
                //     if (dom.parentNode) dom.replaceChild(out, dom);
                // }
            }
            out[KEY] = true;
        }
    }
    return out;
}


function diffChild(vnodeChildren, domChildren, context, out) {

    let keyObj = {}, keyObjLen = 0;
    for (let i = 0; i < vnodeChildren.length; i++) {
        let key = vnodeChildren[i].key;
        if (key != null) {
            keyObj[key] = domChildren[i];
            keyObjLen++;
        }
    }
    for (let i = 0; i < vnodeChildren.length; i++) {
        let child = vnodeChildren[i];
        let childDOM = domChildren === undefined ? undefined : domChildren[i];
        if (child.key != null) {
            if (keyObj[child.key] !== undefined) {
                childDOM = keyObj[child.key];
                keyObj[child.key] = undefined;
            }
        }
        let newChildDOM = diff(child, childDOM, context);
        if (childDOM == null) {
            out.appendChild(newChildDOM);
            if (child instanceof VNode && typeof child.name === 'function') {
                callDidMount(false);
            }
        } else if (newChildDOM !== childDOM) {
            if (!childDOM.markOut) {
                out.insertBefore(newChildDOM, childDOM);
                callDidMount(false);
            }
        }

        // if (childDOM == null) {
        //     domChildren.appendChild(newChildDOM);
        // } else if (newChildDOM === childDOM.nextSibling) {
        //     let parentNode = childDOM.parentNode;
        //     if (parentNode) parentNode.removeChild(childDOM);
        // } else {
        //     domChildren.insertBefore(newChildDOM, childDOM);
        // }

    }
}

function diffProps(props, out) {
    let old = out.oldVNode !== undefined ? out.oldVNode.props : {};
    for (let name in props) {
        if (out && out[name] !== props[name]) {
            // out[name] = props[name];
            setAttribute(out, name, props[name], old[name]);
        }
        if (out.oldVNode && !(name in old)) {
            out.removeAttribute(name);
            // out[name] = '';
        }
    }
}

export function recollectNodeTree(dom) {
    if (dom.oldVNode.component) {
        unmountComponent(dom.oldVNode.component);
    }
    dom.markOut = true;
    dom.parentNode.removeChild(dom);
}