/**
 * @author dadigua
 */

export class VNode {
    component;
    key;
    constructor(public name, public props, public children) {
        this.props = this.props == null ? {} : this.props;
        this.key = this.props.key;
    }
    isSameName(dom) {
        return dom.normalizedNodeName === this.name || dom.nodeName.toLowerCase() === this.name.toLowerCase();
    }
    createDom(isSvg?) {
        let dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', this.name) : document.createElement(this.name);
        dom.normalizedNodeName = this.name;
        return dom;
    }
}
