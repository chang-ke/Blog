function toString(t) {
  return Object.prototype.toString.call(t);
}

function isNaN(t) {
  return t !== t;
}

function hasWhiteSpace(t) {
  return /\s/g.test(t);
}

function validateKeyAndValue(key, value) {
  return (
    !hasWhiteSpace(key) && typeof value !== 'function' && value !== undefined && toString(value) !== '[object Symbol]'
  );
}

class CJSON {
  constructor() {
    this.at = 0;
    this.token = ' ';
    this.html = '';
    this.escapes = {
      '"': '"',
      '\\': '\\',
      '/': '/',
      b: 'b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t',
    };
  }

  error(msg) {
    throw {name: 'SyntaxError', message: msg, at: this.at, html: this.html};
  }

  next(ch) {
    if (ch && ch !== this.token) {
      this.error(`Expected ${ch} instead of ${this.token}`);
    }
    this.token = this.html.charAt(this.at);
    this.at += 1;
    return this.token;
  }

  number() {
    let num,
      str = '';
    if (this.token === '-') {
      str = '-';
      this.next('-');
    }
    while (this.token >= '0' && this.token <= '9') {
      str += this.token;
      this.next();
    }
    if (this.token === '.') {
      str += '.';
      while (this.next() && this.token >= '0' && this.token <= '9') {
        str += this.token;
      }
    }
    if (this.token === 'e' || this.token === 'E') {
      str += this.token;
      this.next();
      if (this.token === '-' || this.token === '+') {
        str += this.token;
        this.next();
      }
      while (this.token && (this.token >= '0' && this.token <= '9')) {
        str += this.token;
        this.next();
      }
    }
    num = +str; //除正确数字字符串会转为数字外，其他字符串会变成NaN
    if (isNaN(num)) {
      this.error('Bad number!');
    } else {
      return num;
    }
  }

  string() {
    let hex,
      uffff,
      str = '';
    if (this.token === '"') {
      while (this.next()) {
        if (this.token === '"') {
          this.next();
          return str;
        } else {
          if (this.token === '\\') {
            this.next();
            if (this.token === 'u') {
              uffff = 0;
              for (let i = 0; i < 4; ++i) {
                hex = parseInt(this.next(), 16);
                if (!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }
              str += String.fromCharCode(uffff);
            } else {
              if (typeof escapes[this.token] === 'string') {
                str += escapes[this.token];
              } else {
                break;
              }
            }
          } else {
            str += this.token;
          }
        }
      }
    }
    this.error('Bad string!');
  }

  whiteSpace() {
    while (this.token && this.token <= ' ') {
      this.next();
    }
  }

  word() {
    switch (this.token) {
      case 't':
        this.next('t');
        this.next('r');
        this.next('u');
        this.next('e');
        return true;
      case 'f':
        this.next('f');
        this.next('a');
        this.next('l');
        this.next('s');
        this.next('e');
        return false;
      case 'n':
        this.next('n');
        this.next('u');
        this.next('l');
        this.next('l');
        return null;
    }
    this.error(`Unexpected ${this.token}`);
  }

  value() {
    this.whiteSpace();
    switch (this.token) {
      case '{':
        return this.object();
      case '[':
        return this.array();
      case '"':
        return this.string();
      case '-':
        return this.number();
      default:
        return this.token >= '0' && this.token <= '9' ? this.number() : this.word();
    }
  }

  array() {
    let arr = [];
    if (this.token === '[') {
      this.next('[');
      this.whiteSpace();
      if (this.token === ']') {
        this.next(']');
        return arr;
      }
      while (this.token) {
        arr.push(this.value());
        this.whiteSpace();
        if (this.token === '[') {
          arr.push(this.array());
        }
        if (this.token === ']') {
          this.next(']');
          return arr;
        }
        this.next(',');
        this.whiteSpace();
      }
    }
    this.error('Bad array');
  }

  object() {
    let key,
      obj = {};
    if (this.token === '{') {
      this.next('{');
      this.whiteSpace();
      if (this.token === '}') {
        this.next('}');
        return obj;
      }
      while (this.token) {
        key = this.string();
        this.whiteSpace();
        this.next(':');
        obj[key] = this.value();
        this.whiteSpace();
        if (this.token === '}') {
          this.next('}');
          return obj;
        }
        this.next(',');
        this.whiteSpace();
      }
    }
    this.error('Bad object');
  }

  stringify(source, isArrayItem = false) {
    let str = '';
    if (typeof source === 'string') {
      return `"${source}"`;
    }
    if (source === null || isNaN(source)) {
      return null;
    }
    if (isArrayItem) {
      if (typeof source === 'function' || toString(source) === '[object Symbol]' || source === undefined) {
        return null;
      }
    }
    if (typeof source === 'number') {
      return source;
    }
    if (toString(source) === '[object Object]') {
      str += '{';
      Object.keys(source).forEach(key => {
        if (validateKeyAndValue(key, source[key])) {
          str += `"${key}":${this.stringify(source[key])},`;
        }
      });
      str = str.slice(0, -1);
      str += '}';
    }

    if (toString(source) === '[object Array]') {
      str += '[';
      for (let i = 0; i < source.length - 1; ++i) {
        str += this.stringify(source[i], true) + ',';
      }
      str += this.stringify(source[source.length - 1], true) + ']';
    }
    return str;
  }

  parse(source, reviver) {
    this.html = source;
    let result = this.value();
    this.whiteSpace();
    if (this.token) {
      this.error('Syntax error');
    }
    return typeof reviver === 'function'
      ? (function walk(holder, key) {
          let k,
            v,
            value = holder[key];
          if (this.value && typeof this.value === 'object') {
            for (k in this.value) {
              if (Object.prototype.hasOwnProperty.call(this.value, k)) {
                v = walk(this.value, k);
                if (v !== undefined) {
                  this.value[k] = v;
                } else {
                  delete this.value[key];
                }
              }
            }
          }
          return reviver.call(holder, key, this.value);
        })({'': result}, '')
      : result;
  }
}

module.exports = CJSON;
