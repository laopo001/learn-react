/**
 * @author dadigua
 */

import React, { Component, render } from '../src/index';


class Root extends Component {
    render() {
        return <Book>zcvzxvczxvc</Book>;
    }
}

class Book extends Component {
    render() {
        return <div>123 978{this.props.children}</div>;
    }
}
render(222, document.getElementById('root'));
