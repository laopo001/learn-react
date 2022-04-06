/**
 * @author dadigua
 */
import { KEY, RenderMode } from '../config/';
import { removeNode, setAttribute, insertAfter, setOrRemoveAttribute } from './dom';
import { isNamedNode, createNode, isSameNodeType } from './util';
import { RenderComponentFromVNode, unmountComponent, renderComponent, callDidMount, findParentComponent, GetComponentVNode } from './componentUtil';
import { Base, VNode } from '../vnode';
import { defer } from '../rerender';
import { Component } from '../component';
export const mounts = [];
let isSvgMode = false;
// let prevSvgMode = false;
export function create(vnode: VNode, context, parent: Element) {
    try {
        let i = 0;
        let ret
        let run = () => {
            let j = 0;
            ret = diff(vnode, null, null, parent, context);
            if (ret) {
                vnode.__dom__ = ret;
            }
            let next;
            if (j == 0 && (vnode.child && vnode.child.traversed == false)) {
                next = vnode.child
                if (typeof vnode.name != 'function') {
                    parent = ret;
                }
                j = 1;
            }
            if (j == 0 && (vnode.child && vnode.child.traversed && vnode.sibling || !vnode.child && vnode.sibling)) {
                next = vnode.sibling;
                ret && parent.appendChild(ret);
                j = 1;
            }
            if (j == 0 && (vnode.child && vnode.child.traversed && !vnode.sibling && vnode.return || !vnode.child && !vnode.sibling && vnode.return)) {
                next = vnode.return;
                if (typeof vnode.name != 'function') {
                    parent = parent.parentElement
                }
                j = 1;
            }

            if (j == 0) {
                // break;
            } else {
                setTimeout(run, 0);
            }
            vnode = next;
            i++;
        }
        run();
        callDidMount();
        return parent;
    } catch (e) {
        console.log(e)
    }
}


type Node = Base | undefined | VNode;
export function diff(vnode: Node, oldVNode: Node, dom: Element, domParent: Element, context, component?: Component): Element {
    if (oldVNode != null && vnode == null) {
        dom.remove();
        return
    }
    if (vnode == null || vnode.traversed == true) {
        return
    }
    vnode.traversed = true
    let out;
    if (vnode instanceof VNode) {
        isSvgMode = vnode.name === 'svg' ? true : vnode.name === 'foreignObject' ? false : isSvgMode;
        if (typeof vnode.name === 'string') {
            if (!dom || !vnode.isSameName(oldVNode)) {
                out = vnode.createDom(isSvgMode);
            } else {
                out = dom;
            }
            diffProps(vnode.props, oldVNode && (oldVNode as any).props || {}, out);
        } else if (typeof vnode.name === 'function') {
            let componentVNode = GetComponentVNode(vnode, dom, context);
            vnode.child = componentVNode;
            componentVNode.return = vnode;
            // out = diff(componentVNode, oldVNode && oldVNode.child, dom ,context, component)
        }
    } else if (vnode instanceof Base) {
        if (Array.isArray(vnode._value)) { throw (new Error('类型错误')); }
        let str = ''
        if (vnode._value == null) {
            str = '';
        } else {
            str = vnode.toString();
        }
        if (dom) {
            if (dom.nodeValue !== str) {
                dom.nodeValue = str;
            }
            out = dom;
        } else {
            out = document.createTextNode(str as string);
        }
    } else {
        console.log(vnode)
        return;
    }

    // console.log(vnode)
    if (dom == null) {
        out && domParent.append(out);
    } else if (dom != out) {
        out && domParent.replaceChild(dom, out);
    }
    return out;
}

function diffProps(props, oldProps, dom) {
    // let oldProps = out.oldVNode !== undefined ? out.oldVNode.props : {};
    const keys = {};
    for (let name in props) {
        if (name === 'children') continue;

        if (oldProps && oldProps[name] !== props[name]) {
            setAttribute(dom, name, props[name], oldProps, props, isSvgMode);
        }
        if (name in oldProps) {
            keys[name] = true;
        }
    }
    for (let name in oldProps) {
        if (name === 'children') continue;

        if (!keys[name]) {
            setOrRemoveAttribute(dom, name, null, isSvgMode);
        }
    }
}

// export function idiff(vnode: any | VNode, oldVNode: any | VNode, dom, context, component?: Component) {
//     let prevSvgMode = isSvgMode;
//     let out = dom;
//     if (vnode instanceof VNode) {
//         isSvgMode = vnode.name === 'svg' ? true : vnode.name === 'foreignObject' ? false : isSvgMode;
//         if (typeof vnode.name === 'string') {
//             if (!dom || !vnode.isSameName(dom)) {

//                 out = vnode.createDom(isSvgMode);
//             }
//             if (vnode.children.length > 0) {
//                 diffChild(vnode.children, oldVNode && oldVNode.children || [], out.childNodes, context, out);
//             } else if (vnode.children.length === 0 && dom && dom.childNodes.length > 0) {
//                 recollectNodeChildren(dom.childNodes, true);
//             }
//             diffProps(vnode.props, out);
//             out.oldVNode = vnode;
//             out[KEY] = true;
//         } else if (typeof vnode.name === 'function') {
//             out = RenderComponentFromVNode(vnode, dom, context);
//         }
//     } else {

//         if (vnode instanceof Base) {
//             if (typeof vnode._value === 'boolean' || Array.isArray(vnode._value)) { throw (new Error('类型错误')); }
//             if (vnode._value == null) {
//                 vnode = '';
//             }
//             if (dom && dom.splitText !== undefined) {
//                 if (dom.nodeValue !== vnode.toString()) {
//                     dom.nodeValue = vnode.toString();
//                 }
//             } else {
//                 out = document.createTextNode(vnode.toString() as string);
//             }
//             out[KEY] = true;
//         }
//     }
//     if (dom && dom !== out && !dom.__moveOut__) {
//         dom.parentNode.replaceChild(out, dom);
//         recollectNodeTree(dom, false, component);
//         // if (dom.__render__ === true) {
//         //     // dom.__moveOut__ = true;
//         //     if (component) {
//         //         recollectNodeTree(dom, false, component);
//         //         delete dom.__render__;
//         //     }

//         // } else {
//         //     recollectNodeTree(dom, false);
//         // }
//     }
//     isSvgMode = prevSvgMode;
//     if (out == null) {
//         debugger;
//     }
//     return out;
// }


// function diffChild(vnodeChildren: VNode[], oldVNodeChildren: VNode[], domChildren: any[], context, out) {
//     try {
//         if (domChildren == null) { domChildren = []; }

//         let keyObj = {}, keyObjLen = 0, domArr = [];

//         for (let i = 0; i < domChildren.length; i++) {
//             const childDOM = domChildren[i];
//             if (childDOM && !(KEY in childDOM)) { continue; }
//             let key = childDOM.__key__;
//             if (key != null) {
//                 keyObj[key] = childDOM;
//                 keyObjLen++;
//             } else {
//                 domArr.push(childDOM);
//             }
//         }
//         let j = 0;
//         let lastChildDom;
//         for (let i = 0; i < vnodeChildren.length; i++) {

//             let child = vnodeChildren[i];
//             let oldchild = oldVNodeChildren[i];
//             // if (child instanceof VNode) (child as any).component = out.component;
//             let childDOM;

//             let newChildDOM, uuid;


//             if (child && child.key != null) {
//                 uuid = child.key + ',' + child.group;
//                 // while (childDOM && childDOM.__key__ !== undefined) {
//                 //     j++;
//                 // }
//                 if (keyObj[uuid] !== undefined) {
//                     childDOM = keyObj[uuid];
//                     keyObj[uuid] = null;
//                 } else {
//                     childDOM = null;
//                 }

//             } else {
//                 childDOM = domArr[j];
//                 j++;
//             }

//             newChildDOM = idiff(child, oldchild, childDOM, context);

//             if (child && child.key != null) { newChildDOM.__key__ = uuid; }

//             if (childDOM == null) {
//                 if (lastChildDom == null) {
//                     let first = out.childNodes[0];
//                     if (first == null) { out.appendChild(newChildDOM); }
//                     else { out.insertBefore(newChildDOM, first); }

//                 } else {
//                     insertAfter(newChildDOM, lastChildDom, out);
//                 }
//             } else {
//                 if (lastChildDom == null) {
//                     let first = out.childNodes[0];
//                     if (first == null) { out.appendChild(newChildDOM); }
//                     else { out.insertBefore(newChildDOM, first); }

//                 } else {
//                     insertAfter(newChildDOM, lastChildDom, out);
//                 }
//             }

//             lastChildDom = newChildDOM;

//         }

//         for (let i = j; i < domArr.length; i++) {
//             recollectNodeTree(domArr[i], true);
//         }

//         for (let x in keyObj) {
//             if (keyObj[x] != null) {
//                 recollectNodeTree(keyObj[x], true);
//             }
//         }
//     } catch (e) {
//         console.log(e)
//     }
// }


// export function recollectNodeChildren(doms, isRemove) {
//     if (isRemove) {
//         while (doms.length > 0) {
//             recollectNodeTree(doms[0], isRemove);
//         }
//     } else {
//         for (let i = 0; i < doms.length; i++) {
//             recollectNodeTree(doms[i], isRemove);
//         }
//     }
// }

// export function recollectNodeTree(dom, isRemove, component?: Component) {
//     if (dom.__moveOut__) { return; }
//     if (component != null) {
//         if (dom.__parentComponent__ != null) {
//             let c = dom.__parentComponent__;
//             if (c !== component) {
//                 unmountComponent(c);
//                 while (c.__parentComponent__) {
//                     c = c.__parentComponent__;
//                     if (c === component) {
//                         break;
//                     }
//                     unmountComponent(c);
//                 }
//             }
//         }
//     } else {
//         if (dom.__parentComponent__ != null) {
//             let c = dom.__parentComponent__;
//             unmountComponent(c);
//             while (c.__parentComponent__) {
//                 c = c.__parentComponent__;
//                 unmountComponent(c);
//             }

//         }
//     }

//     recollectNodeChildren(dom.childNodes, false);
//     if (isRemove) {
//         dom.parentNode.removeChild(dom);
//     }
//     dom.__moveOut__ = true;
//     // dom.parentNode.removeChild(dom);
// }