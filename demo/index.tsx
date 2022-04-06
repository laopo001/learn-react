/**
 * @author dadigua
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import * as createReactClass from 'create-react-class';


import { Pagination, Button, Icon, Affix, Breadcrumb, Menu, Dropdown, Select, Tooltip, Tabs, Mention, Cascader } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { toString, toContentState } = Mention;
import { Editor, EditorState } from 'draft-js';

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];

function ButtonDemo(props) {
    return <Button>123123</Button>
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



interface AppProps { }
interface AppState {
    name: string;
    cout: number;
    c: JSX.Element | string;
}

class Root extends Component<AppProps, AppState> {
    state = {
        name: '',
        id: 'qq',
        c: 'szxvzxv',
        cout: 0
    };
    getChildContext() {
        return { name: 'context+++' };
    }
    componentDidMount() {
        this.setState({ cout: 1 });
        console.log(this.context);
    }
    render() {
        if (this.state.cout === 0) {
            return null;
        }
        return <div id='qq' style={{ background: '#eee', height: 1000 }}>

            <Cascader options={options} onChange={(value) => {
                console.log(value);
            }
            } placeholder="Please select" />

            <input onChange={(e) => { console.log(e); }} />

            <br />
            {<Tabs defaultActiveKey='1' onChange={() => { }}>
                <TabPane tab='Tab 1' key='1'>Content of Tab Pane 11</TabPane>
                <TabPane tab='Tab 2' key='2'>Content of Tab Pane 2</TabPane>
                <TabPane tab='Tab 3' key='3'>Content of Tab Pane 3</TabPane>
            </Tabs>}
            {this.state.c}
            {/* {this.state.name} <br /> */}

            {/*             {<ButtonDemo />}
            {<IconDemo />}
            {<AffixDemo />}
            {<BreadcrumbDemo />} */}
            {/* <DropdownDemo /> */}
            {<SelectDemo />}
            <PaginationDemo />
            <Me />
            {/* <TooltipDemo /> */}
            {<button onClick={() => {
                this.setState({ name: 'root++', c: <Book long='ppp'>children</Book> });
            }}>update</button>}
            <br />

        </div >;
    }
}

class Book extends Component<any, any> {
    getChildContext() {
        return { color: '9999' };
    }
    componentDidMount() {
        console.log('componentDidMount1', this.context);
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    render() {
        return <div ref='dom'><Q />
            {
                this.props.children
            }{
                this.props.children
            }</div>;
    }
}
class Q extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        console.log('componentDidMount2', this.context)
    }

    render() {
        return (
            <div>
                123123123
            </div>
        );
    }
}




class Me extends React.Component {
    state = {
        current: 'mail',
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
            >
                <Menu.Item key="mail">
                    <Icon type="mail" />Navigation One
                </Menu.Item>
                <Menu.Item key="app" disabled>
                    <Icon type="appstore" />Navigation Two
                </Menu.Item>
                <SubMenu title={<span><Icon type="setting" />Navigation Three - Submenu</span>}>
                    <MenuItemGroup title="Item 1">
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="Item 2">
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="alipay">
                    <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                </Menu.Item>
            </Menu>
        );
    }
}



class AppTest extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
        console.log(23)
    }

    render() {
        return (
            <span>
                AppTest

            </span >
        );
    }
}

class App extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            name: 'React',
            a: Array(5).fill(1).map((e, idx) => {
                return {
                    id: idx,
                    name: `aweaw${idx}`,
                };
            })
        };
    }

    test() {
        // this.state.a.unshift({
        //     id: 6,
        //     name: `66666`,
        // })
        this.setState({
            a: [...this.state.a, ...this.state.a]
        }, () => {
            console.log(this.state.a);

        })

    }
    render() {
        return (
            <div id="test">

                <p>
                    Start editing to see some magic happen :)
                </p>
                <button onClick={this.test.bind(this)}>test</button>
                <div>
                    {
                        this.state.a.map((x) => {
                            return <div key={x.id}>{x.name}<AppTest /></div>
                        })
                    }

                </div>
            </div >
        );
    }
}

render(<App />, document.getElementById('root'));
