/**
 * @author dadigua
 */
import { create } from './vdom/diff';
import { h } from './h';
import { Component } from './component';
import { renderComponent } from './vdom/componentUtil';
import { RenderMode } from './config/';

export function findDOMNode(component) {
    return component.__dom__;
}

const ARR = [];
export const Children = {
    map(children, fn, ctx) {
        if (children == null) return null;
        children = Children.toArray(children);
        if (ctx && ctx !== children) fn = fn.bind(ctx);
        return children.map(fn);
    },
    forEach(children, fn, ctx) {
        if (children == null) return null;
        children = Children.toArray(children);
        if (ctx && ctx !== children) fn = fn.bind(ctx);
        children.forEach(fn);
    },
    count(children) {
        return children && children.length || 0;
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


export function render(vnode, parent) {
    let dom = create(vnode, {}, parent);
    return dom.__components__[0];
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
    // let componentDOM = renderComponent(wrap, RenderMode.ASYNC_RENDER, parentComponent.context, true);
    // container.appendChild(componentDOM);
    let componentDOM = create(wrap, {}, container);
    // let renderContainer = render(wrap, container);
    // let component = renderContainer._component || renderContainer.base;
    let component = componentDOM.__components__[0];
    if (callback) callback.call(component, componentDOM);
    return component;
}