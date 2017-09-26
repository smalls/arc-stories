// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = `party-size`;

  let styles = `
<style>
  [${host}] {
    padding: 6px 0;
    text-align: center;
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
  <select on-change="_onPartySizeChanged">
    <option value="1" selected$={{selected1}}>1 person</option>
    <option value="2" selected$={{selected2}}>2 people</option>
    ${[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      .map(i => `<option value="${i}" selected$={{selected${i}}}>${i} people</option>`).join('')}
    <option value="21" selected$={{selected21}}>Larger party</option>
  </select>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props, state) {
      if (!props.event.length) {
        const now = this.toDateInputValue(new Date());
        const event = { startDate: now, endDate: now, participants: 2 };
        this._storeNewEvent(event);
        this._setState({ currentEvent: event });
      } else {
        const event = props.event[props.event.length - 1].rawData;
        this._setState({ currentEvent: event });
      }
    }
    toDateInputValue(date) {
      let local = new Date(date);
      local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return local.toJSON().slice(0,16);
    }
    _render(props, state) {
      return {
        [`selected${state.currentEvent.participants}`]: true
      }
    }
    _onPartySizeChanged(e, state) {
      let newEvent = Object.assign({}, state.currentEvent || {});
      newEvent.participants = e.data.value;
      this._storeNewEvent(newEvent);
    }
    _storeNewEvent(newEvent) {
      const event = this._views.get('event');
      event.store(new event.entityClass(newEvent));
    }
  };

});
