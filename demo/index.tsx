/**
 * @author dadigua
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import * as createReactClass from 'create-react-class';


import { Pagination, Button, Icon, Affix, Breadcrumb, Menu, Dropdown, Select, Tooltip, Tabs, Mention } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { toString, toContentState } = Mention;
import { Editor, EditorState } from 'draft-js';
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

const Greeting = createReactClass({
    componentDidMount() {
        this.setState({ cout: 1 });
    },
    render: function () {
        return <h1>Hello, {this.props.name}</h1>;
    }
});
class MyEditor extends React.Component {
    onChange;
    state;
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = (editorState) => {
            this.setState({ editorState })
        };
    }
    qq(e) {
        // e.stopPropagation();
        console.log(123, e.persist().target)
    }
    render() {
        return (
            <div onSelect={this.qq} >
                <input value="123" />
                <div contentEditable>contentEditable </div>
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
                <Mention
                    style={{ width: '100%' }}
                    onChange={(suggestion) => {
                        console.log('onSelect', suggestion);
                    }}
                    defaultValue={toContentState('@afc163')}
                    suggestions={['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご']} onSelect={(contentState) => {
                        console.log(toString(contentState));
                    }}
                />
            </div>
        );
    }
}
class Root extends Component {
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
            <MyEditor />
            <input onChange={(e) => { console.log(e); }} />
            <Greeting name='ggg' />
            <br />
            {<Tabs defaultActiveKey='1' onChange={() => { }}>
                <TabPane tab='Tab 1' key='1'>Content of Tab Pane 11</TabPane>
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
            <Me />
            {/* <TooltipDemo /> */}
            {<button onClick={() => {
                this.setState({ name: 'root++', c: <Book long='ppp'>children</Book> });
            }}>update</button>}

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
render(<Root />, document.getElementById('root'));
