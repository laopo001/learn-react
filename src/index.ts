/**
 * @author dadigua
 */
import { h, cloneElement, isValidElement } from './h';
import { Component } from './component';
// import { render } from './render';
import { VNode } from './vnode';
import { Children, findDOMNode, render, renderSubtreeIntoContainer as unstable_renderSubtreeIntoContainer } from './react-dom';


const React = { h, createElement: h, Component, render, Children, findDOMNode, cloneElement, isValidElement, unstable_renderSubtreeIntoContainer };

export default React;



export { h, h as createElement, Component, render, Children, findDOMNode, cloneElement, isValidElement, unstable_renderSubtreeIntoContainer };