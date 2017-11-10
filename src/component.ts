/**
 * @author dadigua
 */
import { enqueueRender, forceRender } from './rerender';

export interface ICache {
    state;
    props?;
    context?;
}

export abstract class Component {
    __dom__: Element;
    __new__: ICache = {
        state: {}
    };
    __old__: ICache = {
        state: {}
    };
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
        this.__new__.state = Object.assign(this.__new__.state, state);
        if (callback) this._renderCallbacks.push(callback);
        enqueueRender(this);
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

