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

  let host = `show-list`;

  let showTemplate = `
<div style="display: flex; align-items: start; padding-bottom: 8px;">
  <img src="{{src}}" style="vertical-align: middle; padding-right: 8px;">
  <div unsafe-html="{{desc}}"></div>
</div>
  `.trim();

  let template = `
<div ${host} style="padding: 8px;">
  <template shows>${showTemplate}</template>
  <div>{{shows}}</div>
  <hr>
  <pre>{{json}}</pre>
</div>
    `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _shouldRender(props) {
      return props.shows;
    }
    _render(props, state) {
      return {
        shows: {
          $template: 'shows',
          models: props.shows.map(show => {
            return {
              src: show.image,
              desc: show.description
            };
          })
        }
      };
    }
  };
});
