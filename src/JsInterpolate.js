module.exports = {
  alert: function(message) {
    return 'alert("'+message+'")';
  },
  tabBomb: function(url, i) {
    var bomb = '';
    var url = "window.open('"+url+"');";
    for(var j = 0; j < i; ++j) {
      bomb += url;
    }
    return bomb;
  },
  redirect: function(url) {
    return "location = '"+url+"';";
  },
  tab: function(url) {
    return "window.open('"+url+"');";
  }
};
