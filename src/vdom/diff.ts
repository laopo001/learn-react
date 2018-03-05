/**
 * @author dadigua
 */
import { KEY, RenderMode } from '../config/';
import { removeNode, setAttribute, insertAfter, setOrRemoveAttribute } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { RenderComponentFromVNode, unmountComponent, renderComponent, callDidMount, findParentComponent } from './componentUtil';
import { VNode } from '../vnode';
import { defer } from '../rerender';
import { Component } from '../component';
export const mounts = [];
let isSvgMode = false;
// let prevSvgMode = false;
export function create(vnode: VNode, context, parent) {
    let ret = diff(vnode, null, context);
    if (parent) parent.appendChild(ret);
    callDidMount();
    return ret;
}
export function diff(vnode: any | VNode, dom, context, component?: Component) {
    if (dom != null) {
        isSvgMode = dom.ownerSVGElement !== undefined;
    }
    return idiff(vnode, dom, context, component);
}

export function idiff(vnode: any | VNode, dom, context, component?: Component) {
    let prevSvgMode = isSvgMode;
    let out = dom;
    if (vnode instanceof VNode) {
        isSvgMode = vnode.name === 'svg' ? true : vnode.name === 'foreignObject' ? false : isSvgMode;
        if (typeof vnode.name === 'string') {
            if (!dom || !vnode.isSameName(dom)) {

                out = vnode.createDom(isSvgMode);
            }
            if (vnode.children.length > 0) {
                diffChild(vnode.children, out.childNodes, context, out);
            } else if (vnode.children.length === 0 && dom && dom.childNodes.length > 0) {
                recollectNodeChildren(dom.childNodes, true);
            }
            diffProps(vnode.props, out);
            out.oldVNode = vnode;
            out[KEY] = true;
        } else if (typeof vnode.name === 'function') {
            out = RenderComponentFromVNode(vnode, dom, context);
        }
    } else {
        if (typeof vnode === 'boolean' || Array.isArray(vnode)) { throw (new Error('类型错误')); }
        if (vnode == null || typeof vnode === 'object') {
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
        if (dom.__render__ === true) {
            // dom.__moveOut__ = true;
            recollectNodeTree(dom, false, component);
            delete dom.__render__;
        } else {
            recollectNodeTree(dom, false);
        }
    }
    isSvgMode = prevSvgMode;
    return out;
}


function diffChild(vnodeChildren: VNode[], domChildren: any[], context, out) {

    if (domChildren == null) { domChildren = []; }

    let keyObj = {}, keyObjLen = 0, domArr = [];

    for (let i = 0; i < domChildren.length; i++) {
        const childDOM = domChildren[i];
        if (childDOM && !(KEY in childDOM)) { continue; }
        let key = childDOM.__key__;
        if (key != null) {
            keyObj[key] = childDOM;
            keyObjLen++;
        } else {
            domArr.push(childDOM);
        }
    }
    let j = 0;
    let lastChildDom;
    for (let i = 0; i < vnodeChildren.length; i++) {

        let child = vnodeChildren[i];
        // if (child instanceof VNode) (child as any).component = out.component;
        let childDOM;

        let newChildDOM, uuid;


        if (child && child.key != null) {
            uuid = child.key + ',' + child.group;
            // while (childDOM && childDOM.__key__ !== undefined) {
            //     j++;
            // }
            if (keyObj[uuid] !== undefined) {
                childDOM = keyObj[uuid];
                keyObj[uuid] = null;
            } else {
                childDOM = null;
            }

        } else {
            childDOM = domArr[j];
            j++;
        }

        newChildDOM = idiff(child, childDOM, context);
        if (child && child.key != null) { newChildDOM.__key__ = uuid; }

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

    }

    for (let i = j; i < domArr.length; i++) {
        recollectNodeTree(domArr[i], true);
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
            setAttribute(out, name, props[name], oldProps, props, isSvgMode);
        }
        if (out.oldVNode && !(name in oldProps)) {
            setOrRemoveAttribute(out, name, null, isSvgMode);
            // out.removeAttribute(name);
        }
    }
}
export function recollectNodeChildren(doms, isRemove) {
    if (isRemove) {
        while (doms.length > 0) {
            recollectNodeTree(doms[0], isRemove);
        }
    } else {
        for (let i = 0; i < doms.length; i++) {
            recollectNodeTree(doms[i], isRemove);
        }
    }

}

export function recollectNodeTree(dom, isRemove, component?: Component) {
    if (dom.__moveOut__) { return; }
    if (component != null) {
        if (dom.__parentComponent__ != null) {
            let c = dom.__parentComponent__;
            if (c !== component) {
                unmountComponent(c);
                while (c.__parentComponent__) {
                    c = c.__parentComponent__;
                    if (c === component) {
                        break;
                    }
                    unmountComponent(c);
                }
            }
        }
    } else {
        if (dom.__parentComponent__ != null) {
            let c = dom.__parentComponent__;
            unmountComponent(c);
            while (c.__parentComponent__) {
                c = c.__parentComponent__;
                unmountComponent(c);
            }

        }
    }

    recollectNodeChildren(dom.childNodes, false);
    if (isRemove) {
        dom.parentNode.removeChild(dom);
    }
    dom.__moveOut__ = true;
    // dom.parentNode.removeChild(dom);
}