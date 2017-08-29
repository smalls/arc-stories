// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let item = `
<img src="{{icon}}" style="width:32px;vertical-align:middle;padding-right:8px;"><span>{{name}}</span>
  `.trim();

  let selectable = `
<div on-click="_onSelect" key="{{index}}" style="padding: 6px; border-bottom: 1px dotted silver; cursor: pointer;">
  ${item}
</div>
  `.trim();

  let template = `
<div master>
  <div style="padding: 6px;">Found <span>{{count}}</span> item(s).</div>
  <hr>
  <x-list items="{{items}}"><template>${selectable}</template></x-list>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let items = props.list.map(({rawData}, i) => {
        return Object.assign({
          index: i
        }, rawData);
      });
      this._setState({items});
    }
    _shouldRender(props, state) {
      return Boolean(state.items);
    }
    _render(props, state) {
      return {
        items: state.items,
        count: state.items.length
      };
    }
    _onBack(e, state) {
      let {selected} = this._props;
      if (selected) {
        let entity = selected[0];
        entity.name = '';
        this._views.get('selected').store(entity);
      }
    }
    _onSelect(e, state) {
      this._views.get('selected').store(this._props.list[e.data.key]);
    }
  };

});
