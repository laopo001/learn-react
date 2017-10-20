/**
 * @author dadigua
 */

export class VNode {
    key;
    type;
    constructor(public name, public props, children) {
        this.props = this.props == null ? {} : this.props;
        this.key = this.props.key;
        this.type = name;
        if (children.length === 1) {
            this.props.children = children[0];
        } else if (children.length > 1) {
            this.props.children = children;
        }
        // switch (children.length) {
        //     // case 0: this.props.children = undefined; break;
        //     case 1: this.props.children = children[0]; break;
        //     case 2: this.props.children = children; break;
        // }
    }
    get children() {
        if (this.props.children === undefined) { return []; }
        if (this.props.children.constructor === Array) {
            return this.props.children;
        } else {
            return [this.props.children];
        }
    }
    isSameName(dom) {
        return dom.normalizedNodeName === this.name || dom.nodeName.toLowerCase() === this.name.toLowerCase();
    }
    createDom(isSvg?) {
        let dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', this.name) : document.createElement(this.name);
        dom.normalizedNodeName = this.name;
        return dom;
    }
    childrenRef_bind(component) {
        function run(vnode, component) {
            if (vnode instanceof VNode) {
                if ('ref' in vnode.props && vnode.props.ref.funcName === '__ref_string__') {
                    // this只有第一次bind生效；
                    vnode.props.ref = vnode.props.ref.bind(component);
                }
                vnode.children.forEach((x) => {
                    run(x, component);
                });
            }
        }
        run(this, component);
    }
}
