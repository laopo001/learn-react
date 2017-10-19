/**
 * @author dadigua
 */
import { Component } from './component';
import { renderComponent } from './vdom/componentUtil';
import { RenderMode } from './config/';

let enqueue: Component[] = [];

export const defer = typeof Promise === 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

export function enqueueRender(component: Component) {
    if (component.dirty && enqueue.push(component) === 1) {
        defer(rerender);
    }
}

function rerender() {
    let component, list = enqueue;
    enqueue = [];
    while (component = list.pop()) {
        renderComponent(component, RenderMode.ASYNC_RENDER, component.context, false);
    }
}


export function forceRender(component) {
    renderComponent(component, RenderMode.SYNC_RENDER, {}, false);
}

