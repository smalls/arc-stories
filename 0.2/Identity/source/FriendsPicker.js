// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle, resolver}) => {

  let host = `friends-picker`;

  let styles = `
<style>
  [${host}] {
  }
  [${host}] [item] {
    display: inline-block;
    width: 96px;
    padding: 8px;
    box-sizing: border-box;
    color: inherit;
    text-decoration: none;
    text-align: center;
  }
  [${host}] [item] img {
    box-sizing: border-box;
    border-radius: 100%;
    width: 80px;
  }
  [${host}] [item] [selected] {
    border: 10px solid red;
  }
</style>
  `;

  let template = `

${styles}

<div ${host}>
  <hr>
  <div>{{avatars}}</div>
</div>

<template avatars>
  <div item>
    <img selected$="{{selected}}" src="{{url}}" key="{{key}}" value="{{value}}" on-Click="_onSelectAvatar">
    <br>
    <span>{{name}}</span>
  </div>
</template>

  `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _render(props, state) {
      let friends = props.friends || [];
      let people = props.people || [];
      let avatars = people.map((p, i) => {
        let avatar = p.avatar || `https://$cdn/assets/avatars/user (${i+1}).png`;
        return {
          key: i,
          value: p.name,
          name: p.name,
          url: resolver && resolver(avatar),
          selected: Boolean(friends.find(f => f.name === p.name))
        };
      })
      return {
        avatars: {
          $template: 'avatars',
          models: avatars
        }
      };
    }
    _onSelectAvatar(e, state) {
      let selectedName = e.data.value;
      let friend = this._props.friends.find(f => f.name === selectedName);
      let friendsView = this._views.get('friends');
      if (friend) {
        friendsView.remove(friend);
      } else {
        friendsView.store(new friendsView.entityClass({name: selectedName}));
      }
    }
  };

});
