
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

<div style="padding: 32px; text-align: center;">
  <img src="{{src}}">
</div>

    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _render(props) {
      let {points} = props;
      if (points) {
        let chdx = points.map(p => p.x);
        let chdy = points.map(p => p.y);
        //let labels = points.forEach(p => p.label);
        let chd = `t:${chdx.join(',')}|${chdy.join(',')}`;
        let opts = [
          `cht=lxy`,
          `chs=320x192`,
          `chd=${chd}`,
          `chxt=x,y`
        ].join('&');
        return {
          src: `https://chart.googleapis.com/chart?${opts}`
        };
      }
    }
  };

});