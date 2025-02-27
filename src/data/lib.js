export default function () {
  window.deepCopy = (obj) => {
    if (Array.isArray(obj)) {
      let arr = obj;
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          var list = deepCopy(arr[i]);
          newArr.push(list);
        } else {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    } else {
      let temp = obj.constructor === Array ? [] : {};
      for (let val in obj) {
        temp[val] = typeof obj[val] == "object" ? deepCopy(obj[val]) : obj[val];
      }
      return temp;
    }
  };
  window.retain = function (value, n) {
    if (n === "null" || n === "undefined" || n === 0) return parseInt(value);
    let tran = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
    let tranV = tran.toString();
    let newVal = tranV.indexOf(".");
    if (newVal < 0) {
      tranV += ".";
    }
    for (let i = tranV.length - tranV.indexOf("."); i <= n; i++) {
      tranV += "0";
    }
    return tranV;
  };
  window._void = function () {};
  
  String.prototype.getByteLen = function () {
    let len = 0;
    for (let i = 0; i < this.length; i++) {
      this.charCodeAt(i) < 256 ? (len += 1) : (len += 2);
    }
    return len;
  };
  String.prototype.increaseOf = function (obj) {
    if (this in obj) obj[this]++;
    else obj[this] = 1;
  };
  String.prototype.decreaseOf = function (obj) {
    if (obj[this] == 1) delete obj[this];
    else obj[this]--;
  };
  
  Array.prototype.isIncludedBy = function (arr) {
    return this.filter((i) => arr.includes(i)).length == this.length;
  };
  Array.prototype.index = function (f) {
    this.forEach((_, i) => f(i));
  };
  Array.prototype.set = function (v) {
    this.index((i) => (this[i] = v));
  };
  Array.prototype.rd = function () {
    for (
      var j, x, i = this.length;
      i;
      j = parseInt(Math.random() * i),
        x = this[--i],
        this[i] = this[j],
        this[j] = x
    );
    return this;
  };
  Array.prototype.sum = function () {
    let res = 0;
    for (let i of this) res += i;
    return res;
  };
  Array.prototype.count = function () {
    let res = {};
    for (let i of this) i.increaseOf(res);
    return res;
  };
  
  Object.unCount = function (obj) {
    let res = [];
    Object.keys(obj).forEach((c) =>
      [...Array(obj[c]).keys()].forEach((_) => res.push(c)),
    );
    return res;
  };
  
  window.r = Math.random;
  class RAF {
    constructor() {
      this.init();
    }
    init() {
      this._timerIdMap = {
        timeout: {},
        interval: {},
      };
    }
    run(type = "interval", cb, interval = 16.7) {
      const now = Date.now;
      let stime = now();
      let etime = stime;
      //创建Symbol类型作为key值，保证返回值的唯一性，用于清除定时器使用
      const timerSymbol = Symbol();
      const loop = () => {
        this.setIdMap(timerSymbol, type, loop);
        etime = now();
        if (etime - stime >= interval) {
          if (type === "interval") {
            stime = now();
            etime = stime;
          }
          cb();
          type === "timeout" && this.clearTimeout(timerSymbol);
        }
      };
      this.setIdMap(timerSymbol, type, loop);
      return timerSymbol; // 返回Symbol保证每次调用setTimeout/setInterval返回值的唯一性
    }
    setIdMap(timerSymbol, type, loop) {
      const id = requestAnimationFrame(loop);
      this._timerIdMap[type][timerSymbol] = id;
    }
    setTimeout(cb, interval) {
      // 实现setTimeout 功能
      return this.run("timeout", cb, interval);
    }
    clearTimeout(timer) {
      cancelAnimationFrame(this._timerIdMap.timeout[timer]);
    }
    setInterval(cb, interval) {
      // 实现setInterval功能
      return this.run("interval", cb, interval);
    }
    clearInterval(timer) {
      cancelAnimationFrame(this._timerIdMap.interval[timer]);
    }
  }
  window.RAF = RAF;
}