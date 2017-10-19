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
    if (props && 'ref' in props && typeof props['ref'] === 'string') {
        // ref string 转 function方式
        const old = props['ref'];
        props['ref'] = function (x) {
            this.refs[old] = x;
        };
        props['ref'].funcName = '__ref_string__';
    }

    for (let i = 0; i < children.length; i++) {
        if (children[i] == null || children[i] === '') {
            children.splice(i, 1);
            i--;
            continue;
        }
        if (children[i].constructor === Array) {
            let temp = i;
            children[i].forEach((x, index) => {
                children.splice(i + index + 1, 0, x);
                i++;
            });
            children.splice(temp, 1);
            i--;
            continue;
        }

    }

    return new VNode(nodeName, props, children);
}

export function cloneElement(vnode, props) {
    return h(
        vnode.name,
        Object.assign({}, vnode.props, props),
        arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
    );
}

export function isValidElement(element) {
    return element && ((element instanceof VNode));
}