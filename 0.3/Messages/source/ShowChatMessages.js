// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle, resolver}) => {

  const host = `show-chat-messages`;

  const template = `
<style>
  [${host}] {
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    font-size: 16px;
    padding: 20px;
  }
  [${host}] [list] {
    flex: 1;
    overflow: auto;
  }
  [${host}] [avatar] img {
    height: 32px;
    border-radius: 100%;
    vertical-align: middle;
    margin-right: 16px;
  }
  [${host}] [message] {
    padding-bottom: 16px;
    text-align: right;
  }
  [${host}] [message][isme] {
    text-align: left;
  }
  [${host}] [name] {
    padding: 0 8px;
    font-size: 0.75em;
  }
  [${host}] [isme] [avatar] {
    display: none;
  }
  [${host}] [content] {
    display: inline-block;
    font-size: 1em;
    line-height: 1.4em;
    text-align: justify;
    background-color: #eeeeee; /*#c5e1a5;*/
    border-radius: 12px;
    padding: 12px 16px;
    margin: 4px;
  }
  [${host}] [isme] [content] {
    color: #f8f8f8;
    background-color: #1873cd;
    text-align: left;
  }
  [${host}] [iscustom] {
    display: none;
  }
</style>

<div ${host}>

  <template chat-message>
    <div message isme$="{{isme}}">
      <div name><span avatar><img src="{{src}}" title="{{name}}" alt="{{name}}"><b>{{name}}</b> - </span><i>{{blurb}}</i></div>
      <div content iscustom$="{{iscustom}}">{{content}}</div>
      <div slotid="custom_message" subid$="{{subId}}"></div>
    </div>
  </template>

  <div list>{{messages}}</div>
  <div><hr></div>
  <div slotid="compose"></div>

</div>
  `.trim();

  return class extends DomParticle {
    get template() {
      return template;
    }
    get userName() {
      return this._props.user && this._props.user.name || '';
    }
    _render(props) {
      let {messages, user, people} = props;
      if (messages && user) {
      	return {
          message: '',
          name: user.name,
          messages: {
            $template: 'chat-message',
            models: this.renderMessages(messages, user, people || [])
          }
      	};
      }
    }
    renderMessages(messages, user, people) {
      return messages.map((m, i) => {
        let sender = people.find(p => p.name === m.name);
        let avatar = sender && sender.avatar || 'user.jpg';
        return {
          iscustom: Boolean(m.type && m.type.length),
          content: m.content,
          name: m.name,
          subId: i,
          blurb: m.time || '',
          isme: m.name === user.name,
          src: resolver(`https://$cdn/assets/avatars/${avatar}`)
        };
      });
    }
  };
});