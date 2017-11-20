/**
 * @author dadigua
 */
import { KEY, RenderMode } from '../config/';
import { removeNode, setAttribute, insertAfter } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { RenderComponentFromVNode, unmountComponent, renderComponent, callDidMount, findParentComponent } from './componentUtil';
import { VNode } from '../vnode';
import { defer } from '../rerender';

export const mounts = [];
let isSvgMode = false;

export function create(vnode: VNode, context, parent) {
    callDidMount['isFirstCreate'] = true;
    let ret = diff(vnode, null, context);
    if (parent) parent.appendChild(ret);
    callDidMount['isFirstCreate'] = false;
    callDidMount();
    return ret;
}

export function diff(vnode: any | VNode, dom, context) {
    let out = dom;
    if (vnode instanceof VNode) {
        if (typeof vnode.name === 'string') {
            if (!dom || !vnode.isSameName(dom)) {
                out = vnode.createDom();
            }
            if (vnode.children.length > 0) {
                diffChild(vnode.children, out.childNodes, context, out);
            } else if (vnode.children.length === 0 && dom && dom.childNodes.length > 0) {
                recollectNodeChildren(dom.childNodes, true);
            }
            diffProps(vnode.props, out);
            out.oldVNode = vnode;
        } else if (typeof vnode.name === 'function') {
            out = RenderComponentFromVNode(vnode, dom, context);
        }


    } else {
        if (vnode == null || typeof vnode === 'boolean' || typeof vnode === 'object') {
            vnode = '';
        }
        if (typeof vnode === 'string' || typeof vnode === 'number') {
            if (dom && dom.splitText !== undefined) {
                if (dom.nodeValue !== vnode) {
                    dom.nodeValue = vnode;
                }
            } else {
                out = document.createTextNode(vnode as string);
            }
            out[KEY] = true;
        }
    }
    if (dom && dom !== out && !dom.__moveOut__) {
        dom.parentNode.replaceChild(out, dom);
        dom.__moveOut__ = true;
        defer(function () {
            if (findParentComponent(out, dom.__parentComponent__, 'component') == null) {
                recollectNodeTree(dom, false);
            }
        })

    }
    return out;
}


function diffChild(vnodeChildren: VNode[], domChildren: any[], context, out) {

    if (domChildren == null) { domChildren = []; }

    let keyObj = {}, keyObjLen = 0, domArr = [];

    for (let i = 0; i < domChildren.length; i++) {
        const childDOM = domChildren[i];
        if (childDOM && !('__key__' in childDOM)) { continue; }
        domArr.push(childDOM);
        let key = childDOM.__key__;
        if (key != null) {
            keyObj[key] = childDOM;
            keyObjLen++;
        }
    }
    let j = 0;
    let lastChildDom;
    for (let i = 0; i < vnodeChildren.length; i++) {

        let child = vnodeChildren[i];
        // if (child instanceof VNode) (child as any).component = out.component;
        let childDOM = domArr[j];

        let newChildDOM;
        if (child == null) {
            newChildDOM = document.createTextNode('');
            newChildDOM.__key__ = null;
        } else {
            let uuid = null;
            if (child.key != null) {
                uuid = child.key + ',' + child.group;
                while (childDOM && childDOM.__key__ !== undefined) {
                    j++;
                    childDOM = domArr[j];
                }
                if (keyObj[uuid] !== undefined) {
                    childDOM = keyObj[uuid];
                    keyObj[uuid] = null;
                } else {
                    childDOM = null;
                }
                j--;
            }
            newChildDOM = diff(child, childDOM, context);
            newChildDOM.__key__ = uuid;
        }
        if (childDOM == null) {
            if (lastChildDom == null) {
                let first = out.childNodes[0];
                if (first == null) { out.appendChild(newChildDOM); }
                else { out.insertBefore(newChildDOM, first); }

            } else {
                insertAfter(newChildDOM, lastChildDom, out);
            }
        }

        lastChildDom = newChildDOM;
        j++;
    }
    if (domArr.length > 0 && j < domArr.length && domArr[j].__key__ != null) {
        for (let i = j; i < domArr.length; i++) {
            recollectNodeTree(domArr[i], true);
        }
    }
    for (let x in keyObj) {
        if (keyObj[x] != null) {
            recollectNodeTree(keyObj[x], true);
        }
    }

}

function diffProps(props, out) {
    let oldProps = out.oldVNode !== undefined ? out.oldVNode.props : {};
    for (let name in props) {
        if (name === 'children') continue;
        if (out && out[name] !== props[name]) {
            setAttribute(out, name, props[name], oldProps[name]);
        }
        if (out.oldVNode && !(name in oldProps)) {
            out.removeAttribute(name);
        }
    }
}
export function recollectNodeChildren(doms, isRemove) {
    while (doms.length > 0) {
        recollectNodeTree(doms[0], isRemove);
    }
}

export function recollectNodeTree(dom, isRemove) {
    if (dom.__parentComponent__ != null) {
        let c = dom.__parentComponent__;
        unmountComponent(c);
        while (c.__parentComponent__) {
            c = c.__parentComponent__;
            unmountComponent(c);
        }
    }
    recollectNodeChildren(dom.childNodes, false);
    if (isRemove) {
        dom.parentNode.removeChild(dom);
    }
    dom.__moveOut__ = true;
    // dom.parentNode.removeChild(dom);
}