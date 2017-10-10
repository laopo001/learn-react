/**
 * @author dadigua
 */
import { create } from './vdom/diff';


export function render(vnode, parent) {

    return create(vnode, {}, parent);
}
