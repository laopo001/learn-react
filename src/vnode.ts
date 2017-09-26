/**
 * @author dadigua
 */

export class VNode {
    key;
    constructor(public nodeName, public children, public attributes) {
        this.key = attributes == null ? undefined : attributes.key;
    }
}
