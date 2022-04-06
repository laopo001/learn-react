/**
 * @author dadigua
 */
import { Component } from './component';

export class Base {
    _value = undefined;
    child: VNode;        // 子节点
    sibling: VNode;      // 兄弟节点
    return: VNode;    // 父节点
    traversed = false;
    constructor(value) {
        this._value = value;
    }
    valueOf() {
        return this._value;
    }
    toString() {
        return this._value.toString();
    }
}

export class VNode {
    __dom__
    key;
    get type() {
        return this.name;
    }
    set type(x) {
        this.name = x;
    }
    group: number;
    __parentComponent__: Component;
    component: Component;
    traversed = false;
    child: VNode;        // 子节点
    sibling: VNode;      // 兄弟节点
    return: VNode;    // 父节点
    constructor(public name, public props, children?) {
        this.props = this.props == null ? {} : this.props;
        this.key = this.props.key;
        this.type = name;
        if (children) {
            this.props.children = children;
            for (let i = 0; i < this.props.children.length; i++) {
                if (!(this.props.children[i] instanceof VNode)) {
                    try {
                        this.props.children[i] = new Base(this.props.children[i])
                    }
                    catch (e) {
                        console.log(e)
                    }
                }
            }

            for (let i = 1; i < this.props.children.length; i++) {

                this.props.children[i - 1].sibling = this.props.children[i];
            }
            this.props.children[this.props.children.length - 1].return = this;
            this.child = this.props.children[0];

            if (children.length === 0) {
                this.props.children = children;
            } else if (children.length === 1) {
                this.props.children = children[0];
            } else if (children.length > 1) {
                this.props.children = children;
            }
        }
    }

    get children() {
        if (this.props.children == null) { return []; }
        if (Array.isArray(this.props.children)) {
            return this.props.children;
        } else {
            return [this.props.children];
        }
    }
    get ref() {
        return this.props.ref;
    }
    isSameName(vnode) {
        return vnode.name && vnode.name.toLowerCase() === this.name.toLowerCase();
    }
    createDom(isSvg?) {
        let dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', this.name) : document.createElement(this.name);
        dom.normalizedNodeName = this.name;
        return dom;
    }
    childrenRef_bind(component: Component) {
        function run(vnode: VNode, component: Component) {
            if (vnode instanceof VNode) {

                if (vnode.props.ref && vnode.props.ref.funcName === '__ref_string__') {
                    // this只有第一次bind生效；
                    if (!Object.isExtensible(component.refs)) {
                        component.refs = Object.assign({}, component.refs);
                    }
                    // console.log(Object.isExtensible(component.refs));
                    vnode.props.ref = vnode.props.ref.bind(component);
                    vnode.props.ref.funcName = '__ref_string__false__';
                }

                vnode.children.forEach((x) => {
                    run(x, component);
                });
            }
        }
        try { run(this, component); }
        catch (e) {
            debugger;
        }
    }
}
