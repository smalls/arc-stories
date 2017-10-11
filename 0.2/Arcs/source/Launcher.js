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

  let template = `
<style>
  [${host}] a {
    display: inline-block;
    width: 96px;
    margin: 16px;
    color: inherit;
    text-decoration: none;
    text-align: center;
  }
  [${host}] [icon] {
    padding: 8px;
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

<div ${host}>
  <template arc>
    <a href="{{href}}" target="_blank" on-click="_onSelect" key="{{index}}">
      <div icon style%="{{iconStyle}}"><i class="material-icons">{{icon}}</i></div>
      <div description title="{{description}}" unsafe-html="{{description}}"></div>
    </a>
  </template>
  <div>{{arcs}}</div>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let items = props.arcs.map((a, i) => {
        return {
          index: i,
          description: a.description,
          icon: a.icon,
          href: a.href,
          iconStyle: {
            color: ['darkred','darkblue','darkgreen','darkorange','black'][Math.floor(Math.random()*5)]
          }
        };
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
  };

});
