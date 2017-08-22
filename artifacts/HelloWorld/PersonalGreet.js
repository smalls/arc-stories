// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

// PersonalGreet defines a particle that displays a more personal greeting
// message than simply "Hello, World!". It displays "Hi {{name}}, you're an
// {{animal}}" for a given Person entity. The animal is chosen based on the
// first letter of the person's name.
defineParticle(({ DomParticle }) => {

  const template = `
    <style>
      [greeting] {
        background-color: #FFF176;
        width: 50%;
        height: 100px;
        margin: 20px;
        padding: 10px;
      }
    </style>
    <div greeting>Hi <span>{{name}}</span>, you're <span>{{prefix}}</span>&nbsp;<span>{{animal}}</span>!</div>
  `.trim();

  const animals = {
    'A': 'alligator',
    'B': 'bear',
    'C': 'cat',
    'D': 'dolphin',
    // ...
    'Z': 'zebra',
    '': 'alian',
  };

  const vowels = ['a', 'e', 'i', 'o', 'u'];

  return class extends DomParticle {
    get template() {
      return template;
    }

    // return true if there is enough information to consume a slot and render
    _shouldRender(props, state) {
      return (props.person && props.person.name);
    }

    // _render() gets called whenever props or state are set.
    // Rather than copying the name into the particle's state (as in
    // Greet.js) we skip that step and render the name from the props
    // directly to keep the particle code simpler.
    _render(props, state) {
      if (props.person && props.person.name) {
        const name = props.person.name;
        const animal = animals[name.toUpperCase()[0]] || animals[''];
        return {
          name: name,
          animal: animal,
          prefix: vowels.includes(animal[0]) ? 'an' : 'a'
        };
      }
    }
  };
});