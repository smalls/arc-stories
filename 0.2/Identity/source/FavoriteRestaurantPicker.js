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

  let choicesItem = `
  <div class="place" on-click="_onClickChoice" key="{{index}}">
    ${item}
  </div>
  `.trim();

  let favoritesItem = `
  <div class="place" on-click="_onClickFavorite" key="{{index}}">
    ${item}
  </div>
  `.trim();

  let template = `
${styles}
<div ${host}>
  <div><u>Look for Favorites</u></div>
  <div search>
    <input value="{{searchText}}" on-input="_onSearch" placeholder="search for local restaurants">
  </div>
  <div>
    <div hidden="{{hasMatches}}">No matches found.</div>
    <x-list items="{{choices}}"><template>${choicesItem}</template></x-list>
  </div>
  <div><u>Favorites List</u></div>
  <div>
    <div hidden="{{hasFavorites}}">No favorites selected.</div>
    <x-list items="{{favorites}}"><template>${favoritesItem}</template></x-list>
  </div>
</div>
    `.trim();

  let serviceRoot = `https://xenonjs.com/services/http/php`;

  return class extends DomParticle {

    get template() {
      return template;
    }
    _onSearch(e, state, views) {
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
        this._receiveAutocomplete(places, views);
      });
    }
    _receiveAutocomplete(places, views) {
      let choices = views.get('choices');
      let FavoriteRestaurant = choices.entityClass;

      let predictions = places && places.predictions ? places.predictions : [];

      choices.toList().then(list => list.forEach(
        oldEntry => choices.remove(oldEntry)
      ));

      let favoritesPlaceIds = views.get('favorites').toList().then(
        favorites => favorites.map(favorite => favorite.placesId));
      let filteredPredictions = favoritesPlaceIds.then(favoritesPlaceIds => predictions.filter(
        prediction => !favoritesPlaceIds.includes(prediction.place_id)));

      filteredPredictions.then(filteredPredictions => filteredPredictions.forEach(place => {
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
      }));
    }
    _onClickChoice(e, state, views) {
      let favorites = views.get('favorites');
      let choices = views.get('choices');
      let FavoriteRestaurant = favorites.entityClass;

      let selected = state.choices[e.data.key];

      let newFavorite = new FavoriteRestaurant({
        placesId: selected.placesId,
        name: selected.name,
        address: selected.address
      });

      favorites.store(newFavorite);
      choices.remove(newFavorite);
    }
    _onClickFavorite(e, state, views) {
      var favorites = views.get('favorites');
      var clickedFavorite = state.favorites[e.data.key];
      // favorites.remove(clickedFavorite);
      favorites.toList().then(flist => flist.forEach(
        favorite => {
          if (favorite.placesId==clickedFavorite.placesId) {
            favorites.remove(favorite);

            // XXX too - refresh the search list
          }
        }
      ));
    }
    _render(props, state) {
      return {
        choices: state.choices,
        hasMatches: state.choices && state.choices.length>0,
        favorites: state.favorites,
        hasFavorites: state.favorites && state.favorites.length>0
      };
    }
    _willReceiveProps(props) {
      let choices = props.choices.map(({rawData}, i) => {
          return Object.assign({index: i}, rawData);
      });
      this._setState({choices});

      let favorites = props.favorites.map(({rawData}, i) => {
          return Object.assign({index: i}, rawData);
      });
      this._setState({favorites});
    }
    _onFavoriteFoodChanged(e, state) {
      const food = this._views.get('food');

      food.store(new food.entityClass({food: e.data.value}));
    }
  };
});
