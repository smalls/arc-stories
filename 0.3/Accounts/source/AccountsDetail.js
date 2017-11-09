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
    _shouldRender(props) {
      return Boolean(props.selected);
    }
    _render(props) {
      let {name, balance} = props.selected;
      // must be POJO for port communication (props.selected is a Proxy)
      return {name, balance};
    }
  };

});
