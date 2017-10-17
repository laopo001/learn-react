/**
 * @author dadigua
 */

import { RenderMode } from '../config/';
import { Component } from '../component';
import { VNode } from '../vnode';
import { diff, recollectNodeTree } from './diff';

export let DidMounts = [];

let isDid = false;

export function callDidMount(is) {
    if (is) { isDid = is; } else { return; }

    DidMounts.forEach(c => {
        c.componentDidMount();
    });
    DidMounts = [];
}

function run(vnode, component) {
    if (vnode instanceof VNode) {
        if ('ref' in vnode.props) {
            if (vnode.props.ref.funcName === 'stringToFunction') {
                vnode.props.ref = vnode.props.ref.bind(component);
            }
        }
        vnode.children.forEach((x) => {
            run(x, component);
        });
    }
}

export function renderComponent(component: Component, opts: RenderMode, context, isCreate) {

    let vnode = component.render();

    // 未知
    // if (vnode == null) {
    //     return;
    // }
    if (vnode.children.length === 0 && vnode.props.children) {
        if (vnode.props.children.constructor === Array) {
            vnode.children = vnode.props.children;
        } else {
            vnode.children = [vnode.props.children];
        }
    }
    run(vnode, component);
    vnode.component = component;
    // component.__renderCount__++;
    if (isCreate) {
        component.componentWillMount();
    }
    component.componentWillUpdate(component.props, component.state);

    let dom = diff(vnode, component.__dom__, context);
    component.__dom__ = dom;
    if (dom.__components__ == null) {
        dom.__components__ = [component];
    } else {
        dom.__components__.push(component);
    }
    // dom.__components__ = component;
    if (isCreate) {
        DidMounts.push(component);
        // component.componentDidMount();
    }
    component.componentDidUpdate(component.props, component.state);

    return dom;
}
export function createComponent(Ctor, props, context) {
    let inst;
    // 类形式的组件
    if (Ctor.prototype && Ctor.prototype.render) {
        let t_props = Object.assign({}, Ctor.defaultProps, props);
        inst = new Ctor(t_props, context);
        // Component.call(inst, props, context);
        if (inst.context == null) inst.context = context;
        inst.context = Object.assign({}, inst.context, inst.getChildContext());
        // inst.state = Object.assign({}, inst.state, inst.get());

        // inst.props = Object.assign({}, Ctor.defaultProps, inst.props);

        // Component.call(inst, props, context);
    } else {// 无状态组件
        inst = new Component(props, context);
        inst.constructor = Ctor;
        inst.render = inst.constructor.bind(null, props, context);
    }
    if (inst.componentWillReceiveProps) {
        inst.componentWillReceiveProps(props, context);
    }

    return inst;
}
export function buildComponentFromVNode(vnode: VNode, dom, context) {
    let component: Component = dom && dom.__components__.find((c) => { return c.constructor === vnode.name; });
    if (component && component.constructor === vnode.name) {
        return renderComponent(component, RenderMode.SYNC_RENDER, context, false);
    } else {
        if (dom) {
            recollectNodeTree(dom);
        }
        component = createComponent(vnode.name, vnode.props, context);
        component.__vnode__ = vnode;
        // 如果组件传入props.children，则vnode下面去掉
        if (component.props.children === undefined) {
            switch (vnode.children.length) {
                case 0: component.props.children = undefined; break;
                case 1: component.props.children = vnode.children[0]; break;
                default: component.props.children = vnode.children; break;
            }
        }
        // component.props.children = vnode.children;
        return renderComponent(component, RenderMode.SYNC_RENDER, component.context, true);
    }
}

export function unmountComponent(component) {
    component.componentWillUnmount();
}