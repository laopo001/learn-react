/**
 * @author dadigua
 */
import { Component } from './component';
import { renderComponent, callDidMount } from './vdom/componentUtil';
import { RenderMode } from './config/';

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
        renderComponent(component, RenderMode.ASYNC_RENDER, component.getChildContext(), false);
        callDidMount();
    }
}


export function forceRender(component: Component) {
    renderComponent(component, RenderMode.SYNC_RENDER, component.getChildContext(), false);
    callDidMount();
}

