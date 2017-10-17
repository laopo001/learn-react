/**
 * @author dadigua
 */
import { enqueueRender, forceRender } from './rerender';


export class Component {
    __dom__;
    __vnode__;
    __renderCount__: number = 0;
    state = {};
    refs = {};
    private _renderCallbacks = [];
    private _dirty = true;
    get dirty() {
        return this._dirty;
    }
    constructor(public props, public context) {
    }
    getChildContext() {
        return {};
    }
    setState(state, callback?) {
        Object.assign(this.state, state);
        if (callback) this._renderCallbacks.push(callback);
        enqueueRender(this);
    }
    forceUpdate(callback) {
        if (callback) this._renderCallbacks.push(callback);
        forceRender(this);
    }
    componentWillMount() { }
    componentDidMount() { }
    componentWillUpdate(nextProps, nextState) { }
    componentDidUpdate(prevProps, prevState) { }
    componentWillUnmount() { }
    componentWillReceiveProps(nextProps) { }
    shouldComponentUpdate(nextProps, nextState) { }
    render(): any {

    }
}

