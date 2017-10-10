/**
 * @author dadigua
 */

const EMPTY_CHILDREN = [];
import { VNode } from './vnode';

export function h(nodeName, props, ...children) {
    /*     let children = EMPTY_CHILDREN, lastSimple, child, simple, i;
        if (props && props.children != null) {
            if (!stack.length) { stack.push(props.children); }
            delete props.children;
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
        } */

    for (let i = 0; i < children.length; i++) {
        if (children[i].constructor === Array) {
            let temp = i;
            children[i].forEach((x, index) => {
                children.splice(i + index + 1, 0, x);
                i++;
            });
            children.splice(temp, 1);
            i--;
        }

    }

    return new VNode(nodeName, props, children);
}