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
    text-align: center;
  }
  [${host}] > * {
    vertical-align: middle;
  }
  [${host}] select {
    padding: 6px;
    font-size: 14px;
  }
  [${host}] input {
    padding: 4px;
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

  <input type="datetime-local" value="{{date}}" on-change="_onDateChanged">
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props, state) {
      if (!props.event.length) {
        this._storeNewEvent(this.toDateInputValue(new Date()));
      }
    }
    toDateInputValue(date) {
      let local = new Date(date);
      local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return local.toJSON().slice(0,16);
    }
    _render(props, state) {
      const event = props.event;
      return {
        date: event && event.length && event[event.length-1].rawData.startDate || ''
      }
    }
    _onDateChanged(e, state) {
      this._storeNewEvent(e.data.value);
    }
    _storeNewEvent(startDate) {
      const event = this._views.get('event');
      event.store(new event.entityClass({
        startDate: startDate,
        endDate: startDate
      }));
    }
  };

});
