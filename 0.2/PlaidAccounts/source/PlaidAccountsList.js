// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = 'plaid-accounts-list';

  let template = `
<style>
  [${host}] [section] {
    padding: 8px;
  }
  [${host}] [item] {
    border-bottom: 1px dotted silver;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  [${host}] [balance] {
    font-size: 1.4em;
    color: green;
  }
</style>

<div ${host}>
  <div>{{accounts}}</div>
  <template accounts>
    <div item section on-click="_onSelect" key="{{index}}">
      <span style="flex: 1;"><i class="material-icons">{{icon}}</i>&nbsp;<span style="vertical-align:middle;">{{name}}</span></span>
      <div balance section style="{{balanceStyle}}">$<span>{{balance}}</span></div>
    </div>
  </template>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let items = props.list.map((a, i) => {
        return {
          index: i,
          name: a.metaName,
          icon: a.type=="credit" ? `credit_card` : `account_balance`,
          balance: a.balanceCurrent,
          balanceStyle: (a.type=="credit"?-1:1)*a.balanceCurrent < 0 ? 'color: #CC0000' : 'color: green'
        };
      });
      this._setState({items});
    }
    _shouldRender(props, state) {
      return Boolean(state.items);
    }
    _render(props, state) {
      return {
        items: state.items,
        count: state.items.length,
        accounts: {
          $template: 'accounts',
          models: state.items
        }
      };
    }
    _onSelect(e, state) {
      this._views.get('selected').set(this._props.list[e.data.key]);
    }
  };

});
