/**
 * @author dadigua
 */
import { enqueueRender, forceRender } from './rerender';
import { VNode } from './vnode';
export interface ICache {
    state;
    props?;
    context?;
    direct: boolean;
}

export abstract class Component {
    __dom__: Element;
    __new__: ICache = {
        state: {},
        direct: false
    };
    __parentComponent__: Component;
    state: any = {};
    refs: any = {};
    private _renderCallbacks = [];
    // private _dirty = true;
    // get dirty() {
    //     return this._dirty;
    // }
    constructor(public props, public context) {

    }
    getChildContext() {
        return {};
    }
    setState(state, callback?) {
        if (typeof state === 'function') {
            state = state(this.state);
        }
        if (this.__new__.direct === false) {
            this.__new__.state = Object.assign(this.__new__.state, state);
            if (callback) this._renderCallbacks.push(callback);
            enqueueRender(this);
        } else {
            this.__new__.state = Object.assign({}, this.state, state);
            if (callback) this._renderCallbacks.push(callback);
        }

    }
    replaceState(state, callback?) {
        // if (typeof state === 'function') {
        //     state = state(this.state);
        // }
        // if (this.__new__.direct === false) {
        //     this.__new__.state = Object.assign(this.__new__.state, state);
        //     if (callback) this._renderCallbacks.push(callback);
        //     enqueueRender(this);
        // } else {
        //     this.__new__.state = Object.assign({}, this.state, state);
        //     if (callback) this._renderCallbacks.push(callback);
        // }

    }
    forceUpdate(callback) {
        if (callback) this._renderCallbacks.push(callback);
        forceRender(this);
    }
    componentWillMount() { }
    componentDidMount() { }
    componentWillUpdate(nextProps, nextState, nextContext) { }
    componentDidUpdate(prevProps, prevState, prevContext) { }
    componentWillUnmount() { }
    componentWillReceiveProps(nextProps, nextContext) { }
    shouldComponentUpdate(nextProps, nextState, nextContext): boolean { return true; }
    abstract render(props, context);
}

export abstract class PureComponent extends Component {

}