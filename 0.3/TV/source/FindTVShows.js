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

  const service = `http://api.tvmaze.com/search/shows`;

  return class extends DomParticle {
    _willReceiveProps(props, state) {
      if (props.shows && !state.count) {
        this._fetchShows();
      }
    }
    async _fetchShows() {
      this._setState({count: -1});
      let query = `star trek`; 
      let response = await fetch(`${service}?q=${query}`);
      let shows = await response.json();
      this._receiveShows(shows);
    }
    _receiveShows(shows) {
      //this._setState({shows});
      //console.log("_receivePlaces = ", places.results);
      let showsView = this._views.get('shows');
      let Show = showsView.entityClass;
      shows.forEach(show => {
        show = show.show;
        let entity = new Show({
          description: show.summary,
          image: show.image && show.image.medium || ''
        });
        showsView.store(entity);
      });
    }
  };
});
