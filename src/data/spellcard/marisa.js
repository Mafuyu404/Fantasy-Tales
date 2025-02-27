const marisa = {
  marisa: {
    name: "魔法弹",
    detail: "造成10伤害",
    cost: 1,
    aim: true,
    type: "normal_attack",
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("normal_attack").by({
        type: "static",
        value: 10
      });
    }
  },
  m001: {
    name: "开放宇宙",
    detail: "本回合灵力消耗-2\n下回合无法获得灵力",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("throttle", 2);
      Admin.cache["open_universe"] = true;
    }
  },
  m002: {
    name: "洒星封印",
    detail: "锁定灵力数值\n持续一回合",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("throttle", 99);
      Admin.role.buff.of(0).add("insulation");
    },
    lock: true
  },
  m003: {
    name: "超级英仙座",
    detail: "每使用1张符卡\n下回合伤害+10%\n持续一回合",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.cache["super_perseids"] = 1;
    },
    lock: true
  },
  m004: {
    name: "太阳仪",
    detail: "本回合所有伤害\n转移到下回合初结算\n造成150%间接伤害",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("orrerys_sun", 1);
    }
  },
  m005: {
    name: "极限火花",
    detail: "造成36群体伤害\n获得乏力*1",
    cost: 3,
    explain: ["hypodynamic"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 36
      });
      Admin.role.buff.of(0).add("hypodynamic", 1);
    }
  },
  m006: {
    name: "究极火花",
    detail: "造成40群体伤害\n每有1灵力伤害+5%\n下回合无法行动",
    cost: 5,
    handle: function (Admin, Target) {
      let n = Admin.role.power.of(0).get();
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 40 * (1 + 0.05 * n)
      });
      Admin.role.buff.of(0).add("hypodynamic", 1);
    },
    lock: true
  },
  m007: {
    name: "卫星幻觉",
    detail: "从牌库中抽2张牌",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.handcard.draw.amount(2).fromAll();
    },
    lock: true
  },
  m008: {
    name: "魔理沙时间",
    detail: "暴击率+40%\n持续一回合",
    cost: 0,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("marisa_time");
    }
  },
  m009: {
    name: "小行星带",
    detail: "造成4*5群体伤害",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 5,
        amount: 4
      });
    }
  },
  m010: {
    name: "大坍缩",
    detail: "将60伤害平摊给所有敌人",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.enermy.damage.average().source("spellcard").by({
        type: "static",
        value: 60
      });
    },
    lock: true
  },
  m011: {
    name: "星尘幻想",
    detail: "对目标造成40伤害\n对其余敌人\n造成8伤害",
    cost: 3,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 40
      });
      Admin.enermy.damage.targetAll().except(Target).source("spellcard").by({
        type: "static",
        value: 8
      });
    }
  },
  m012: {
    name: "掠日彗星",
    detail: "造成16伤害\n获得8防御结界",
    cost: 2,
    aim: true,
    explain: ["barrier"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 16
      });
      Admin.role.buff.of(0).add("barrier", 8);
    }
  },
  m013: {
    name: "光学迷彩",
    detail: "获得安全的空间*9\n获得虚弱*5",
    cost: 2,
    explain: ["iron_skin", "weak"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("iron_skin", 9);
      Admin.role.buff.of(0).add("weak", 5);
    }
  },
  m014: {
    name: "星光台风",
    detail: "造成27群体穿透伤害\n命中率70%",
    cost: 3,
    explain: ["penetrate"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 27,
        penetrate: true,
        precision: 0.7
      });
    }
  },
  m015: {
    name: "大十字",
    detail: "接下来三次伤害\n暴击伤害+100%",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("grand_cross", 3);
    },
    lock: true
  },
  m016: {
    name: "非定向光线",
    detail: "造成28穿透伤害\n立即击败生命值30%以下的敌人",
    cost: 2,
    aim: true,
    explain: ["penetrate"],
    handle: function (Admin, Target) {
      let state = Admin.enermy.state.of(Target).get();
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 28,
        penetrate: true,
        fatal: state.Health / state.health < 0.3
      });
    },
    lock: true
  },
  m017: {
    name: "龙陨石",
    detail: "造成12+20两次伤害\n该伤害必定暴击\n该伤害击败目标时\n获得临时力量*5",
    cost: 3,
    aim: true,
    explain: ["interim_strength"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 12,
        critical: true,
        dragon_meteor: 1
      });
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 20,
        critical: true,
        dragon_meteor: 2
      });
    }
  },
  m018: {
    name: "增幅",
    detail: "获得力量*2",
    cost: 1,
    explain: ["strength"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("strength", 2);
    }
  },
  m019: {
    name: "过载",
    detail: "获得临时力量*4",
    cost: 2,
    explain: ["interim_strength"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("interim_strength", 4);
    }
  },
  m020: {
    name: "超载",
    detail: "获得临时力量*6",
    cost: 3,
    interim: true,
    explain: ["interim_strength"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("interim_strength", 6);
    },
    lock: true
  },
  m021: {
    name: "唯一的北极星",
    detail: "造成36伤害\n若目标生命值100%\n伤害翻倍",
    cost: 3,
    aim: true,
    handle: function (Admin, Target) {
      let state = Admin.enermy.state.of(Target).get();
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: state.Health / state.health == 1 ? 72 : 36
      });
    },
    lock: true
  },
  m022: {
    name: "试验用使魔",
    detail: "所有伤害截走25%\n在回合末合并\n结算为群体伤害\n持续一回合",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("test_slave");
    },
    lock: true
  },
  m023: {
    name: "逃逸速度",
    detail: "本场战斗\n每回合开始时\n速度+0.6",
    cost: 2,
    interim: true,
    handle: function (Admin, Target) {
      Admin.cache["escape_velocity"] = true;
    },
    lock: true
  },
  m024: {
    name: "光之冲击",
    detail: "造成24伤害\n附加恍惚*6\n持续一回合",
    cost: 2,
    aim: true,
    explain: ["trance"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 24
      });
      Admin.enermy.buff.of(Target).add("trance", 6);
    }
  },
  m025: {
    name: "超短波",
    detail: "造成16伤害\n第一回合打出时\n伤害翻倍",
    cost: 0,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: Admin.role.event.round.count == 1 ? 32 : 16
      });
    },
    lock: true
  },
  m026: {
    name: "脉冲星",
    detail: "复制下一张符卡\n作为一次性牌\n加入手牌",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.cache["pulsar_star"] = 2;
    }
  },
  m027: {
    name: "魔法瓶",
    detail: "附加燃烧*3\n抽一张牌",
    cost: 0,
    interim: true,
    aim: true,
    explain: ["burning"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("burning", 3);
      Admin.handcard.draw.amount(1).fromLeft();
    }
  },
  m028: {
    name: "魔鬼火炬",
    detail: "牌库洗入魔法瓶*4",
    cost: 2,
    explain: ["m027"],
    handle: function (Admin, Target) {
      for (let _ of Array(4)) Admin.handcard.insert.toLeft("m027");
    }
  },
  m029: {
    name: "流星雨",
    detail: "造成4*3伤害\n抽一张牌",
    cost: 0,
    interim: true,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 3,
        amount: 4
      });
      Admin.handcard.draw.amount(1).fromLeft();
    }
  },
  m030: {
    name: "流星共鸣",
    detail: "牌库洗入流星雨*4",
    cost: 2,
    explain: ["m029"],
    handle: function (Admin, Target) {
      for (let _ of Array(4)) Admin.handcard.insert.toLeft("m029");
    }
  },
  m031: {
    name: "地球光",
    detail: "造成12穿透伤害\n抽一张牌",
    cost: 0,
    interim: true,
    aim: true,
    explain: ["penetrate"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 12,
        penetrate: true,
      });
      Admin.handcard.draw.amount(1).fromLeft();
    }
  },
  m032: {
    name: "射向幼月",
    detail: "牌库洗入地球光*4",
    cost: 2,
    explain: ["m031"],
    handle: function (Admin, Target) {
      for (let _ of Array(4)) Admin.handcard.insert.toLeft("m031");
    }
  },
  m033: {
    name: "掩星",
    detail: "从已消耗的牌中\n抽一张牌",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.handcard.draw.amount(1).fromExpend();
    }
  },
  m034: {
    name: "毫秒脉冲星",
    detail: "本回合每消耗1张牌\n此牌造成3*2伤害",
    cost: 2,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 2,
        amount: 3 * Admin.cache["round_expend_count"]
      });
    },
    lock: true
  },
  m035: {
    name: "奥尔特云",
    detail: "造成等同于本回合造成伤害次数的伤害",
    cost: 1,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: Admin.cache["round_damage_frequency"]
      });
    },
    lock: true
  },
  m036: {
    name: "银河",
    detail: "本场战斗中\n造成的所有伤害+2",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("milky_way");
    },
    lock: true
  },
  m037: {
    name: "最终魔法瓶",
    detail: "对全场所有对象\n造成100伤害",
    cost: 0,
    interim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 100
      });
      Admin.role.damage.target(0).source("spellcard").by({
        type: "static",
        value: 100
      });
    }
  }
}

for (let key in marisa) {
  marisa[key].role = "marisa";
}

export default marisa;