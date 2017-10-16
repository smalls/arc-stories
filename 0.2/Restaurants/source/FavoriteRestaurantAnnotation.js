// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = `favorite-restaurant`;
  let template = `

<style>
  [${host}] {
    padding: 6px 0;
    text-align: center;
  }
  [${host}] > * {
    vertical-align: middle;
    padding: 6px 0;
  }
</style>

<div ${host} id={{subId}}>{{aFavoriteRestaurant}}</div>

<template someones-favorite-restaurant>
  <span>This is one of your favorite restaurants!</span>
</template>

    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _shouldRender(props) {
      return props.restaurants && props.favorites;
    }
    _render(props, state) {
      const favoriteNames = props.favorites.map(favorite => favorite.name);
      const items = props.restaurants.map(restaurant => this._renderFavorites(restaurant, favoriteNames))
      return {
        items: items
      };
    }
    _renderFavorites(restaurant, favoriteNames) {
      const isFavorite = favoriteNames.includes(restaurant.name);

      return {
        subId: restaurant.id,
        aFavoriteRestaurant: {
          $template: 'someones-favorite-restaurant',
          models: isFavorite ? [{name: restaurant.name}] : []
        }
      };
    }
  };
});
