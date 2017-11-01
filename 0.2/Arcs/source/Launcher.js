// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = 'arcs-list';

  const html = (strings, ...values) => (strings[0]  + values.map((v, i) => v + strings[i+1]).join('')).trim();

  let style = html`
<style>
  [${host}] [arc-item] {
    display: inline-block;
    width: 96px;
    margin: 16px;
    color: inherit;
    text-decoration: none;
    text-align: center;
  }
  [${host}] a {
    color: inherit;
    text-decoration: none;
  }
  [${host}] [icon] {
    padding: 8px;
  }
  [${host}] [icon] [delete] {
    visibility: hidden;
    color: darkred;
    font-weight: bold;
    cursor: pointer;
  }
  [${host}] [icon]:hover [delete] {
    visibility: initial;
  }
  [${host}] [description] {
    font-size: 0.8em;
    height: 92px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  [${host}] i {
    font-size: 48px;
  }
</style>
`;

  let template = html`

${style}

<div ${host}>
  <div>{{arcs}}</div>
</div>

<template arc>
  <div arc-item>
    <div icon style%="{{iconStyle}}">
      <span delete style="visibility: hidden;">x</span>
      <a href="{{href}}" target="_blank"><i class="material-icons">{{icon}}</i><a>
      <span delete on-click="_onDelete" key="{{index}}">x</span>
    </div>
    <a href="{{href}}" target="_blank"><div description title="{{description}}" unsafe-html="{{description}}"></div></a>
  </div>
</template>

  `;

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let items = props.arcs.map((a, i) => {
        return {
          index: i,
          href: a.href,
          description: a.description,
          icon: a.icon,
          iconStyle: {
            color: a.color || 'gray'
          }
        };
      });
      items.unshift({
        index: -1,
        description: 'New Arc',
        icon: 'star',
        href: '?arc=*',
        iconStyle: {
          color: 'black'
        }
      });
      this._setState({items});
    }
    _shouldRender(props, state) {
      return Boolean(state.items);
    }
    _render(props, state) {
      return {
        arcs: {
          $template: 'arc',
          models: state.items
        }
      };
    }
    _onSelect(e, state) {
      //this._views.get('selected').set(this._props.list[e.data.key]);
    }
    _onDelete(e) {
      let key = e.data.key;
      this._views.get('arcs').remove(this._props.arcs[key]);
    }
  };

});
