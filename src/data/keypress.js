const keypress = {
  mapping: {},
  bind: function (key, f) {
    this.mapping[key] = f;
    this.install();
  },
  install: function () {
    window.oncontextmenu = e => {
      e.preventDefault();
    }
    window.onkeyup = e => {
      for (let key of Object.keys(this.mapping)) {
        const code = {
          esc: 27,
          a: 65,
          d: 68,
          q: 81,
          e: 69,
          space: 32,
          r: 82,
          f: 70,
          w: 87,
          s: 83,
          enter: 13
        }
        if (code[key] == e.keyCode) this.mapping[key]();
      }
    };
  }
}

export default keypress;