/**
 * @author dadigua
 */

const EMPTY_CHILDREN = [];
import { VNode } from './vnode';

export function h(nodeName, props, ...children) {

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
            });
            children.splice(temp, 1);
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