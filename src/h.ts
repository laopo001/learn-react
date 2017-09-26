/**
 * @author dadigua
 */

const EMPTY_CHILDREN = [];
import { VNode } from './vnode';

export function h(nodeName, attributes, ...stack) {
    let children = EMPTY_CHILDREN, lastSimple, child, simple, i;
    if (attributes && attributes.children != null) {
        if (!stack.length) { stack.push(attributes.children); }
        delete attributes.children;
        // 兼容react，react是放在this.props.children;
    }
    while (stack.length) {
        child = stack.pop();
        if (child && child.pop !== undefined) {
            for (let i = child.length; i--;) {
                stack.push(child[i]);
            }
        } else {
            if (typeof child === 'boolean') { child = null; }
            simple = typeof nodeName !== 'function';
            if (simple) {
                if (child == null) { child = ''; }
                else if (typeof child === 'number') { child = String(child); }
                else if (typeof child === 'string') { simple = false; }
            }
            if (simple && lastSimple) {
                children[children.length - 1] += child;
            } else if (children === EMPTY_CHILDREN) {
                children = [child];
            } else {
                children.push(child);
            }
            lastSimple = simple;
        }
    }
    return new VNode(nodeName, children, attributes);
}