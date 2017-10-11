// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = `favorite-restaurant-picker`;

  let styles = `
<style>
  [${host}] {
    overflow: auto;
  }
  [${host}] .place {
    padding: 6px;
    border-bottom: 1px dotted silver;
  }
  [${host}] .place:hover {
    background-color: rgba(86,255,86,0.25);
  }
  [${host}] .place:last-child {
    border-bottom: none;
  }
  [${host}] .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  [${host}] .subtext {
    color: #666666;
    font-size: 80%;
  }
</style>
  `;

  let item = `
  <div class="item">
    <div class="title">{{name}}</div>
    <div style="display:none;">{{place_id}}</div>
    <div class="subtext">{{description}}</div>
  </div>
  `.trim();

  let predictionItem = `
  <div class="place" on-click="_onSelect" key="{{index}}">
    ${item}
  </div>
  `.trim();

  let template = `
${styles}
<div ${host}>
  <div search>
    <input value="{{searchText}}" on-input="_onSearch" placeholder="restaurant name">
  </div>
  <div>
    <div hidden="{{hasMatches}}">No matches found.</div>
    <x-list items="{{items}}"><template>${predictionItem}</template></x-list>
  </div>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _onSearch(e) {
      // copied from ../../Restaurants/source/FindRestaurants.js
      let loc = `37.7610927,-122.4208173`;
      let radius = `1000`;

      let type = `establishment`;
      let service = `https://xenonjs.com/services/http/php/places-autocomplete.php`;

      let input = e.data.value;

      let request = `${service}?location=${loc}&radius=${radius}&types=${type}&input=${input}`

      fetch(request).then(response => {
        return response.json();
      }).then(places => {
        this._receiveAutocomplete(places);
      });
    }
    _receiveAutocomplete(places) {
      let localBusinesses = this._views.get('localStorage');
      let LocalBusiness = localBusinesses.entityClass;

      let predictions = places && places.predictions ? places.predictions : [];

      localBusinesses.toList().then(l=>l.forEach(old => { localBusinesses.remove(old)}));

      predictions.forEach(place => {
        let localBusiness = new LocalBusiness({
          id: place.place_id,
          name: place.structured_formatting.main_text,
          disambiguatingDescription: place.structured_formatting.secondary_text
        });
        localBusinesses.store(localBusiness);
      });
    }
    _onSelect(e, b, c, d, f) {
      debugger;
    }
    /*
    _receiveRawEstablishments(establishments) {
      this._setState({predictions});
    }
    */
    _render(props, state) {
      return {
        items: state.predictions,
        hasMatches: state.predictions && state.predictions.length>0
      };
    }
    _willReceiveProps(props) {

      let predictions = props.localStorage.map(({rawData}, i) => {
          return Object.assign({index: i}, rawData);
      });

      this._setState({predictions});
    }
    _onFavoriteFoodChanged(e, state) {
      const food = this._views.get('food');

      food.store(new food.entityClass({food: e.data.value}));
    }
  };

});
