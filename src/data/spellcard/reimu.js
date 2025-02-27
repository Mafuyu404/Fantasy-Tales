import growth from "../growth";

const reimu = {
  reimu: {
    name: "阴阳印",
    detail: "造成6伤害\n获得清欢*3",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("normal_attack").by({
        type: "static",
        value: 6
      });
      Admin.role.buff.of(0).add("pure_happy", 3);
    },
    explain: ["pure_happy", "penetrate"],
    aim: true,
    type: "normal_attack"
  },
  r001: {
    name: "梦想封印",
    detail: "重复6次对随机目标造成6伤害\n未命中时获得清欢*6",
    cost: 3,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      [1, 2, 3, 4, 5, 6].forEach(_ => {
        Admin.enermy.damage.random().source("spellcard").by({
          type: "static",
          value: 6,
          dream_seal: true
        });
      });
    }
  },
  r002: {
    name: "前方安全札",
    detail: "本回合造成伤害时\n回复4生命值\n获得恍惚*2、清欢*2",
    cost: 2,
    explain: ["pure_happy", "penetrate", "trance"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("font_safe", 1);
    }
  },
  // r003: { 搬了这牌是因为，拟态猫挂件把灵力需求转化为百分比扣当前生命值了，这样的话无论受到多少伤害生命值都会无限趋近于0，而永远不会死
  //   name: "梦想天生",
  //   detail: "每受到3伤害\n消耗1灵力阻挡\n持续一回合",
  //   cost: 3,
  //   handle: function (Admin, Target) {
  //     Admin.role.buff.of(0).set("dream_born");
  //   }
  // },
  r004: {
    name: "阴阳玉将",
    detail: "削减所有目标\n25%当前生命值\n命中获得清欢*4",
    cost: 3,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.enermy.survival().forEach(i => {
        let Health = Admin.enermy.state.of(i).get().Health;
        Admin.enermy.state.of(i).set("Health", Health * 0.75);
        Admin.role.buff.of(0).add("pure_happy", 4);
      })
    },
    lock: true
  },
  r005: {
    name: "二重结界",
    detail: "全体目标附加曝光*1",
    cost: 2,
    explain: ["exposure"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.addAll("exposure", 1);
    },
    lock: true
  },
  r006: {
    name: "博丽幻影",
    detail: "40%概率闪避伤害\n闪避时获得清欢*6\n持续一回合",
    cost: 2,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("hakurei_phantom");
    }
  },
  r007: {
    name: "阴阳散华",
    detail: "抽两张牌\n获得清欢*8",
    cost: 3,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.handcard.draw.amount(2).fromLeft();
      Admin.role.buff.of(0).add("pure_happy", 8);
    }
  },
  r008: {
    name: "魔净闪结",
    detail: "回复6生命值\n获得清欢*6\n下张牌造成同样效果",
    cost: 3,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.role.heal.target(0).by({
        type: "static",
        value: 6
      });
      Admin.role.buff.of(0).add("pure_happy", 6);
      Admin.cache["magic_link"] = true;
    }
  },
  r009: {
    name: "八方鬼缚阵",
    detail: "获得预知*2",
    cost: 2,
    interim: true,
    explain: ["foresee"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("foresee", 2);
    },
    lock: true
  },
  r010: {
    name: "妖怪拘禁符",
    detail: "附加易伤*4\n若目标生命值100%\n目标的下次行动变为\n附加恍惚*3",
    cost: 3,
    explain: ["fragile", "trance"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("fragile", 4);
      let state = Admin.enermy.state.of(Target).get();
      if (state.Health == state.health) {
        Admin.enermy.buff.of(Target).add("trance_cage", 1);
      }
    },
    aim: true
  },
  r011: {
    name: "无差别降伏",
    detail: "造成24伤害\n若未暴击\n获得清欢*8",
    cost: 3,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 24,
        undifferentiated_subduction: true
      });
    },
    aim: true
  },
  r012: {
    name: "妖怪破坏者",
    detail: "造成16伤害\n若未命中\n获得防御结界*12",
    cost: 2,
    explain: ["barrier"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 16,
        ghost_breaker: true
      });
    },
    aim: true
  },
  r013: {
    name: "退魔符乱舞",
    detail: "消耗6清欢\n造成1穿透群体伤害\n每有6清欢伤害+1\n打出后回到手牌",
    cost: 1,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 1 + Math.floor(Admin.role.buff.of(0).get("pure_happy") / 6),
        penetrate: true
      });
      Admin.handcard.insert.interim(true).toHolds("r013");
      Admin.role.buff.of(0).clear("pure_happy", 6);
    },
    interim: true,
    lock: true
  },
  r014: {
    name: "梦想亚空穴",
    detail: "获得2额外灵力\n生命-2\n打出后回到手牌\n生命消耗+2",
    cost: 0,
    handle: function (Admin, Target) {
      if (!Admin.cache["reimu_health_cost"]) Admin.cache["reimu_health_cost"] = 2
      let state = Admin.role.state.of(0).get();
      Admin.role.power.of(0).add(2);
      Admin.role.state.of(0).set("Health", state.Health - Admin.cache["reimu_health_cost"]);
      Admin.cache["reimu_health_cost"] += 2;
      Admin.handcard.insert.interim(true).toHolds("r014");
    },
    interim: true,
    lock: true
  },
  r015: {
    name: "常置阵",
    detail: "获得曝光*1\n获得安全的空间*5",
    cost: 2,
    explain: ["exposure", "iron_skin"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("exposure", 1);
      Admin.role.buff.of(0).add("iron_skin", 5);
    }
  },
  r016: {
    name: "明珠暗投",
    detail: "下回合初\n获得清欢*12\n抽两张牌",
    cost: 2,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("waiting_pearl");
    },
    lock: true
  },
  r017: {
    name: "阴阳玉乱舞",
    detail: "造成32伤害\n击败目标时抽两张牌",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 32,
        jade_dance: true
      });
    },
    aim: true
  },
  r018: {
    name: "神灵宝珠",
    detail: "生命-8\n抽两张牌",
    cost: 0,
    handle: function (Admin, Target) {
      Admin.role.state.of(0).add("Health", -8);
      Admin.handcard.draw.amount(2).fromLeft();
    }
  },
  r019: {
    name: "无情驱魔棒",
    detail: "获得节流*1\n获得虚弱*3",
    cost: 0,
    explain: ["throttle", "weak"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("throttle", 1);
      Admin.role.buff.of(0).add("weak", 3);
    },
    lock: true
  },
  r020: {
    name: "信仰之针",
    detail: "造成8伤害\n未命中时抽两张牌",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 32,
        faith_needle: true
      });
    },
    aim: true,
    lock: true
  },
  r021: {
    name: "扩散灵符",
    detail: "获得清欢*8\n不在第一回合使用时\n再获得恍惚*3",
    cost: 2,
    explain: ["pure_happy", "penetrate", "trance"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("pure_happy", 6);
      if (Admin.role.event.round.count != 1) Admin.role.buff.of(0).add("trance", 3);
    }
  },
  r022: {
    name: "犯规结界",
    detail: "丢弃全部手牌\n获得防御结界*12",
    cost: 1,
    explain: ["barrier"],
    handle: function (Admin, Target) {
      let amount = Admin.handcard.getHolds().length;
      Admin.handcard.abandon.amount(amount - 1).fromHolds();
      Admin.role.buff.of(0).add("interim_barrier", 16);
    },
    lock: true
  },
  r023: {
    name: "阴阳飞鸟井",
    detail: "本回合打出符卡时\n30%概率获得清欢*4\n并获得2额外灵力",
    cost: 3,
    interim: true,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("yinyang_bird");
    }
  },
  r024: {
    name: "阴阳宝玉",
    detail: "抽两张符卡\n获得清欢*4\n获得恍惚*3",
    cost: 2,
    explain: ["pure_happy", "penetrate", "trance"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("pure_happy", 4);
      Admin.role.buff.of(0).add("trance", 3);
      Admin.handcard.draw.amount(2).type("spellcard").fromLeft();
    },
    lock: true
  },
  r025: {
    name: "阴阳鬼神玉",
    detail: "造成等同于\n生命上限的伤害\n每有1%额外上限\n该伤害+1%",
    cost: 4,
    handle: function (Admin, Target) {
      let originState = deepCopy(growth.role[Admin.data.role]);
      let state = Admin.role.state.of(0).get();
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: state.health * Math.max(1, 1 + (state.health - originState.health) / originState.health)
      });
    },
    aim: true
  },
  r026: {
    name: "幻想一重",
    detail: "处于清欢效果下时\n清除所有清欢\n生命上限+7",
    cost: 2,
    explain: ["pure_happy"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).clear("pure_happy");
      Admin.role.state.of(0).add("health", 7);
    },
    lock: true
  },
  r027: {
    name: "亚空穴",
    detail: "丢弃一张牌\n生命上限+4\n打出后回到牌库",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.handcard.abandon.amount(1).fromHolds();
      Admin.role.state.of(0).add("health", 4);
      Admin.handcard.insert.interim(true).toLeft("r014");
    },
    interim: true
  },
  r028: {
    name: "八方龙杀阵",
    detail: "本场战斗\n受到伤害-40%\n速度-1",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("eight_dragon_kill", 1);
    },
    interim: true
  },
  r029: {
    name: "高速祈愿札",
    detail: "生命上限+12\n回复8生命\n获得清欢*4",
    cost: 3,
    interim: true,
    explain: ["pure_happy"],
    handle: function (Admin, Target) {
      Admin.role.state.of(0).add("health", 12);
      Admin.role.heal.target(0).by({
        type: "static",
        value: 8
      });
    },
    lock: true
  },
  r030: {
    name: "大祸津日",
    detail: "造成伤害-90%\n治疗效果+100%\n持续一回合",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("big_bad_sun", 1);
    },
    lock: true
  },
  r031: {
    name: "梦想妙珠连",
    detail: "牌库洗入梦想妙珠*4",
    cost: 3,
    explain: ["r032"],
    handle: function (Admin, Target) {
      Admin.handcard.insert.amount(4).toLeft("r032");
    }
  },
  r032: {
    name: "梦想妙珠",
    detail: "获得清欢*3\n生命上限+3\n抽一张牌",
    cost: 0,
    interim: true,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("pure_happy", 3);
      Admin.role.state.of(0).add("health", 3);
      Admin.handcard.draw.amount(1).fromLeft();
    }
  },
  r033: {
    name: "扩散结界",
    detail: "清除目标和自身\n所有正面效果\n抽两张牌",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).clearAll(true);
      Admin.enermy.buff.of(Target).clearAll(true);
      Admin.handcard.draw.amount(2).fromLeft();
    }
  },
  r034: {
    name: "幻想之月",
    detail: "处于清欢效果下时\n清除所有清欢\n获得5额外灵力",
    cost: 0,
    explain: ["pure_happy", "penetrate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).clear("pure_happy");
      Admin.role.power.of(0).add(5);
    },
    lock: true
  },
  r035: {
    name: "即妙神域札",
    detail: "清除自身所有效果\n回复12生命",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).clearAll();
      Admin.role.heal.target(0).by({
        type: "static",
        value: 12
      });
    }
  },
  r036: {
    name: "折跃阴阳玉",
    detail: "造成20群体伤害\n命中时回复4生命\n反之生命上限+4",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 20,
        jump_jade: true
      });
    },
    lock: true
  },
  r037: {
    name: "封魔阵",
    detail: "造成16穿透伤害\n附加易伤*4\n暴击时生命上限+8",
    cost: 3,
    explain: ["fragile", "penetrate"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 16,
        penetrate: true,
        seal_array: true
      });
      Admin.enermy.buff.of(Target).add("fragile", 4);
    },
    aim: true
  }
}

for (let key in reimu) {
  reimu[key].role = "reimu";
}

export default reimu;