var config = require('../config.js');
var jsInterpolate = require('./JsInterpolate.js');

module.exports = {
  alertDialog: function(message) {
    return () => {
      return jsInterpolate.alert(message);
    };
  },
  tabBomb: function(url, i) {
    return () => {
      return jsInterpolate.tabBomb(url, i);
    };
  },
  redirect: function(url) {
    return () => {
      return jsInterpolate.redirect(url);
    };
  },
  tab: function(url) {
    return () => {
      return jsInterpolate.tab(url)
    };
  },
  wsClose: function() {
    return () => {
      return 'ws.close()';
    }
  }
};
