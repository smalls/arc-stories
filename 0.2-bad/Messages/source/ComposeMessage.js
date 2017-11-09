// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  const host = `compose-message`;

  const template = `
<style>
  [${host}] {
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    font-size: 16px;
  }
  [${host}] [compose] div {
    padding-bottom: 4px;
  }
  [${host}] [compose] input {
    padding: 16px;
    font-size: 1.5em;
    box-sizing: border-box;
    width: 100%;
  }
</style>

<div ${host}>
<!--
  <div>
    <button on-click="onClearChat">Clear Chat</button>
  </div>
  <div><hr></div>
-->
  <div compose>
    <div><b>{{name}}</b> says</div>
    <input on-change="onMessageChange" value="{{message}}">
  </div>
</div>
  `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    _render(props) {
      let {messages, user} = props;
      if (messages && user) {
      	return {
          message: '',
          name: user.name,
      	};
      }
    }
    get userName() {
      return this._props.user && this._props.user.name || '';
    }
    addMessage(msg) {
      const Message = this._views.get('messages').entityClass;
      this._views.get('messages').store(new Message(msg));
    }
    onMessageChange(e) {
      if (e.data.value) {
        this.addMessage({
          content: e.data.value,
          name: this.userName,
          time: new Date().toLocaleString()
        });
        this._setState({message: ''});
      }
    }
    onClearChat() {
    }
  };
});