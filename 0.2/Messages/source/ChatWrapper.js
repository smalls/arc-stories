// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle, resolver}) => {

  const host = `chat-wrapper`;

  const template = `

  <style>
  [${host}] {
    border-bottom: 1px solid silver;
  }
  [${host}] > [header] {
    display: flex;
    align-items: center;
  }
  [${host}] > [header] i {
    padding: 16px;
    vertical-align: middle;
    user-select: none;
  }
  [${host}] > [header] [message] {
    flex: 1;
    transform: translate3d(100vw, 0, 0);
    transition: transform 800ms ease-out;
  }
  [${host}] > [header] [message][show] {
    transform: translate3d(0, 0, 0);
  }
  [${host}] > [header] [message] {
    background-color: lightblue;
    box-sizing: border-box;
    padding: 16px;
    margin: 0 16px;
    border-radius: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  [${host}] > [header] img {
    height: 32px;
    border-radius: 100%;
    vertical-align: middle;
    margin-left: 16px;
    opacity: 0;
    transition: opacity 800ms ease-out;
  }
  [${host}] > [header] img[show] {
    opacity: 1;
  }
  [${host}] > [chat]:not([open]) {
    display: none;
  }
</style>

<div ${host}>
  <div header on-click="_onOpenClick">
    <i class="material-icons">chat</i>
    <span>{{messageCount}}</span>
    <img show$="{{show}}" src="{{avatar}}">
    <div message show$="{{show}}">{{message}}</div>
  </div>
  <div chat open$="{{open}}">
    <div slotid="chatmessages"></div>
  </div>
</div>

  `.trim();

  const chatLog = `background: #524c00; color: white; padding: 1px 6px 2px 8px; border-radius: 6px;`;
  const chatPre = "%cChatWrapper";

  return class extends DomParticle {
    get template() {
      return template;
    }
    _getInitialState() {
      return {
        open: false,
        animations: []
      };
    }
    _shouldRender(props) {
      return props.messages && props.people;
    }
    _render(props, state) {
      let {messages, people} = props;
      let count = messages && messages.length;
      let last = count && messages[count-1];
      if (state.open) {
        state.animations = [];
        state.showing = null;
        state.count = 0;
      } else {
        // if the count has changed (and there is a last message)
        if (state.count !== count && last) {
          // remember the count
          state.count = count;
          // we need to animate this message
          state.animations.push(last);
          console.log(`${chatPre}: count changed`, chatLog);
        }
        // if we aren't showing something now
        if (!state.showing) {
          // get the next pending thing to show
          state.showing = state.animations.shift();
          if (state.showing) {
            console.log(`${chatPre}: show new message, dismiss in a few seconds`, chatLog);
            // make it go away in a bit
            clearTimeout(state.timeout);
            state.timeout = setTimeout(() => this._invalidate(), 4000);
          }
        }
        // else, if we have old message showing
        else {
          // make it go away now
          console.log(`${chatPre}: dismissing old message`, chatLog);
          state.showing = null;
          clearTimeout(state.timeout);
          if (state.animations.length) {
            console.log(`${chatPre}: show next message in 0.8s`, chatLog);
            // go again after the dismiss animation is complete
            state.timeout = setTimeout(() => this._invalidate(), 800);
          }
        }
      }
      let avatar, content;
      if (state.showing) {
        content = state.showing.content;
        let sender = people.find(p => p.name === state.showing.name);
        avatar = sender && sender.avatar;
      }
      if (!state.avatar || avatar) {
        state.avatar = resolver(`https://$cdn/assets/avatars/${avatar || 'user.jpg'}`);
      }
      return {
        open: Boolean(state.open),
        messageCount: `(${count})`,
        show: !state.open && Boolean(state.showing),
        message: content || '',
        avatar: state.avatar
      };
    }
    _onOpenClick(e, state) {
      this._setState({open: !state.open});
    }
  };
});