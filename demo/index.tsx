/**
 * @author dadigua
 */

import React, { Component, render } from 'treact';
import * as Button from 'antd/lib/button';

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
            <Button >123123</Button>
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
render(<Root />, document.getElementById('root'));
