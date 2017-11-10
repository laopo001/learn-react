/**
 * @author dadigua
 */
import React, { Component, render } from 'react';



import { Pagination, Button, Icon, Affix, Breadcrumb, Menu, Dropdown, Select, Tooltip, Tabs } from 'antd';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

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
            <Button type='primary'>Affix top</Button>
        </Affix>
        <br />
        <Affix offsetBottom={0}>
            <Button type='primary'>Affix bottom</Button>
        </Affix>
    </div>
}

function BreadcrumbDemo(props) {
    return <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item><a href=''>Application Center</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href=''>Application List</a></Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
    </Breadcrumb>
}
function DropdownDemo(props) {
    let menu = <Menu>
        <Menu.Item>
            <a target='_blank' rel='noopener noreferrer' href='http://www.alipay.com/'>1st menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target='_blank' rel='noopener noreferrer' href='http://www.taobao.com/'>2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target='_blank' rel='noopener noreferrer' href='http://www.tmall.com/'>3d menu item</a>
        </Menu.Item>
    </Menu>
    return <Dropdown overlay={menu}>
        <a className='ant-dropdown-link' href='#'>
            Hover me <Icon type='down' />
        </a>
    </Dropdown>
}
function PaginationDemo(props) {
    return <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={(pageNumber) => { console.log('Page: ', pageNumber); }} />
}

function SelectDemo(props) {
    function handleChange(value) {
        console.log(`selected ${value}`);
    }
    return <div>
        <Select defaultValue='lucy' style={{ width: 120 }} onChange={handleChange}>
            <Option value='jack'>Jack</Option>
            <Option value='lucy'>Lucy</Option>
            <Option value='disabled' disabled>Disabled</Option>
            <Option value='Yiminghe'>yiminghe</Option>
        </Select>
    </div>
}

function TooltipDemo() {
    return <Tooltip title='prompt text'>
        <span>Tooltip will show when mouse enter.</span>
    </Tooltip>
}

const Es5 = React.createClass({
    getInitialState() {
        return { name: 123 };
    },
    render: function () {
        return (
            <div>{this.state.name}
                <img alt={this.props.description} src={this.props.src} />
            </div>
        );
    }
});

class Root extends Component {
    state = {
        name: '',
        id: 'qq',
        c: 'szxvzxv'
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
            {<Tabs defaultActiveKey='1' onChange={() => { }}>
                <TabPane tab='Tab 1' key='1'>Content of Tab Pane 1</TabPane>
                <TabPane tab='Tab 2' key='2'>Content of Tab Pane 2</TabPane>
                <TabPane tab='Tab 3' key='3'>Content of Tab Pane 3</TabPane>
            </Tabs>}
            <Es5 src='https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3247817123,3423989056&fm=173&s=C5F21CC56C01014B5291A9180300D0D3&w=218&h=146&img.JPG' />
            {this.state.c}
            {/* {this.state.name} <br /> */}

            {/*             {<ButtonDemo />}
            {<IconDemo />}
            {<AffixDemo />}
            {<BreadcrumbDemo />} */}
            {/* <DropdownDemo /> */}
            {<SelectDemo />}
            <PaginationDemo />
            {/* <TooltipDemo /> */}
            {<button onClick={() => {
                this.setState({ name: 'root++', c: <Book long='ppp'>children</Book> });
            }}>update</button>}

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
                this.props.children
            }{
                this.props.children
            }</div>;
    }
}

render(<Root />, document.getElementById('root'));
