// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({ DomParticle, resolver}) => {
  let service = `https://xenonjs.com/services/http/php`;
  let placesService =`${service}/places.php`;
  let photoService = `${service}/place-photo.php`;

  let host = `[find-restaurants]`;
  let template = `

<h3>Find Restaurants</h3>
<div slotid="masterdetail"></div>
<x-list items="{{places}}">
  <template>
    <div style="padding: 4px 0;">
      <img hidden="{{noPhoto}}" 
        style="object-fit: contain; height: 160px; width: 160px; vertical-align:middle; padding-right: 8px;" 
        src="{{photo}}">
      <span style="vertical-align:middle; white-space:nowrap;">{{name}}</span>
    </div>
  </template>
</x-list>

`.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props, state) {
      if (!state.places) {
        state.places = [];
        this._fetchPlaces();
      }
    }
    _fetchPlaces() {
      fetch(`${placesService}?location=55.6711876,12.4537421&radius=1000&keyword=restuarant`)
        .then(response => response.json())
        .then(json => this._receivePlaces(json))
        ;
    }
    _receivePlaces(json) {
      console.log("_receivePlaces = ", json.results);
      let list = this._views.get('list');
      let entity = list.entityClass;
      json.results.forEach((p, i) => {
        let e = new entity({
          name: p.name,
          icon: p.icon,
          photos: p.photos
        });
        list.store(e);
      });
      let places = json.results.map(p => {
        let {name, icon, photos} = p;
        let photo = photos && photos.length ? `${photoService}?maxwidth=400&photoreference=${photos[0].photo_reference}` : icon;
        return {name, photo};
      });
      this._setState({places});
    }
    _shouldRender(props, state) {
      return state.places && state.places.length;
    }
    _render(props, state) {
      console.log('state.places === ', state.places);
      return {
        places: state.places
      };
    }
  };
});
