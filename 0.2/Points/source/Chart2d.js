
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
    _render(props, state) {
      /*
      let opts = [
        `cht=lxy`,
        `chd=t:
10,20,40,80,90,95,99|
20,30,40,50,60,70,80|
-1|
5,10,22,35,85`
].join('&');
      */
      let opts = [
        `cht=lc`,
        `chs=320x192`,
        `chd=t:10,20,40,80,90,95,99`,
        `chxt=x,y`
      ].join('&');
      return {
        src: `http://chart.googleapis.com/chart?${opts}`
      };
    }
  };

});