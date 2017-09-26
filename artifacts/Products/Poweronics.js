/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

"use strict";

defineParticle(({DomParticle}) => {

  let template = `
    <style>
      [pics-brand] {
        background-color: #ffeb3b;
        border-radius: 52px 91px 0px 0px;
      }
      [pics-brand] > div {
        display: flex;
        align-items: center;
        padding: 8px 24px;
        font-size: 0.9em;
      }
      [pics-brand] > div > [poweronics] {
        font-family: fantasy;
        font-style: italic;
        font-size: 1.2em;
        padding-right: 12px;
        text-align: left;
      }
      [pics-brand] > div span {
        flex: 1;
        text-align: right;
        padding-right: 8px;
        color: #333;
        font-weight: bold;
      }
    </style>
    <div pics-brand>
      <div style="{{style}}">
        <span poweronics>Poweronics</span>
        <span>{{msg}}</span>
      </div>
    </div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _shouldRender(props) {
      return props.list && props.list.length;
    }
    _render(props) {
      return {
        items: props.list.map(item => {
          let subId = item.name.replace(/ /g,'').toLowerCase();
          let msg = '';
          let display = '';
          switch (item.name) {
            case 'Power Tool Set':
              msg = `Power Tool Set v2`;
              break;
            default:
              display = 'none';
              break;
          }
          return {msg, subId, style: `display: ${display}`};
        })
      };
    }
  };

});
