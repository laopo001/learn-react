/**
 * @author dadigua
 */

const EMPTY_CHILDREN = [];
import { VNode } from './vnode';
import { Component } from './component';
export function h(nodeName: string | Function, props) {


    if (props && 'ref' in props && typeof props['ref'] === 'string') {
        // ref string 转 function方式
        const old = props['ref'];
        props['ref'] = function (x) {
            this.refs[old] = x;
        };
        props['ref'].funcName = '__ref_string__';
    }
    let indexT = 0;
    if (arguments.length > 2) {
        const children = []
        for (let i = 2; i < arguments.length; i++) {
            // if (children[i] == null || children[i] === '') {
            //     children.splice(i, 1);
            //     i--;
            //     continue;
            // }
            if (typeof arguments[i] === 'boolean') {
                // children[i] = null;
                children.push(null);
            } else if (arguments[i] && arguments[i].constructor === Array) {
                // let temp = i;
                // let lastConstructor;
                arguments[i].forEach((x, index) => {
                    // if (x.constructor === lastConstructor && x.key == null) {
                    //     //  console.warn('key');
                    // }
                    // lastConstructor = x.constructor;
                    // x.uuid = x.key + ',' + indexT;
                    if (x instanceof VNode) {
                        x.group = indexT;
                    }
                    children.push(x);
                    // children.splice(i + index + 1, 0, x);
                });
                indexT++;
                // children.splice(temp, 1);
            } else {
                children.push(arguments[i])
            }

        }
        return new VNode(nodeName, props, children);
    } else {
        return new VNode(nodeName, props);
    }

}

export function cloneElement(vnode, props) {
    if (!(vnode instanceof VNode)) { console.error('输入不是一个VNode类型'); return; }
    arguments[0] = vnode.name;
    arguments[1] = Object.assign({}, vnode.props, arguments[1]);
    return h.apply(null, arguments)
    // if (arguments.length > 2) {
    //     return h.apply(null, [vnode.name, props, ...[].slice.call(arguments, 2)])
    // } else {
    //     return h(vnode.name, props);
    // }
    // return h(
    //     vnode.name,
    //     Object.assign({}, vnode.props, props),
    //     arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
    // );
}

export function isValidElement(element) {
    return element && ((element instanceof VNode));
}



export function createClass(obj): any {

    class ObjectComponent extends Component {
        state = obj.getInitialState == null ? {} : obj.getInitialState();
        render() {
            return obj.render.call(this);
        }
        static defaultProps = obj.getDefaultProps == null ? {} : obj.getDefaultProps();
    }
    return ObjectComponent;
}