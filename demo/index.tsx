/**
 * @author dadigua
 */
import React, { Component, render } from 'react';
import * as Button from 'antd/lib/button';
import * as Icon from 'antd/lib/icon';
import * as Affix from 'antd/lib/affix';
import * as Breadcrumb from 'antd/lib/breadcrumb';
import * as Menu from 'antd/lib/menu';


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

function BreadcrumbDemo(props) {
    return <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
    </Breadcrumb>
}
function MenuDemo(props) {
    return <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3d menu item</a>
        </Menu.Item>
    </Menu>
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
        return <div id='qq' style={{ background: '#eee', height: 1000 }}>
            {/* {this.state.name} <br /> */}

            <ButtonDemo />
            <IconDemo />
            <AffixDemo />
            <BreadcrumbDemo />
            <MenuDemo />
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
