// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = `calendar`;

  let styles = `
<style>
  [${host}] {
    padding: 6px 0;
  }
  [${host}] .date-picker {
    text-align: center;
  }
  [${host}] input {
    padding: 4px;
    font-size: 14px;
  }
  [${host}] .scroll-container {
    position: relative;
    height: 90px;
    overflow-y: hidden;
  }
  [${host}][expanded] .scroll-container {
    height: auto;
  }
  [${host}] .expand-button {
    display: block;
  }
  [${host}][expanded] .expand-button {
    display: none;
  }
  [${host}] .collapse-button {
    display: none;
  }
  [${host}][expanded] .collapse-button {
    display: block;
  }
  [${host}] .hour-row {
    display: flex;
  }
  [${host}] .hour-row .label {
    width: 50px;
    text-align: right;
  }
  [${host}] .hour-row .block {
    flex: 1;
    height: 30px;
    font-size: 0;
  }
  [${host}] .hour-row .block button {
    width: 100%;
    height: 50%;
    background: #FFF;
    border: 1px solid #CCC;
    outline: none;
  }
  [${host}] .events-container {
    position: absolute;
    top: 0;
    left: 50px;
    right: 10px;
  }
  [${host}] .events-container .event {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2px;
    padding: 4px;
    box-sizing: border-box;
    background: #039be5;
    color: #fff;
  }
  [${host}] .events-container .selected-event {
    position: absolute;
    left: 0;
    right: 10px;
    border-radius: 2px;
    padding: 4px;
    box-sizing: border-box;
    background: #fff;
    color: #039be5;
    border: 2px solid #039be5;
  }
</style>
  `;

  let template = `
${styles}
<div ${host} expanded$="{{expanded}}">
  <div class="date-picker">
    <button on-click="_onPreviousDayClick">&lt;</button>
    <input type="date" value="{{date}}" on-change="_onDateChanged">
    <button on-click="_onNextDayClick">&gt;</button>
  </div>

  <div class="scroll-container">
    <div style="{{scrollTransform}}">
      ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        .map(i => `
        <div class="hour-row">
          <div class="label">
            ${i === 0 ? 12 : i > 12 ? i - 12 : i}
            ${i > 11 ? 'PM' : 'AM'}
          </div>
          <div class="block">
            <button on-click="_onTimeClick" value="${i < 10 ? `0${i}` : i}:00"></button>
            <button on-click="_onTimeClick" value="${i < 10 ? `0${i}` : i}:30"></button>
          </div>
        </div>`).join('')}
      <div class="events-container">
        <div class="event" style="{{eventOneStyle}}">{{eventOneName}}</div>
        <div class="event" style="{{eventTwoStyle}}">{{eventTwoName}}</div>
        <div class="event" style="{{eventThreeStyle}}">{{eventThreeName}}</div>
        <div class="selected-event" style="{{selectedEventStyle}}">Selected Time</div>
      </div>
    </div>
  </div>

  <button class="expand-button" on-click="_expandCalendar">Expand</button>
  <button class="collapse-button" on-click="_collapseCalendar">Collapse</button>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props, state) {
      const event = props.event;
      this._savedStartDate = event && event.length && event[event.length-1].rawData.startDate || '';
    }
    _render(props, state) {
      const events = this._getEventsForDate(this._savedStartDate);
      this._savedStartDate = this._savedStartDate || '';
      const startTime = this._savedStartDate.slice(11);
      const start = this._convertStartTimeToMinutes(startTime);
      const expanded = Boolean(state.expanded);
      return {
        date: this._savedStartDate.slice(0, 10),
        eventOneStyle: events[0].style,
        eventOneName: events[0].name,
        eventTwoStyle: events[1].style,
        eventTwoName: events[1].name,
        eventThreeStyle: events[2].style,
        eventThreeName: events[2].name,
        selectedEventStyle: this._getStyleForTimeBlock(startTime, 60),
        expanded: expanded,
        scrollTransform: expanded ? '' : `transform: translateY(-${start/2 - 30}px)`
      };
    }
    _getEventsForDate(dateString) {
      const date = new Date(dateString);
      switch (date.getDay()) {
        case 0:
          return [
            {
              name: 'Sleep in',
              style: this._getStyleForTimeBlock('06:00', 180)
            },
            {
              name: 'Brunch',
              style: this._getStyleForTimeBlock('11:00', 60)
            },
            {
              name: 'Dinner',
              style: this._getStyleForTimeBlock('19:00', 60)
            }
          ];
        case 1:
        case 3:
        case 5:
          return [
            {
              name: 'Drop off dry cleaning',
              style: this._getStyleForTimeBlock('08:00', 60)
            },
            {
              name: 'Meeting',
              style: this._getStyleForTimeBlock('10:00', 90)
            },
            {
              name: 'Work time',
              style: this._getStyleForTimeBlock('15:00', 120)
            }
          ];
        default:
          return [
            {
              name: 'Running club',
              style: this._getStyleForTimeBlock('07:00', 90)
            },
            {
              name: 'Meeting',
              style: this._getStyleForTimeBlock('14:00', 90)
            },
            {
              name: 'Pick up dry cleaning',
              style: this._getStyleForTimeBlock('17:00', 60)
            }
          ];
      }
    }
    _convertStartTimeToMinutes(startTime) {
      const match = /(\d\d):(\d\d)/.exec(startTime);
      return match ? parseInt(match[1], 10) * 60 + parseInt(match[2], 10) : 0;
    }
    _getStyleForTimeBlock(startTime, duration) {
      const start = this._convertStartTimeToMinutes(startTime);
      return `top: ${start/2}px; height: ${duration/2}px`;
    }
    _onPreviousDayClick(e, state) {
      const date = new Date(this._savedStartDate);
      date.setDate(date.getDate() - 1);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this._storeNewEvent(date.toJSON().slice(0,16));
    }
    _onNextDayClick(e, state) {
      const date = new Date(this._savedStartDate);
      date.setDate(date.getDate() + 1);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this._storeNewEvent(date.toJSON().slice(0,16));
    }
    _onDateChanged(e, state) {
      this._storeNewEvent(e.data.value + this._savedStartDate.slice(10));
    }
    _onTimeClick(e, state) {
      this._storeNewEvent(this._savedStartDate.slice(0, 11) + e.data.value);
    }
    _expandCalendar(e, state) {
      this._setState({ expanded: true });
    }
    _collapseCalendar(e, state) {
      this._setState({ expanded: false });
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
