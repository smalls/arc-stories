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
    <div class="subtext">{{address}}</div>
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

  let serviceRoot = `https://xenonjs.com/services/http/php`;

  return class extends DomParticle {

    get template() {
      return template;
    }
    _onSearch(e) {
      // copied from ../../Restaurants/source/FindRestaurants.js
      let loc = `37.7610927,-122.4208173`;
      let radius = `1000`;

      let input = e.data.value;

      let type = `establishment`;
      let service = `${serviceRoot}/places-autocomplete.php`;
      let request = `${service}?location=${loc}&radius=${radius}&types=${type}&input=${input}`;

      fetch(request).then(response => {
        return response.json();
      }).then(places => {
        this._receiveAutocomplete(places);
      });
    }
    _receiveAutocomplete(places) {
      let choices = this._views.get('choices');
      let FavoriteRestaurant = choices.entityClass;

      let predictions = places && places.predictions ? places.predictions : [];

      choices.toList().then(list => list.forEach(
        oldEntry => choices.remove(oldEntry)
      ));

      predictions.forEach(place => {
        let service = `${serviceRoot}/place-details.php`;
        let request = `${service}?placeid=${place.place_id}`;

        fetch(request).then(response => {
          return response.json();
        }).then(place => {
          if (!place.result.types.includes('cafe')
              && !place.result.types.includes('food')
              && !place.result.types.includes('restaurant')) {
            return;
          }

          let option = new FavoriteRestaurant({
            placesId: place.result.place_id,
            name: place.result.name,
            address: place.result.formatted_address
          });
          choices.store(option);
        });
      });
    }
    _onSelect(e, state, props) {
      let selected = state.predictions[e.data.key];
    }
    _render(props, state) {
      return {
        items: state.predictions,
        hasMatches: state.predictions && state.predictions.length>0
      };
    }
    _willReceiveProps(props) {
      let predictions = props.choices.map(({rawData}, i) => {
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
