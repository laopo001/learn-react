/**
 * @author dadigua
 */

import React, { Component, render } from '../src/index';


class Root extends Component {
    state = {
        name: 'root'
    };

    componentDidMount() {
        console.log(this);
        this.setState({ name: 'root++' });
    }
    render() {
        return <div>{this.state.name}<Book>children</Book></div>;
    }
}

class Book extends Component {
    render() {
        return <div>Book<h3>{this.props.children}</h3></div>;
    }
}
render(<div><Root></Root></div>, document.getElementById('root'));
