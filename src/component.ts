/**
 * @author dadigua
 */
import { enqueueRender, forceRender } from './rerender';
// import { VNode } from './vnode';
export interface ICache {
    state;
    props?;
    context?;
    direct: boolean;
}

export abstract class Component {
    __dom__: any;
    __new__: ICache = {
        state: {},
        direct: false
    };
    __parentComponent__: Component;
    state: any = {};
    refs: any = {};
    public _renderCallbacks = [];
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
            state = state(this.state, this.props);
        }
        if (this.__new__.direct === false) {
            this.__new__.state = Object.assign(this.__new__.state, state);
            if (callback) (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
            enqueueRender(this);
        } else {
            this.__new__.state = Object.assign(this.__new__.state, state);
            // this.__new__.state = Object.assign({}, this.state, state);
            if (callback) (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
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
        console.warn('replaceState');
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
    getPublicInstance() {
        if ((this as any).isStatelessComponent) {
            return null;
        }
        return this;
    }
    abstract render(props, context);
}

export abstract class PureComponent extends Component {

}

export class StatelessComponent extends Component {
    isStatelessComponent = true
    render() { }
}