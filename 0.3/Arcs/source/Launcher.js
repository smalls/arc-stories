// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = 'arcs-list';

  const html = (strings, ...values) => (strings[0]  + values.map((v, i) => v + strings[i+1]).join('')).trim();

  let style = html`
<style>
  [${host}] .material-icons {
    font-family: 'Material Icons';
    /*font-size: 24px;*/
    font-style: normal;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    vertical-align: middle;
    cursor: pointer;
  }
  [${host}] [banner] {
    font-size: 16px;
    font-weight: bold;
    background-color: #ffd54f;
    padding: 16px;
  }
  [${host}] [arc-item] {
    display: inline-block;
    width: 96px;
    margin: 8px;
    color: inherit;
    /*text-decoration: none;*/
    text-align: center;
  }
  [${host}] [arc-item] [description] {
    font-size: 0.8em;
    height: 92px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  [${host}] [arc-list-item] {
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid silver;
  }
  [${host}] a {
    color: inherit;
    text-decoration: none;
  }
  [${host}] [icon] {
    padding: 8px;
  }
  [${host}] [delete] {
    visibility: hidden;
    color: darkred;
    font-weight: bold;
    cursor: pointer;
  }
  [${host}] [arc-item]:hover [delete], [${host}] [arc-list-item]:hover [delete] {
    visibility: initial;
  }
  [${host}] i {
    font-size: 48px;
  }
</style>
`;

  let template = html`

${style}

<div ${host}>
  <div banner>Quick Hits</div>
  <div>{{arcs}}</div>
  <div banner style="background-color: #4fc3f7;">Profile</div>
  <div>{{profiles}}</div>
  <div banner>More</div>
  <div>{{tail}}</div>
</div>

<template arc>
  <div arc-item>
    <div icon style%="{{iconStyle}}">
      <span delete style="visibility: hidden;">x</span>
      <a href="{{href}}" target="_blank"><i class="material-icons">{{icon}}</i><a>
      <span delete on-click="_onDelete" key="{{index}}">x</span>
    </div>
    <a href="{{href}}" target="_blank"><div description title="{{description}}" unsafe-html="{{blurb}}"></div></a>
  </div>
</template>

<template arc-list-item>
  <div arc-list-item>
    <span description title="{{description}}" style="flex: 1;"><a href="{{href}}" target="_blank" unsafe-html="{{description}}"></a></span>
    <span delete on-click="_onDelete" key="{{index}}" style="padding: 0 8px">x</span>
    <div icon style%="{{iconStyle}}">
      <a href="{{href}}" target="_blank"><i class="material-icons">{{icon}}</i><a>
    </div>
  </div>
</template>
  `;

  return class extends DomParticle {
    get template() {
      return template;
    }
    _willReceiveProps(props) {
      let items = [], profileItems = [];
      props.arcs.forEach((a, i) => {
        let list = a.profile ? profileItems : items;
        let blurb = a.description.length > 70 ? a.description.slice(0, 70) + '...' : a.description;
        list.push({
          index: i,
          href: a.href,
          blurb,
          description: a.description,
          icon: a.icon,
          iconStyle: {
            color: a.color || 'gray'
          }
        });
      });
      items.unshift({
        index: -1,
        blurb: 'New Arc',
        description: 'New Arc',
        icon: 'star',
        href: '?arc=*',
        iconStyle: {
          color: 'black'
        }
      });
      this._setState({items, profileItems});
    }
    _shouldRender(props, state) {
      return Boolean(state.items);
    }
    _render(props, state) {
      return {
        arcs: {
          $template: 'arc',
          models: state.items
        },
        profiles: {
          $template: 'arc',
          models: state.profileItems
        },
        tail: {
          $template: 'arc-list-item',
          models: state.items.slice(1)
        }
      };
    }
    _onDelete(e) {
      let key = e.data.key;
      this._views.get('arcs').remove(this._props.arcs[key]);
    }
  };

});
