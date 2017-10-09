/**
 * @author dadigua
 */

export class VNode {
    key;
    constructor(public name, public props, public children) {
        this.key = props == null ? undefined : props.key;
    }
}
