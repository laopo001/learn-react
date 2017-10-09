/**
 * @author dadigua
 */
import { diff } from './vdom/diff';


export function render(vnode, parent) {
    let dom = undefined;
    return diff(vnode, dom, {}, parent);
}
