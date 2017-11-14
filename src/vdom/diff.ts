/**
 * @author dadigua
 */
import { KEY, RenderMode } from '../config/';
import { removeNode, setAttribute, insertAfter } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { RenderComponentFromVNode, unmountComponent, renderComponent, callDidMount } from './componentUtil';
import { VNode } from '../vnode';

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
                // if (dom) {
                //     // console.warn(1);
                //     dom.parentNode.replaceChild(out, dom);
                //     recollectNodeTree(dom, false);
                // }
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
            // if (dom) {
            //     console.warn(3);
            //     dom.parentNode.replaceChild(out, dom);
            //     recollectNodeTree(dom, false);
            // }
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
                // if (dom) {
                //     console.warn(2);
                //     dom.parentNode.replaceChild(out, dom);
                //     recollectNodeTree(dom, false);
                // }
            }
            out[KEY] = true;
        }
    }
    if (dom && dom !== out) {
        dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, false);
        callDidMount();
    }
    return out;
}


function diffChild(vnodeChildren: VNode[], domChildren: any[], context, out) {

    if (domChildren == null) { domChildren = []; }

    let keyObj = {}, keyObjLen = 0, domArr = [];

    for (let i = 0; i < domChildren.length; i++) {
        domArr.push(domChildren[i]);
        let key = domChildren[i].__key__;
        if (key !== undefined) {
            keyObj[key] = domChildren[i];
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
        } else {
            if (child.uuid !== undefined) {
                while (childDOM && childDOM.__key__ !== undefined) {
                    j++;
                    childDOM = domArr[j];
                }
                if (keyObj[child.uuid] !== undefined) {
                    childDOM = keyObj[child.uuid];
                    keyObj[child.uuid] = null;
                } else {
                    childDOM = null;
                }
                j--;
            }
            newChildDOM = diff(child, childDOM, context);
            try {
                newChildDOM.__key__ = child.uuid;
            } catch (error) {
                debugger;
            }

        }
        if (childDOM == null) {
            if (lastChildDom == null) {
                out.appendChild(newChildDOM);
                // if (child instanceof VNode && typeof child.name === 'function') {

                // }
            } else {
                insertAfter(newChildDOM, lastChildDom);
            }
            callDidMount();
        }
        // else if (newChildDOM !== childDOM) {
        //     out.replaceChild(newChildDOM, childDOM);
        //     recollectNodeTree(childDOM, false);
        // }


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
    for (let i = 0; i < doms.length; i++) {
        recollectNodeTree(doms[i], isRemove);
    }
}

export function recollectNodeTree(dom, isRemove) {
    if (dom.__components__) {
        dom.__components__.forEach(component => {
            unmountComponent(component);
        });
    }
    dom.markOut = true;
    recollectNodeChildren(dom.childNodes, false);
    if (isRemove) {
        dom.parentNode.removeChild(dom);
    }
    // dom.parentNode.removeChild(dom);
}