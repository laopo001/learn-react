/**
 * @author dadigua
 */

import { RenderMode } from '../config/';
import { Component } from '../component';
import { VNode } from '../vnode';
import { diff, recollectNodeTree } from './diff';
import { propsClone } from './util';

export let DidMounts = [];



export function callDidMount() {
    if (callDidMount['isFirstCreate']) return;
    DidMounts.forEach(c => {
        c.componentDidMount();
    });
    DidMounts = [];
}

function setState(state, callback?) {
    this.__new__.state = Object.assign({}, this.state, state);
    if (callback) this._renderCallbacks.push(callback);
}

export function renderComponent(component: Component, opts: RenderMode, context, isCreate: boolean) {
    let old = { state: component.state, props: component.props, context: component.context };
    let newObj = {
        state: Object.assign({}, component.state, component.__new__.state),
        props: component.__new__.props === undefined ? component.props : component.__new__.props,
        context: component.__new__.context === undefined ? component.context : component.__new__.context,
    };
    if (isCreate) {
        let innerComponent = Object.assign({ setState }, component);
        innerComponent['__proto__'] = component['__proto__'];
        component.componentWillMount.call(innerComponent);
    } else {
        if (opts === RenderMode.ASYNC_RENDER && !component.shouldComponentUpdate(newObj.props, newObj.state, newObj.context)) { return component.__dom__; }

        component.componentWillUpdate(newObj.props, newObj.state, newObj.context);

        component.state = newObj.state;
        component.props = newObj.props;
        component.context = newObj.context;

    }
    let vnode: VNode = component.render(component.props, component.context);
    if (vnode != null) {
        vnode.childrenRef_bind(component);
    }
    let dom = diff(vnode, component.__dom__, context);
    component.__dom__ = dom;
    if (dom.__components__ == null) {
        dom.__components__ = [component];
    } else {
        if (!dom.__components__.includes(component)) {
            dom.__components__.push(component);
        }
    }
    if (isCreate) {
        DidMounts.push(component);
    } else {
        component.componentDidUpdate(old.props, old.state, old.context);
    }
    return dom;
}
export function createComponent(Ctor, props, context) {
    let inst;
    // 类形式的组件
    if (Ctor.prototype && Ctor.prototype.render) {
        // if (Ctor.prototype.getDefaultProps) {
        //     Ctor.defaultProps = Ctor.prototype.getDefaultProps();
        // }
        let t_props = propsClone({}, Ctor.defaultProps, props);
        inst = new Ctor(t_props, context);
        if (inst.context == null) inst.context = context;
        inst.context = Object.assign({}, inst.context, inst.getChildContext());
        if (inst.__new__ === undefined) {
            inst.__new__ = { state: {} };
        }

    } else {
        // 无状态组件
        class StatelessComponent extends Component {
            render() { }
        }
        inst = new StatelessComponent(props, context);
        inst.constructor = Ctor;
        inst.render = inst.constructor;
    }
    return inst;
}
export function RenderComponentFromVNode(vnode: VNode, dom, context: any) {
    let component: Component = dom && dom.__components__ && dom.__components__.find((c) => { return c.constructor === vnode.name; });
    if (component && component.constructor === vnode.name) {

        component.__new__.props = propsClone(component.props, vnode.name.defaultProps, vnode.props, true);
        component.__new__.context = Object.assign({}, component.context, context);
        let innerComponent = Object.assign({ setState }, component);
        innerComponent['__proto__'] = component['__proto__'];
        component.componentWillReceiveProps.call(innerComponent, component.__new__.props, component.__new__.context);
        if (vnode.props.ref) {
            vnode.props.ref(component);
        }
        return renderComponent(component, RenderMode.ASYNC_RENDER, context, false);
    } else {
        if (dom) {
            //        recollectNodeTree(dom, false);
        }
        component = createComponent(vnode.name, vnode.props, context);
        // 如果 props绑定ref
        if (vnode.props.ref) {
            vnode.props.ref(component);
        }
        return renderComponent(component, RenderMode.ASYNC_RENDER, component.context, true);
    }
}

export function unmountComponent(component: Component) {
    component.componentWillUnmount();
}