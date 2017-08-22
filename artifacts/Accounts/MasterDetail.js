// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let template = `
<div master-detail>
<div style%="{{tab0}}" style="padding: 6px">
  <button on-click="_onBack">Back</button>
  <hr>
  <div slotid="detail"></div>
</div>
<div style%="{{tab1}}">
  <div slotid="master"></div>
</div>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _render(props, state) {
      let list = props.list || 0;
      let selection = props.selected || 0;
      let selected = selection.length && selection[selection.length-1];
      let name = selected && selected.name;
      return {
        selected: name || '(no selection)',
        count: list.length,
        tab0: {display: name ? '' : 'none'},
        tab1: {display: !name ? '' : 'none'}
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
  };

});
