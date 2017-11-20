/**
 * @author dadigua
 */
import { create } from './vdom/diff';
import { h } from './h';
import { Component } from './component';
import { renderComponent, RenderComponentFromVNode, findParentComponent } from './vdom/componentUtil';
import { RenderMode } from './config/';
import { recollectNodeChildren } from './vdom/diff';

export function findDOMNode(component: Component) {
    return component && component.__dom__ || null;
}

const ARR = [];
export const Children = {
    map(children, fn, ctx) {
        if (children == null) return null;
        children = Children.toArray(children);
        if (ctx && ctx !== children) fn = fn.bind(ctx);
        return children.map((a, b, c) => {
            return fn(a, b);
        });
    },
    forEach(children, fn, ctx) {
        if (children == null) return null;
        children = Children.toArray(children);
        if (ctx && ctx !== children) fn = fn.bind(ctx);
        children.forEach(fn);
    },
    count(children) {
        if (children == null) { return 0; }
        else if (children.constructor === Array) {
            return children.length;
        } else {
            return 1;
        }
    },
    only(children) {
        children = Children.toArray(children);
        if (children.length !== 1) throw new Error('Children.only() expects only one child.');
        return children[0];
    },
    toArray(children) {
        if (children == null) return [];
        return ARR.concat(children);
    }
};


export function render(vnode, parent): Component {
    let dom = create(vnode, {}, parent);
    dom.__isContainer__ = true;
    return findParentComponent(dom, vnode);
}


class ContextProvider extends Component {
    getChildContext() {
        return this.props.context;
    }
    render() {
        return this.props.children;
    }
}

export function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
    let wrap = h(ContextProvider, { context: parentComponent.context }, vnode);
    let componentDOM;
    if (container.appended == null) {
        componentDOM = create(wrap, {}, container);
        container.appended = componentDOM;
    } else {
        componentDOM = RenderComponentFromVNode(wrap, container.appended, {});
    }
    let component = componentDOM && findParentComponent(componentDOM, vnode);
    if (callback) callback.call(component, componentDOM);
    return component;
}

export function unmountComponentAtNode(dom) {
    if (dom.__isContainer__ === true) {
        recollectNodeChildren(dom.childNodes, true);
    } else{
        console.error('不是容器');
    }
}