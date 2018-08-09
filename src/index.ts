/**
 * @author dadigua
 */
import { h, cloneElement, isValidElement, createClass } from './h';
import { Component, PureComponent } from './component';
// import { render } from './render';
import { VNode } from './vnode';
import { Children, findDOMNode, render, unmountComponentAtNode, renderSubtreeIntoContainer as unstable_renderSubtreeIntoContainer } from './react-dom';
import './vdom/event';

const React = { h, createElement: h, Component, render, Children, findDOMNode, cloneElement, isValidElement, unstable_renderSubtreeIntoContainer, createClass, PureComponent, unmountComponentAtNode };

export default React;



export { h, h as createElement, Component, render, Children, findDOMNode, cloneElement, isValidElement, unstable_renderSubtreeIntoContainer, createClass, PureComponent, unmountComponentAtNode };