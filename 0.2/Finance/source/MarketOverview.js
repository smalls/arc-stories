
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
  [graph-widget] > div > span {
    display: none !important;
  }
  [graph-widget] > div {
    /*height: auto !important;*/
    width: auto !important;
  }
  [graph-widget] iframe {
    width: 100% !important;
  }
</style>
<div graph-widget>
  <!-- TradingView Widget BEGIN -->
  <span id="tradingview-copyright"><!--<a ref="nofollow noopener" target="_blank" href="http://www.tradingview.com" style="color: rgb(173, 174, 176); font-family: &quot;Trebuchet MS&quot;, Tahoma, Arial, sans-serif; font-size: 13px;">Market Quotes by <span style="color: #3BB3E4">TradingView</span></a>--></span>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js">
  {
    "showChart": true,
    "locale": "en",
    "width": "400",
    "height": "660",
    "plotLineColorGrowing": "rgba(60, 188, 152, 1)",
    "plotLineColorFalling": "rgba(255, 74, 104, 1)",
    "gridLineColor": "rgba(233, 233, 234, 1)",
    "scaleFontColor": "rgba(218, 221, 224, 1)",
    "belowLineFillColorGrowing": "rgba(60, 188, 152, 0.05)",
    "belowLineFillColorFalling": "rgba(255, 74, 104, 0.05)",
    "symbolActiveColor": "rgba(242, 250, 254, 1)",
    "tabs": [
      {
        "title": "Equities",
        "symbols": [
          {
            "s": "INDEX:SPX",
            "d": "S&P 500"
          },
          {
            "s": "INDEX:IUXX",
            "d": "Nasdaq 100"
          },
          {
            "s": "INDEX:DOWI",
            "d": "Dow 30"
          },
          {
            "s": "INDEX:NKY",
            "d": "Nikkei 225"
          },
          {
            "s": "NASDAQ:AAPL",
            "d": "Apple"
          },
          {
            "s": "NASDAQ:GOOG",
            "d": "Google"
          }
        ]
      },
      {
        "title": "Commodities",
        "symbols": [
          {
            "s": "CME_MINI:ES1!",
            "d": "E-Mini S&P"
          },
          {
            "s": "CME:E61!",
            "d": "Euro"
          },
          {
            "s": "COMEX:GC1!",
            "d": "Gold"
          },
          {
            "s": "NYMEX:CL1!",
            "d": "Crude Oil"
          },
          {
            "s": "NYMEX:NG1!",
            "d": "Natural Gas"
          },
          {
            "s": "CBOT:ZC1!",
            "d": "Corn"
          }
        ]
      },
      {
        "title": "Bonds",
        "symbols": [
          {
            "s": "CME:GE1!",
            "d": "Eurodollar"
          },
          {
            "s": "CBOT:ZB1!",
            "d": "T-Bond"
          },
          {
            "s": "CBOT:UD1!",
            "d": "Ultra T-Bond"
          },
          {
            "s": "EUREX:GG1!",
            "d": "Euro Bund"
          },
          {
            "s": "EUREX:II1!",
            "d": "Euro BTP"
          },
          {
            "s": "EUREX:HR1!",
            "d": "Euro BOBL"
          }
        ]
      },
      {
        "title": "Forex",
        "symbols": [
          {
            "s": "FX:EURUSD"
          },
          {
            "s": "FX:GBPUSD"
          },
          {
            "s": "FX:USDJPY"
          },
          {
            "s": "FX:USDCHF"
          },
          {
            "s": "FX:AUDUSD"
          },
          {
            "s": "FX:USDCAD"
          }
        ]
      }
    ]
  }
  </script>
  <!-- TradingView Widget END -->
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