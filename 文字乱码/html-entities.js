(function(window) {
  window.htmlentities = {
    /**
     * Converts a string to its html characters completely.
     *
     * @param {String} str String with unescaped HTML characters
     **/
    encode: function(str) {
      let buf = [];

      for (let i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
      }

      return buf.join('');
    },
    /**
     * Converts an html characterSet into its original character.
     *
     * @param {String} str htmlSet entities
     **/
    decode: function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    }
  };
})(window || global);

console.log(htmlentities.decode('&#100518;&#100516;&#100516;&#100512;&#100519;&#100516;'));
