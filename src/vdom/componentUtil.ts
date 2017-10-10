/**
 * @author dadigua
 */

import { RenderMode } from '../config/';
import { Component } from '../component';
import { VNode } from '../vnode';
import { diff } from './diff';


export function renderComponent(component: Component, opts: RenderMode, context?) {

    let vnode = component.render();
    component.__renderCount__++;
    if (component.__renderCount__ === 1) {
        component.componentWillMount();
    }
    component.componentWillUpdate(component.props, component.state);

    let dom = diff(vnode, component.__dom__, context);
    component.__dom__ = dom;
    if (component.__renderCount__ === 1) {
        component.componentDidMount();
    }
    component.componentDidUpdate(component.props, component.state);

    return dom;
}
export function createComponent(Ctor, props, context) {
    let inst;
    // 类形式的组件
    if (Ctor.prototype && Ctor.prototype.render) {
        inst = new Ctor(props, context);
        // Component.call(inst, props, context);
    } else {// 无状态组件
        inst = new Component(props, context);
        inst.constructor = Ctor;
        inst.render = inst.constructor(props, context);
    }
    if (inst.componentWillReceiveProps) {
        inst.componentWillReceiveProps(props, context);
    }

    return inst;
}
export function buildComponentFromVNode(vnode: VNode, dom, context) {
    let component: Component = dom && dom._component;
    if (component) {

    } else {
        component = createComponent(vnode.name, vnode.props, context);
        vnode.component = component;
        component.__vnode__ = vnode;
        component.props.children = vnode.children;
        return renderComponent(component, RenderMode.SYNC_RENDER, context);
    }
}

export function unmountComponent(component) {

}