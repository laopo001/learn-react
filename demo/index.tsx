/**
 * @author dadigua
 */
import React, { Component, render } from 'react';
import * as Button from 'antd/lib/button';
import * as Icon from 'antd/lib/icon';
import * as Affix from 'antd/lib/affix';
import * as Breadcrumb from 'antd/lib/breadcrumb';
import * as Menu from 'antd/lib/menu';
import * as Dropdown from 'antd/lib/dropdown';
import * as Pagination from 'antd/lib/pagination';
import * as Select from 'antd/lib/select';
const Option = Select.Option;
import * as Tooltip from 'antd/lib/tooltip';


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
function DropdownDemo(props) {
    let menu = <Menu>
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
    return <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="#">
            Hover me <Icon type="down" />
        </a>
    </Dropdown>
}
function PaginationDemo(props) {
    return <Pagination defaultCurrent={1} total={50} />
}

function SelectDemo(props) {
    function handleChange(value) {
        console.log(`selected ${value}`);
    }
    return <div>
        <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
        </Select>
    </div>
}

function TooltipDemo() {
    return <Tooltip title="prompt text">
        <span>Tooltip will show when mouse enter.</span>
    </Tooltip>
}



class Root extends Component {
    state = {
        name: '',
        id: 'qq',
        c: <Book long='ppp'>children</Book>
    };
    getChildContext() {
        return { name: 'context+++' };
    }
    componentDidMount() {
        console.log(this.refs.book);
    }
    render() {
        return <div id='qq' style={{ background: '#eee', height: 1000 }}>
            <br />
            {/* <Book ><h6 ref='book' onClick={() => { console.log(123); }}>book</h6></Book> */}
            {/* {this.state.name} <br /> */}

            {/*             {<ButtonDemo />}
            {<IconDemo />}
            {<AffixDemo />}
            {<BreadcrumbDemo />} */}
            {/* <DropdownDemo /> */}
           {/*  <SelectDemo /> */}
             <PaginationDemo />
            {/* <TooltipDemo /> */}
            {/* <button onClick={() => {
                this.setState({ name: 'root++', c: undefined });
            }}>update</button> */}

        </div >;
    }
}

class Book extends Component<any, any> {
    componentDidMount() {
        console.log(this.refs.dom);
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    render() {
        return <div ref='dom'>
            {
                React.cloneElement(this.props.children, { onClick: () => { console.log(999); } })
            }{
                this.props.children
            }{
                this.props.children
            }</div>;
    }
}

render(<Root />, document.getElementById('root'));
