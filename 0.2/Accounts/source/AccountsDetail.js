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
<div detail>
  <h2>{{name}}</h2>
  <h4>$<span>{{balance}}</span></h4>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let {selected} = props;
      let item = null;
      if (selected && selected.length) {
        item = selected[selected.length-1].rawData;
      }
      this._setState({item});
    }
    _shouldRender(props, state) {
      return Boolean(state.item);
    }
    _render(props, state) {
      let {name, balance} = state.item;
      // must be POJO for port communication (state.item is a Proxy)
      return {name, balance};
    }
  };

});
