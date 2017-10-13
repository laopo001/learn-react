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

export function renderComponent(component: Component, opts: RenderMode, context?) {

    let vnode = component.render();
    component.__renderCount__++;
    if (component.__renderCount__ === 1) {
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
    if (component.__renderCount__ === 1) {
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
        inst = new Ctor(props, context);
        Object.assign(inst.props, Ctor.defaultProps);
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
        return renderComponent(component, RenderMode.SYNC_RENDER, context);
    } else {
        if (dom) {
            recollectNodeTree(dom);
        }
        component = createComponent(vnode.name, vnode.props, context);
        component.__vnode__ = vnode;
        component.props.children = vnode.children;
        return renderComponent(component, RenderMode.SYNC_RENDER, context);
    }
}

export function unmountComponent(component) {
    component.componentWillUnmount();
}