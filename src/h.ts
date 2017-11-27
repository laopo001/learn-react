/**
 * @author dadigua
 */

const EMPTY_CHILDREN = [];
import { VNode } from './vnode';
import { Component } from './component';
import { propsClone } from './vdom/util';

export function h(nodeName: string | Function, props, children?) {


    if (props && 'ref' in props && typeof props['ref'] === 'string') {
        // ref string 转 function方式
        const old = props['ref'];
        props['ref'] = function (x) {
            this.refs[old] = x;
        };
        props['ref'].funcName = '__ref_string__';
        props['ref'].refName = old;
    }
    let obj = { index: 0 };
    if (arguments.length > 2) {
        const children = [];
        for (let i = 2; i < arguments.length; i++) {
            // if (children[i] == null || children[i] === '') {
            //     children.splice(i, 1);
            //     i--;
            //     continue;
            // }
            if (typeof arguments[i] === 'boolean') {
                // children[i] = null;
                children.push(null);
            } else if (Array.isArray(arguments[i])) {
                runArray(arguments[i], children, obj);

            } else {
                children.push(arguments[i]);
            }

        }
        return new VNode(nodeName, props, children);
    } else {
        return new VNode(nodeName, props);
    }
}
function runArray(arr, children, obj) {
    arr.forEach((x, index) => {
        if (Array.isArray(x)) {
            obj.index++;
            runArray(x, children, obj);
            return;
        } else if (x instanceof VNode) {
            x.group = obj.index;
        } else if (typeof x === 'boolean') {
            x = null;
        }
        children.push(x);

    });
    obj.index++;
}


export function cloneElement(vnode, props) {
    if (!(vnode instanceof VNode)) { console.error('输入不是一个VNode类型'); return; }
    arguments[0] = vnode.name;
    arguments[1] = propsClone({}, vnode.props, arguments[1]);
    return h.apply(null, arguments);
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