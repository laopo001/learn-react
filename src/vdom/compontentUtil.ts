/**
 * @author dadigua
 */

import { RenderMode } from '../config/';
import { Component } from '../component';
import { VNode } from '../vnode';



export function renderComponent(component, opts: RenderMode) {

}
export function createComponent(Ctor, props, context) {
    let inst;
    // 类形式的组件
    if (Ctor.prototype && Ctor.prototype.render) {
        inst = new Ctor(props, context);
        Component.call(inst, props, context);
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
    let component = dom && dom._component;
    if (component) {

    } else {
        component = createComponent(vnode.name, vnode.props, context);
        component.vnode = vnode;
        renderComponent(component, RenderMode.SYNC_RENDER);
    }
}

export function unmountComponent(component) {

}