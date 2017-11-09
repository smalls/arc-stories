// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = 'plaid-accounts-detail';

  let template = `
<style>
  [${host}] {
    font-size: 0.9em;
  }
  [${host}] [section] {
    padding: 8px;
  }
  [${host}] [item] {
    border-bottom: 1px dotted silver;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  [${host}] [amount] {
    font-family: monospace;
    font-size: 1.3em;
    color: green;
  }
</style>

<div ${host}>
  <h3 style="padding: 8px;">{{name}}</h3>
  <div>{{accounts}}</div>
  <template transactions>
    <div item on-click="_onSelect" key="{{index}}">
      <div date section><span>{{date}}</span></div>
      <div name section style="flex: 1;"><b>{{name}}</b></div>
      <div amount section style="{{amountStyle}}"><span>{{amount}}</span></div>
    </div>
  </template>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let items = null;
      if (props.selected && props.transactions) {
        items = props.transactions.filter(t => t.account == props.selected.id).map((t, i) => {
          return {
            index: i,
            name: t.name,
            date: t.date,
            amount: Math.abs(t.amount).toFixed(2),
            amountStyle: t.amount > 0 ? 'color: #CC0000' : 'color: green'
          };
        });
      }
      this._setState({items});
    }
    _shouldRender(props, state) {
      return Boolean(state.items);
    }
    _render(props, state) {
      return {
        name: props.selected.metaName,
        accounts: {
          $template: 'transactions',
          models: state.items
        }
      };
    }
    _onSelect(e) {
      //this._views.get('selected').set(this._props.list[e.data.key]);
    }
  };

});
