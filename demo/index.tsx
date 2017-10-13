/**
 * @author dadigua
 */
import React, { Component, render } from 'react';
import * as Button from 'antd/lib/button';
import * as Icon from 'antd/lib/icon';
import * as Affix from 'antd/lib/affix';

// import { Button } from 'antd';

function ButtonDemo(props) {
    return <Button>123123</Button>；
}

function IconDemo(props) {
    return <div>
        <Icon type='dingding-o' />
        <Icon type='chrome' />
    </div>
}

function AffixDemo(props) {
    return <div>
        <Affix>
            <Button type="primary">Affix top</Button>
        </Affix>
        <br />
        <Affix offsetBottom={0}>
            <Button type="primary">Affix bottom</Button>
        </Affix>
    </div>
}




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
            {/* {this.state.name} <br /> */}

            <ButtonDemo />
            <IconDemo />

            <button onClick={() => {
                this.setState({ name: 'root++', c: undefined });
            }}>update</button>

        </div >;
    }
}

class Book extends Component<any, any> {
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
