
// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {
  
    let template = `
<style>
  [ticker-widget] > div > span {
    display: none !important;
  }
  [ticker-widget] > div {
    height: auto !important;
  }
  [ticker-widget] iframe {
    height: 72px !important;
  }
</style>
<div ticker-widget>
  <!-- TradingView Widget BEGIN -->
  <span id="tradingview-copyright"><!--<a ref="nofollow noopener" target="_blank" href="http://www.tradingview.com" style="color: rgb(173, 174, 176); font-family: 'Trebuchet MS', Tahoma, Arial, sans-serif; font-size: 13px;">Quotes by <span style="color: #3BB3E4">TradingView</span></a>--></span>
  <script src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js">{
    "symbols": [
      {
        "proName": "INDEX:SPX",
        "title": "S&P 500"
      },
      {
        "proName": "INDEX:IUXX",
        "title": "Nasdaq 100"
      },
      {
        "proName": "FX_IDC:EURUSD",
        "title": "EUR/USD"
      },
      {
        "proName": "NYMEX:CL1!",
        "title": "Crude Oil"
      },
      {
        "proName": "FX_IDC:XAUUSD",
        "title": "Gold"
      }
    ],
    "locale": "en"
  }</script>
  <!-- TradingView Widget END -->
</div>
    `.trim();
  
  return class extends DomParticle {
    get template() {
      return template;
    }
    _render(props, state) {
      return {
      };
    }
  };

});