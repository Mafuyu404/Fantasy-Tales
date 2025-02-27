const normalAttack = function (Admin, Target, scale, critical) {
  let damage = {
    type: "static",
    value: 4,
    amount: 2,
    critical: critical
  }
  Admin.role.buff.of(0).link("dawuxianhui").to(_ => {
    damage.value = 10;
    damage.amount = 1;
  });
  Admin.role.buff.of(0).link("six_roots_clean").to(_ => {
    damage.value = 3;
    damage.amount = 4;
  });
  if (!scale) scale = 1;
  damage.value *= scale;
  Admin.enermy.damage.target(Target).source("normal_attack").by(damage);
  Admin.handcard.draw.amount(1).fromLeft();
}

const youmu = {
  youmu: {
    name: '剑气',
    detail: '造成2*4伤害\n抽一张牌',
    cost: 1,
    aim: true,
    type: "normal_attack",
    handle: normalAttack
  },
  y001: {
    name: '未来永劫斩',
    detail: '造成2*13伤害\n获得本能*3',
    cost: 3,
    aim: true,
    explain: ["instinct"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 13,
        amount: 2
      });
      Admin.role.buff.of(0).add("instinct", 3);
    }
  },
  y002: {
    name: '生死流转斩',
    detail: '造成2*9伤害\n附加易伤*3',
    cost: 2,
    aim: true,
    explain: ["fragile"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 9,
        amount: 2
      });
      Admin.enermy.buff.of(Target).add("fragile", 3);
    }
  },
  y003: {
    name: '折伏无间',
    detail: '获得节流*1\n获得本能*4',
    cost: 2,
    explain: ["throttle", "instinct"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("throttle", 1);
      Admin.role.buff.of(0).add("instinct", 3);
    }
  },
  y004: {
    name: '业风神闪斩',
    detail: '造成2*21伤害\n抽一张牌',
    cost: 3,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 21,
        amount: 2
      });
      Admin.handcard.draw.amount(1).fromLeft();
    }
  },
  y005: {
    name: '现世妄执',
    detail: '普攻消耗灵力+1\n伤害+100%\n持续一回合',
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("xianshizhiwang", 1);
    }
  },
  y006: {
    name: '燐气斩',
    detail: '造成等同普攻的效果\n获得加速*5',
    cost: 2,
    aim: true,
    explain: ["accelerate"],
    handle: function (Admin, Target) {
      normalAttack(Admin, Target);
      Admin.role.buff.of(0).add("accelerate", 5);
    }
  },
  y007: {
    name: '大悟显晦',
    interim: true,
    detail: '本场战斗\n剑气伤害变为10',
    cost: 3,
    explain: ["youmu"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("dawuxianhui", 1);
    }
  },
  y009: {
    name: '反射下界斩',
    detail: '下一次受到伤害时\n闪避该伤害\n并造成2*7群体伤害',
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("rebound", 1);
    }
  },
  y010: {
    name: '幽明的苦轮',
    interim: true,
    detail: '获得通灵*4',
    cost: 0,
    explain: ["telepathism"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("telepathism", 4);
    }
  },
  y011: {
    name: '三魂七魄',
    detail: '造成的伤害暴击时\n额外灵力+1\n持续一回合',
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("sanhunqipo", 1);
    }
  },
  y012: {
    name: '一念无量劫',
    detail: '暴击伤害+100%\n持续一回合',
    cost: 3,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("yinianwuliangjie", 1);
    }
  },
  y013: {
    name: '天人之五衰',
    detail: '本回合截至现在\n若还未造成伤害\n每打出过一张牌\n额外灵力+1',
    cost: 2,
    handle: function (Admin, Target) {
      if (Admin.cache["round_damage_total"] == 0) {
        Admin.role.power.of(0).add(Admin.cache["round_punch_count"]);
      }
      else msg({ content: "你造成过伤害了" });
    }
  },
  y014: {
    name: '天界法轮斩',
    detail: '丢弃一张普通攻击\n造成2*5伤害\n额外灵力+2',
    cost: 0,
    aim: true,
    handle: function (Admin, Target) {
      Admin.handcard.abandon.type("normal_attack").amount(1).fromHolds();
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 5,
        amount: 2
      });
      Admin.role.power.of(0).add(2);
    }
  },
  y015: {
    name: '天女返',
    interim: true,
    detail: '本场战斗\n每有1速度\n暴击伤害+20%',
    cost: 4,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("tiannvfan", 1);
    }
  },
  y016: {
    name: '饿鬼道草纸',
    detail: '丢弃全部手牌\n每丢弃1张\n获得通灵*1',
    cost: 1,
    explain: ["telepathism"],
    handle: function (Admin, Target) {
      let amount = Admin.handcard.getHolds().length;
      Admin.handcard.abandon.amount(amount - 1).fromHolds();
      Admin.role.buff.of(0).add("telepathism", amount - 1);
    }
  },
  y017: {
    name: '六道怪奇',
    detail: '普攻伤害变为4*3\n持续一回合',
    cost: 2,
    explain: ["youmu"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("six_roots_clean", 1);
    }
  },
  y018: {
    name: '炯眼剑',
    detail: '对目标附加燃烧*3\n全体目标附加业火*1',
    cost: 2,
    aim: true,
    explain: ["burning", "crime_fire"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("burning", 3);
      Admin.enermy.buff.addAll("crime_fire", 1);
    }
  },
  y019: {
    name: '六根清净斩',
    detail: '造成2*5伤害\n牌库洗入剑气*4',
    cost: 2,
    aim: true,
    explain: ["youmu"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 5,
        amount: 2
      });
      Admin.handcard.insert.amount(4).toLeft("youmu");
    }
  },
  y020: {
    name: '业风闪影阵',
    detail: '获得临时普通攻击*1\n抽两张牌',
    cost: 2,
    explain: ["youmu"],
    handle: function (Admin, Target) {
      Admin.handcard.insert.interim(true).toHolds(Admin.data.role);
      Admin.handcard.draw.amount(2).fromLeft();
    }
  },
  y021: {
    name: '七魄忌讳',
    detail: '丢弃一张普通攻击\n抽三张牌',
    cost: 2,
    handle: function (Admin, Target) {
      Admin.handcard.abandon.type("normal_attack").amount(1).fromHolds();
      Admin.handcard.draw.amount(3).fromLeft();
    }
  },
  y022: {
    name: '迷途之月',
    interim: true,
    detail: '本场战斗\n若对目标造成的伤害\n少于其生命上限5%\n对目标附加恍惚*1',
    cost: 1,
    explain: ["trance"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("meditation_slash", 1);
    }
  },
  y023: {
    name: '凭依之缚',
    detail: '附加恍惚*4\n自身获得恍惚*1',
    cost: 2,
    explain: ["trance"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("trance", 4);
      Admin.role.buff.of(0).add("trance", 1);
    }
  },
  y024: {
    name: '俗谛常住',
    detail: '处于通灵效果下时\n清除通灵\n抽两张牌',
    cost: 0,
    explain: ["telepathism"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).clear("telepathism");
      Admin.handcard.draw.amount(2).fromLeft();
    }
  },
  y025: {
    name: '西行春风斩',
    detail: '造成4*4群体伤害\n打出后回到牌库',
    cost: 3,
    interim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 4,
        amount: 4
      });
      Admin.handcard.insert.interim(true).toLeft("y025");
    }
  },
  y026: {
    name: '迷津慈航斩',
    detail: '造成2*11伤害\n若目标恍惚多于20\n立即击败目标',
    cost: 3,
    aim: true,
    explain: ["trance"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 11,
        amount: 2,
        fatal: Admin.enermy.buff.of(Target).get("trance") > 20
      });
    }
  },
  y027: {
    name: '弦月斩',
    detail: '造成等同普攻的效果\n附加易伤*3',
    cost: 2,
    aim: true,
    explain: ["youmu", "fragile"],
    handle: function (Admin, Target) {
      normalAttack(Admin, Target);
      Admin.enermy.buff.of(Target).add("fragile", 3);
    }
  },
  y028: {
    name: '现世斩',
    detail: '造成等同普攻的效果\n获得燕返*1',
    cost: 2,
    aim: true,
    explain: ["youmu", "yanfan"],
    handle: function (Admin, Target) {
      normalAttack(Admin, Target);
      Admin.role.buff.of(0).add("yanfan", 1);
    }
  },
  y029: {
    name: '冥想斩',
    detail: '造成等同普攻的效果\n在奇数回合伤害翻倍',
    cost: 2,
    aim: true,
    explain: ["youmu"],
    handle: function (Admin, Target) {
      normalAttack(Admin, Target, Admin.role.event.round.count % 2 + 1);
    }
  },
  y030: {
    name: '心抄斩',
    detail: '造成等同普攻的效果\n获得安全的空间*3',
    cost: 2,
    aim: true,
    explain: ["youmu", "iron_skin"],
    handle: function (Admin, Target) {
      normalAttack(Admin, Target);
      Admin.enermy.buff.of(0).add("iron_skin", 3);
    }
  },
  y032: {
    name: '悟入幻想',
    detail: '每有1通灵\n获得安全的空间*1\n移除全部通灵',
    cost: 1,
    explain: ["iron_skin", "telepathism"],
    handle: function (Admin, Target) {
      let amount = Admin.role.buff.of(0).get("telepathism");
      Admin.role.buff.of(0).add("iron_skin", amount);
      Admin.role.buff.of(0).clear("telepathism");
    }
  },
  y033: {
    name: '圆心流转斩',
    detail: '造成2*7伤害\n打出普通攻击时\n获得临时力量*1\n持续一回合',
    cost: 3,
    aim: true,
    explain: ["interim_strength"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 7,
        amount: 2
      });
      Admin.role.buff.of(0).set("Bright_Bitter_Wheel", 1);
    }
  },
  y034: {
    name: '血振魍魉',
    interim: true,
    detail: '本场战斗\n受到伤害时\n触发一次通灵效果',
    cost: 3,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("xuezhenchimei", 1);
    }
  },
  y035: {
    name: '心眼迷想斩',
    detail: '造成2*11伤害\n必定暴击\n获得燕返*1',
    cost: 3,
    aim: true,
    explain: ["yanfan"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 11,
        amount: 2,
        critical: true
      });
      Admin.role.buff.of(0).add("yanfan", 1);
    }
  },
  y036: {
    name: '缠缚剑',
    detail: '丢弃一张普通攻击\n获得燕返*2',
    cost: 0,
    explain: ["yanfan"],
    handle: function (Admin, Target) {
      Admin.handcard.abandon.type("normal_attack").amount(1).fromHolds();
      Admin.role.buff.of(0).add("yanfan", 1);
    }
  },
  y037: {
    name: '业风神闪斩',
    detail: '造成2*7群体伤害\n获得燕返*1',
    cost: 2,
    explain: ["yanfan"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 7,
        amount: 2
      });
      Admin.role.buff.of(0).add("yanfan", 1);
    }
  }
}

for (let key in youmu) {
  youmu[key].role = "youmu";
}

export default youmu;