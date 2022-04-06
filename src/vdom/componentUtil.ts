/**
 * @author dadigua
 */

import { RenderMode } from '../config/';
import { Component, StatelessComponent } from '../component';
import { VNode } from '../vnode';
import { diff } from './diff';
import { propsClone } from './util';

export let DidMounts = [];



export function callDidMount() {
    let component;
    while (component = DidMounts.pop()) {
        component.componentDidMount();
    }
    // DidMounts.forEach(c => {
    //     c.componentDidMount();
    // });
    // DidMounts = [];
}


export function renderComponent(component: Component, opts: RenderMode, context, isCreate: boolean) {
    let old = { state: component.state, props: component.props, context: component.context };

    if (isCreate) {

        component.__new__.direct = true;
        component.componentWillMount();
        component.__new__.direct = false;
        component.state = Object.assign({}, component.state, component.__new__.state);

        DidMounts.push(component);

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
    if (vnode == null) {
        return
    }
    try {
        let i = 0;

        let oldVNode = component.oldVNode;
        let dom = component.__dom__;
        let last = oldVNode;
        while (last) {
            dom = last.__dom__;
            if (dom != null) {
                break;
            }
            last = last.child
        }
        let parent = dom.parentElement;
        let first = null;
        let ret;
        // let fristvnode = vnode;
        let last_now = Date.now()
        let run = (sync) => {
            if (!sync) {
                last_now = Date.now()
            }
            // while (i < Infinity) {
            let endSiblingNode, endSiblingElement;
            let j = 0;
            ret = diff(vnode, oldVNode, dom, parent, context);
            if (ret) {
                vnode.__dom__ = ret;
            }
            if (first == null && ret) {
                first = ret;
            }
            if (j == 0 && (vnode.child && vnode.child.traversed == false)) {
                if (typeof vnode.name != 'function') {
                    parent = ret;
                    dom = dom && dom.firstChild;
                }
                vnode = vnode.child;
                oldVNode = oldVNode && oldVNode.child;
                j = 1;
            }
            if (j == 0 && (vnode.child && vnode.child.traversed && vnode.sibling || !vnode.child && vnode.sibling)) {
                vnode = vnode.sibling;
                if (endSiblingNode == null && oldVNode && oldVNode.sibling == null) {
                    endSiblingNode = oldVNode;
                    endSiblingElement = dom;
                }
                oldVNode = oldVNode && oldVNode.sibling;
                dom = dom && dom.nextSibling;
                j = 1;
            }
            if (j == 0 && (vnode.child && vnode.child.traversed && !vnode.sibling && vnode.return || !vnode.child && !vnode.sibling && vnode.return)) {
                vnode = vnode.return;
                if (endSiblingNode) {
                    oldVNode = endSiblingNode.return;
                    endSiblingNode = null
                    dom = endSiblingElement;
                    endSiblingElement = null
                } else {
                    if (oldVNode != null) {
                        let nextSibling = dom.nextSibling;
                        while (oldVNode.return == null) {
                            oldVNode = oldVNode.sibling;
                            dom = nextSibling;

                            nextSibling = dom && dom.nextSibling
                            oldVNode && diff(null, oldVNode, dom, parent, context);
                        }
                        oldVNode = oldVNode.return;
                    } else {
                        oldVNode = null;
                    }
                }

                if (typeof vnode.name != 'function') {
                    dom = parent;
                    parent = parent.parentElement
                }
                j = 1;
            }
            component.oldVNode = vnode;
            if (j == 0) {
                // break;
            } else {
                let now = Date.now()

                if (now - last_now < 5) {
                    run(true);
                } else {
                    console.log(123)
                    requestAnimationFrame(function () {
                        run(false);
                    });
                }

            }
            i++;

            // }
        }
        run(true);

        if (!isCreate) {
            component.componentDidUpdate && component.componentDidUpdate(old.props, old.state, old.context);
        }
        return first;
    } catch (e) {
        console.log(e)
    }

}
export function setParentComponent(dom, component: Component) {
    try {
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
    } catch (e) {
        console.log(e)
    }
}

export function findParentComponent(dom, vnode: VNode, last?: boolean): Component | null {
    if (dom == null) {
        return null;
    }
    if (last) {
        let c: Component = dom.__parentComponent__;
        while (c) {
            c = c.__parentComponent__;
        }
        return c;
    }

    if (dom.__parentComponent__ == null) {
        return null;
    } else {
        let c: Component = dom.__parentComponent__;
        while (c) {
            if (c.constructor === vnode.name) { return c; }
            c = c.__parentComponent__;
        }
        return null;
    }
}


export function createComponent(Ctor, props, context) {
    let component;
    // 类形式的组件
    if (Ctor.prototype && Ctor.prototype.render && !Ctor.prototype.isStatelessComponent) {
        let t_props = propsClone({}, Ctor.defaultProps, props);
        component = new Ctor(t_props, context);
        // component.constructor = Ctor;
        component.__proto__.constructor = Ctor;
        if (component.props == null) component.props = t_props;
        if (component.context == null) component.context = context;
        if (component.__new__ === undefined) {
            component.__new__ = { state: {} };
        }

    } else {
        // 无状态组件
        let t_props = propsClone({}, Ctor.defaultProps, props);

        Ctor.prototype = new StatelessComponent(t_props, context)
        Ctor.prototype.render = Ctor;
        Ctor.prototype.constructor = Ctor;

        component = {};
        component.__proto__ = Ctor.prototype;
        Ctor.call(component, t_props, context);
        // component.constructor = Ctor;
        // component.__proto__.constructor = Ctor;
        // component.render = Ctor;
    }
    return component;
}
export function GetComponentVNode(vnode: VNode, dom, context: any) {
    let component: Component = findParentComponent(dom, vnode);
    if (component && component.constructor === vnode.name) {
        if (vnode.props.ref) {
            vnode.props.ref(component.getPublicInstance());
            delete vnode.props.ref;
        }
        component.__new__.props = propsClone({}, vnode.name.defaultProps, vnode.props);
        component.__new__.context = Object.assign({}, component.context, context);
        component.__new__.direct = true;
        component.componentWillReceiveProps(component.__new__.props, component.__new__.context);
        component.__new__.direct = false;

        let componentvnode = component.render(component.props, component.context);
        componentvnode.component = component;
        component.oldVNode = componentvnode;
        return componentvnode;
    } else {

        let component: Component = createComponent(vnode.name, vnode.props, context);
        // 如果 props绑定ref
        if (vnode.props.ref) {
            vnode.props.ref(component.getPublicInstance());
            delete component.props.ref;
        }
        let componentvnode = component.render(component.props, component.context);
        componentvnode.component = component;
        component.oldVNode = componentvnode;
        return componentvnode;
    }
}

export function RenderComponentFromVNode(vnode: VNode, dom, context: any) {
    let component: Component = findParentComponent(dom, vnode);
    if (component && component.constructor === vnode.name) {
        if (vnode.props.ref) {
            vnode.props.ref(component.getPublicInstance());
            delete vnode.props.ref;
        }
        component.__new__.props = propsClone({}, vnode.name.defaultProps, vnode.props);
        component.__new__.context = Object.assign({}, component.context, context);
        component.__new__.direct = true;
        component.componentWillReceiveProps(component.__new__.props, component.__new__.context);
        component.__new__.direct = false;

        return renderComponent(component, RenderMode.ASYNC_RENDER, context, false);
    } else {

        let component: Component = createComponent(vnode.name, vnode.props, context);
        // 如果 props绑定ref
        if (vnode.props.ref) {
            vnode.props.ref(component.getPublicInstance());
            delete component.props.ref;
        }
        return renderComponent(component, RenderMode.ASYNC_RENDER, context, true);
    }
}

export function unmountComponent(component: Component) {
    component.componentWillUnmount();
}