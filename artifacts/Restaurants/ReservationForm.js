// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = `reservation-form`;

  let styles = `
<style>
  [${host}] {
    padding: 6px 0;
  }
  [${host}] > * {
    vertical-align: middle;
  }
  [${host}] select {
    padding: 6px;
    font-size: 14px;
  }
</style>
  `;

  let template = `
${styles}
<div ${host}>
  <select>
    <option>1 person</option>
    <option selected>2 people</option>
    ${[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      .map(i => `<option>${i} people</option>`).join('')}
    <option>Larger party</option>
  </select>

  <input type="date">

  <select>
    ${[12,1,2,3,4,5,6,7,8,9,10,11]
      .map(i => `<option>${i}:00 AM</option><option>${i}:30 AM</option>`).join('')}
    ${[12,1,2,3,4,5,6,7,8,9,10,11]
      .map(i => `<option ${i==8?'selected':''}>${i}:00 PM</option><option>${i}:30 PM</option>`).join('')}
  </select>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
  };

});
