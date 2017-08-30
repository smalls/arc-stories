// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-database.js");

var config = {
  apiKey: "AIzaSyDzzr9Ubtf2-NRtyJGsfsXiTLdCaTkuvKk",
  authDomain: "arcs-chat.firebaseapp.com",
  databaseURL: "https://arcs-chat.firebaseio.com",
  projectId: "arcs-chat",
  storageBucket: "arcs-chat.appspot.com",
  messagingSenderId: "1039113211270"
};
firebase.initializeApp(config);

defineParticle(({DomParticle}) => {

  const host = `chat`;

  // Specifies the DOM template to be used when the rendering function
  // is called on the Greet particle. The template syntax is similar
  // to the one used by web component templates.
  const template = `
<style>
  [${host}] {
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    font-size: 16px;
    /*background-color: #AED581;*/
    padding: 20px;
  }
  [${host}] [user] input {
    padding: 4px;
    font-family: inherit;
    font-size: inherit;
  }
  [${host}] [list] {
    flex: 1;
    overflow: auto;
  }
  [${host}] [message] {
    padding-bottom: 4px;
  }
  [${host}] [name] {
    padding-left: 16px;
    font-size: 0.75em;
    text-align: right;
  }
  [${host}] [isme] [name] {
    display: none;
  }
  [${host}] [text] {
    background-color: #c5e1a5;
    padding: 8px 16px;
    border-radius: 12px;
    margin: 4px;
    text-align: right;
  }
  [${host}] [isme] [text] {
    background-color: #90caf9;
    text-align: left;
  }
  [${host}] [input] div {
    padding-bottom: 4px;
  }
  [${host}] [input] input {
    padding: 16px;
    font-size: 1.5em;
  }
</style>

<div ${host}>
  <div user>
    <label>My name is <input on-change="onNameChange" value="{{name}}"></label>
  </div>
  <div><hr></div>

  <template chat-message>
    <div message isme$="{{isme}}">
      <div name><i>{{name}}</i></div>
      <div text>{{text}}</div>
    </div>
  </template>

  <div list>{{messages}}</div>
  <div><hr></div>

  <div input>
    <div><b>{{name}}</b> says</div>
    <input on-change="onMessageChange" value="{{message}}">
  </div>
</div>
  `.trim();

  // Defines the Greet particle as a sub-class of DomParticle.
  // Greet may be speculatively instantiated by Arcs and will
  // (definitely) be instantiated when the user picks the greeting
  // suggestion.
  return class extends DomParticle {
    constructor() {
      super();
      this.initDb();
    }
    _getInitialState() {
      return {
        name: 'Smitty',
        messages: []
      };
    }
    initDb() {
      this.db = firebase.database();
      let dbmsgs = this.db.ref('messages');
      //dbmsgs.once('value').then(snapshot => this._setState({messages: snapshot.val()}));
      dbmsgs.on('child_added', data => {
        let messages = this._state.messages;
        messages.push({text: data.val().text, name: data.val().name});
        this._setState({messages});
      });
    }
    get template() {
      return template;
    }
    _render(props, state) {
      if (state.messages) {
      	return {
          message: '',
          name: state.name,
          messages: {
            $template: 'chat-message',
            models: Object.values(state.messages).map(m => {
              return {
                text: m.text,
                name: m.name === state.name ? 'Me' : m.name,
                isme: m.name === state.name
              }
            })
          }
      	};
      }
    }
    onNameChange(e, state) {
      console.log(e);
      this._setState({name: e.data.value});
    }
    onMessageChange(e, state) {
      if (e.data.value) {
        this._setState({message: ''});
        let message = this.db.ref('messages').push();
        message.set({
          text: e.data.value,
          name: state.name
        });
      }
    }
  };
});