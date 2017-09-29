/**
 * @author dadigua
 */

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
*/
export function isNamedNode(node, nodeName) {
    return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}
/** Create an element with the given nodeName.
*	@param {String} nodeName
*	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
*	@returns {Element} node
*/
export function createNode(nodeName, isSvg) {
    let node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    node.normalizedNodeName = nodeName;
    return node;
}
/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
export function isSameNodeType(node, vnode, hydrating) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return node.splitText !== undefined;
    }
    if (typeof vnode.nodeName === 'string') {
        return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
    }
    return hydrating || node._componentConstructor === vnode.nodeName;
}


