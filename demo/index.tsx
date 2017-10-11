/**
 * @author dadigua
 */

import React, { Component, render } from '../src/index';


class Root extends Component {
    state = {
        name: '',
        id: 'qq',
        c: <Book long='ppp'>children</Book>
    };

    componentDidMount() {
        console.log(this);
    }
    render() {
        return <div id='qq' style={{ background: '#eee' }}>
            {this.state.name}
            {this.state.c}
            <button onClick={() => {
                this.setState({ name: 'root++', c: undefined });
            }}>update</button>

        </div >;
    }
}

class Book extends Component {
    componentDidMount() {
        console.log(this);
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    render() {
        return <div>Book</div>;
    }
}
render(<Root></Root>, document.getElementById('root'));
