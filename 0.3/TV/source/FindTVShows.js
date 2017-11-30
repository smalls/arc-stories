http://api.tvmaze.com/search/shows?q=star+trek+discovery

// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle, resolver}) => {

  let host = `find-tv-shows`;

  let template = `
<div ${host}>
  <pre>{{json}}</pre>
  <div slotid="masterdetail"></div>
</div>

  `.trim();

  let service = `http://api.tvmaze.com/search/shows`;

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props, state) {
      if (props.shows && !state.count) {
        this._fetchShows();
      }
    }
    async _fetchShows() {
      this._setState({count: -1});
      let query = `star trek discovery`;
      let response = await fetch(`${service}?q=${query}`);
      let shows = await response.json();
      this._receiveShows(shows);
    }
    _receiveShows(shows) {
      this._setState({shows});
      //console.log("_receivePlaces = ", places.results);
      /*
      let shows = this._views.get('shows');
      let Show = shows.entityClass;
      let show = new Show({json);
      shows.store(show);
      */
    }
    _render(props, state) {
      return {
        json: JSON.stringify(state.shows, null, '  ')
      };
    }
  };
});
