/**
 * @author dadigua
 */
import { KEY, RenderMode } from '../config/';
import { removeNode, setAccessor } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { buildComponentFromVNode, unmountComponent, renderComponent } from './componentUtil';
import { VNode } from '../vnode';

export const mounts = [];
let diffCount = 0;
let isSvgMode = false;
let hydrating = false;

export function create(vnode: VNode, context, parent) {
    let ret = diff(vnode, parent, context);
    // if (parent) parent.appendChild(ret);
}

export function diff(vnode: any | VNode, dom, context) {
    let out = dom;
    if (vnode instanceof VNode) {

        if (typeof vnode.name === 'string') {
            if (!dom || !vnode.isSameName(dom)) {
                out = vnode.createDom();
            }
        }
        if (typeof vnode.name === 'function') {

            out = buildComponentFromVNode(vnode, dom, context);

        }
        if (vnode.children.length > 0 && typeof vnode.name !== 'function') {
            diffChild(vnode.children, out.childNodes, context, out);

            // for (let i = 0; i < vnode.children.length; i++) {
            //     if (out.childNodes[i] !== undefined) {
            //         diff(vnode.children[i], out.childNodes[i], context);
            //     } else {
            //         out.appendChild(diff(vnode.children[i], out.childNodes[i], context));
            //     }
            // }
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
        if (!childDOM) {
            out.appendChild(newChildDOM);
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