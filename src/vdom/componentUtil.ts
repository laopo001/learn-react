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
callDidMount['isFirstCreate'] = true;


export function renderComponent(component: Component, opts: RenderMode, context, isCreate: boolean) {
    let old = { state: component.state, props: component.props, context: component.context };
    // let newObj = {
    //     state: Object.assign({}, component.state, component.__new__.state),
    //     props: component.__new__.props === undefined ? component.props : component.__new__.props,
    //     context: component.__new__.context === undefined ? component.context : component.__new__.context,
    // };
    if (isCreate) {

        component.__new__.direct = true;
        component.componentWillMount();
        component.__new__.direct = false;
        component.state = Object.assign({}, component.state, component.__new__.state);
        // component.props = component.__new__.props === undefined ? component.props : component.__new__.props;
        // component.context = component.__new__.context === undefined ? component.context : component.__new__.context;
    } else {
        let newObj = {
            state: Object.assign({}, component.state, component.__new__.state),
            props: component.__new__.props === undefined ? component.props : component.__new__.props,
            context: component.__new__.context === undefined ? component.context : component.__new__.context,
        };
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
    let nextContext = Object.assign({}, component.context, component.getChildContext());
    let dom = diff(vnode, component.__dom__, nextContext);
    component.__dom__ = dom;
    setParentComponent(dom, component);
    if (isCreate) {
        DidMounts.push(component);
    } else {
        component.componentDidUpdate && component.componentDidUpdate(old.props, old.state, old.context);
    }
    return dom;
}
export function setParentComponent(dom, component: Component) {
    if (dom.__parentComponent__ == null) {
        dom.__parentComponent__ = component;
    } else {
        let c = dom.__parentComponent__;
        if (c === component) { return; }
        while (c.__parentComponent__) {
            c = c.__parentComponent__;
            if (c === component) { return; }
        }
        c.__parentComponent__ = component;
    }
}

export function findParentComponent(dom, vnode: VNode , type = 'vnode'): Component | null {
    if (dom == null) {
        return null;
    }
    if (type === 'vnode') {
        if (dom.__parentComponent__ == null) {
            return null;
        } else {
            let c = dom.__parentComponent__;
            if (c.constructor === vnode.name) { return c; }
            while (c.__parentComponent__) {
                c = c.__parentComponent__;
                if (c.constructor === vnode.name) { return c; }
            }
            return null;
        }
    } else {
        const component = vnode as any;
        if (dom.__parentComponent__ == null) {
            return null;
        } else {
            let c = dom.__parentComponent__;
            if (c === component) { return c; }
            while (c.__parentComponent__) {
                c = c.__parentComponent__;
                if (c === component) { return c; }
            }
            return null;
        }
    }

}

export function createComponent(Ctor, props, context) {
    let component;
    // 类形式的组件
    if (Ctor.prototype && Ctor.prototype.render) {
        let t_props = propsClone({}, Ctor.defaultProps, props);
        component = new Ctor(t_props, context);
        component.constructor = Ctor;
        if (component.props == null) component.props = t_props;
        if (component.context == null) component.context = context;
        if (component.__new__ === undefined) {
            component.__new__ = { state: {} };
        }

    } else {
        // 无状态组件
        class StatelessComponent extends Component {
            render() { }
        }
        component = new StatelessComponent(props, context);
        component.constructor = Ctor;
        component.render = component.constructor;
    }
    return component;
}
export function RenderComponentFromVNode(vnode: VNode, dom, context: any) {
    let component: Component = findParentComponent(dom, vnode);
    if (component && component.constructor === vnode.name) {
        component.__new__.props = propsClone({}, vnode.name.defaultProps, vnode.props);
        component.__new__.context = Object.assign({}, component.context, context);
        component.__new__.direct = true;
        component.componentWillReceiveProps(component.__new__.props, component.__new__.context);
        component.__new__.direct = false;
        if (vnode.props.ref) {
            vnode.props.ref(component);
            delete vnode.props.ref;
        }
        return renderComponent(component, RenderMode.ASYNC_RENDER, context, false);
    } else {

        let component: Component = createComponent(vnode.name, vnode.props, context);

        // 如果 props绑定ref
        if (vnode.props.ref) {
            vnode.props.ref(component);
            delete vnode.props.ref;
        }
        return renderComponent(component, RenderMode.ASYNC_RENDER, context, true);
    }
}

export function unmountComponent(component: Component) {
    component.componentWillUnmount();
}