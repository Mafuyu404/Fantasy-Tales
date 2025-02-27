export default {
  role: {
    marisa: {
      health: 42,
      attack: 7,
      speed: 2,
      power: 1
    },
    reimu: {
      health: 42,
      attack: 7,
      speed: 2,
      power: 8
    },
    renko: {
      health: 48,
      attack: 8,
      speed: 2,
      power: 1
    },
    youmu: {
      health: 48,
      attack: 8,
      speed: 3,
      power: 7
    },
    pachi: {
      health: 42,
      attack: 7,
      speed: 2,
      power: 7
    },
    alice: {
      health: 54,
      attack: 9,
      speed: 2,
      power: 4
    },
    reisen: {
      health: 48,
      attack: 8,
      speed: 2,
      power: 6
    },
    kokoro: {
      health: 54,
      attack: 9,
      speed: 2,
      power: 8
    }
  },
  enermy: {
    cirno: lv => {
      return enermy(lv, 1, 1, 1);
    },
    piece: lv => {
      return enermy(lv, 1, 1, 1);
    },
    lilywhite: lv => {
      return enermy(lv, 1, 1, 1);
    },
    sunny: lv => {
      return enermy(lv, 1, 1, 1);
    },
    lunar: lv => {
      return enermy(lv, 1, 1, 1);
    },
    star: lv => {
      return enermy(lv, 1, 1, 1);
    },
    eternity: lv => {
      return enermy(lv, 1, 1, 1);
    }
  },
  amount: lv => {
    let e = 4.2 - 1 / Math.pow(2, (lv / 32 - 2)),
      p = e - parseInt(e),
      a = Number(Math.random() < p);
    return Math.max(parseInt(e) + a, 1);
  }
}

function role(lv, h, a, s, p) {
  return {
    health: Math.ceil(r(lv) * h),
    attack: Math.ceil(r(lv) * a / 6),
    speed: 2 + 0.02 * lv * s,
    power: p
  }
}

function enermy(lv, h, a, s) {
  return {
    health: float(e(lv) * h),
    attack: float(e(lv) * a / 8),
    speed: 1 + 0.04 * (lv - 1) * s,
  }
}

function r(lv) {
  return parseInt(Math.pow(Math.E, lv / (Math.E * Math.log(lv + 1) + Math.sqrt(lv) / Math.E)) + lv + 10);
}

function e(lv) {
  console.log(6)
  lv = retain((lv + 10) * window.exploreLevelScale, 0);
  return parseInt(Math.pow(Math.E, lv / (Math.log(lv + 1) + Math.sqrt(lv))) + lv + 10);
}

function float(v) {
  return v * 0.90 + Math.random().toFixed(2) * v * 0.2;
}