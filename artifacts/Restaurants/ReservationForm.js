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
  [${host}] [times] {
    display: flex;
    justify-content: space-around
  }
</style>
  `;

  let template = `
${styles}
<div ${host} id={{subId}}>
  <div>{{timePicker}}</div>
  <div times>{{availableTimes}}</div>
</div>

<template time-picker>
  <select on-change="_onPartySizeChanged">
    <option value="1" selected$={{selected1}}>1 person</option>
    <option value="2" selected$={{selected2}}>2 people</option>
    ${[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      .map(i => `<option value="${i}" selected$={{selected${i}}}>${i} people</option>`).join('')}
    <option value="21" selected$={{selected21}}>Larger party</option>
  </select>

  <input type="datetime-local" value="{{date}}" on-change="_onDateChanged">
</template>

<template available-times>
  <button disabled$={{notAvailable}}>{{time}}</button>
</template>
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
    makeUpReservationTimes(id, partySize, date, n) {
      // Start at (n-1)/2 before the desired reservation time
      let t = new Date((date ? new Date(date) : new Date()).getTime() - (n-1)/2*3600*1000);
      let hour = (t.getHours()) % 24;
      let minute = t.getMinutes() > 30 ? "30" : "00";

      // Seed per restaurant and day
      let seed = parseInt(id.substr(0, 8), 16);
      let ts = t.getTime();
      ts = ts - (ts % 86400000); // Round to closest day

      let result = [];

      while (n--) {
        // This seems somewhat balanced
        let notAvailable = (seed*(hour*2+minute/30)*(ts/86400000))%10 <= partySize;

        result.push({
          time: `${hour}:${minute}`,
          notAvailable
        });

        // Increment time slot
        if (minute == "30") {
          hour = (hour + 1) % 24;
          minute = "00";
        } else {
          minute = "30";
        }
      }

      return result;
    }
    _render(props, state) {
      const selected = props.selected;
      const selectedRestaurant = selected && selected.length && selected[selected.length-1];
      if (selectedRestaurant) {
        return this._renderSingle(selectedRestaurant, state.currentEvent.startDate, state.currentEvent.participants || 2, true);
      } else {
        return this._renderList(props.list || [], state.currentEvent.startDate, state.currentEvent.participants || 2);
      }
    }
    _renderSingle(restaurant, date, partySize, showTimePicker) {
      let restaurantId = restaurant.rawData.id || "";
      let times = this.makeUpReservationTimes(restaurantId, partySize, date, 5);
      return {
        subId: restaurantId,
        timePicker: {
          $template: 'time-picker',
          models: showTimePicker ? [{ [`selected${partySize}`]: true, date }] : []
        },
        availableTimes: {
          $template: 'available-times',
          models: times
        }
      }
    }
    _renderList(list, date, partySize) {
      return {
        items: list.map(restaurant => this._renderSingle(restaurant, date, partySize, false))
      }
    }
    _onDateChanged(e, state) {
      let newEvent = Object.assign({}, state.currentEvent || { participants: 2 });
      newEvent.startDate = newEvent.endDate = e.data.value;
      this._storeNewEvent(newEvent);
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
