/**
 * @author dadigua
 */
import { h, cloneElement, isValidElement } from './h';
import { Component } from './component';
// import { render } from './render';
import { VNode } from './vnode';
import { Children, findDOMNode, render } from './reactdom';


const React = { h, createElement: h, Component, render, Children, findDOMNode, cloneElement, isValidElement };

export default React;



export { h, h as createElement, Component, render, Children, findDOMNode, cloneElement, isValidElement };