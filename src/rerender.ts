/**
 * @author dadigua
 */
import { Component } from './component';
import { renderComponent, callDidMount, findParentComponent } from './vdom/componentUtil';
import { RenderMode } from './config/';
// import { recollectNodeTree } from './vdom/diff';
let enqueue: Component[] = [];

export const defer = typeof Promise === 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

export function enqueueRender(component: Component) {
    if (enqueue.push(component) === 1) {
        defer(rerender);
    }
}

function rerender() {
    let component: Component, list = enqueue;
    enqueue = [];
    while (component = list.pop()) {
        let out = renderComponent(component, RenderMode.ASYNC_RENDER, component.context, false);
        if (component._renderCallbacks != null) {
            while (component._renderCallbacks.length) component._renderCallbacks.pop().call(component);
        }
        while (component.__parentComponent__) {
            component = component.__parentComponent__;
        }
        callDidMount();
    }
}


export function forceRender(component: Component) {
    renderComponent(component, RenderMode.SYNC_RENDER, component.context, false);
    callDidMount();
}

