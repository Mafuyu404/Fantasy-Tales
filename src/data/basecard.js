import spellcard from "../data/spellcard";

const basecard = {
  a001: {
    name: "森罗万象",
    detail: "抽牌至上限",
    cost: 3,
    interim: true,
    handle: function (Admin, Target) {
      let holdLimit = 4 + Math.round(Admin.role.state.of(0).get().speed);
      let holdLength = Admin.handcard.getHolds().length;
      Admin.handcard.draw.amount(holdLimit - holdLength).fromLeft();
    }
  },
  a002: {
    name: "小憩",
    detail: "回复20%最大生命",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.heal.target(0).by({
        type: "static",
        value: Admin.role.state.of(0).get().health * 0.2
      });
    }
  },
  a003: {
    name: "圣骑士",
    detail: "造成10伤害\n获得等同于20%\n生命上限的防御结界",
    cost: 2,
    aim: true,
    explain: ["barrier"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: 10
      });
      Admin.role.buff.of(0).add("barrier", Math.ceil(Admin.role.state.of(0).get().health * 0.2));
    }
  },
  a004: {
    name: "灵力冲天炮",
    detail: "消耗全部灵力\n造成6伤害\n每消耗1灵力伤害+6",
    cost: 1,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: 6 * Admin.role.power.of(0).get()
      });
      Admin.role.power.of(0).clear();
    },
    lock: true
  },
  a006: {
    name: "虚空",
    detail: "获得预言*1\n抽一张牌",
    cost: 2,
    explain: ["prophesy"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("prophesy", 1);
      Admin.handcard.draw.amount(1).fromLeft();
    }
  },
  a007: {
    name: "抛硬币",
    detail: "损失10硬币\n获得强运*1",
    cost: 2,
    interim: true,
    explain: ["strong_luck"],
    handle: function (Admin, Target) {
      if (Admin.data.coin >= 10) {
        Admin.data.coin -= 10;
        Admin.role.buff.of(0).add("strong_luck");
      }
      else msg({ content: "硬币不够了" });
    }
  },
  a008: {
    name: "千里炽云",
    detail: "附加燃烧*4\n附加流血*4\n附加易伤*4",
    cost: 2,
    aim: true,
    explain: ["burning", "bleed", "fragile"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("burning", 4);
      Admin.enermy.buff.of(Target).add("bleed", 4);
      Admin.enermy.buff.of(Target).add("fragile", 4);
    }
  },
  a009: {
    name: "不干净之手",
    detail: "造成8伤害\n获得50硬币",
    cost: 1,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: 9
      });
      Admin.event.getCoin(50);
    }
  },
  a017: {
    name: "圣光",
    detail: "回复8生命\n将临时防御结界*16\n给予场上全体目标",
    cost: 2,
    explain: ["interim_barrier"],
    handle: function (Admin, Target) {
      Admin.role.heal.target(0).by({
        type: "static",
        value: 8
      });
      Admin.enermy.buff.addAll("interim_barrier", 16);
      Admin.role.buff.of(0).add("interim_barrier", 16);
    }
  },
  a021: {
    name: "缠绵一梦",
    detail: "丢弃一张手牌\n造成16群体伤害",
    cost: 2,
    handle: function (Admin, Target) {
      if (Admin.handcard.getHolds().length > 1) {
        Admin.enermy.damage.targetAll().source("basecard").by({
          type: "static",
          value: 16
        });
        Admin.handcard.abandon.amount(1).fromHolds();
      }
      else msg({ content: "手牌不足" });
    }
  },
  a022: {
    name: "大憩",
    detail: "回复16生命值",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.heal.target(0).by({
        type: "static",
        value: 16
      });
    }
  },
  a023: {
    name: "深渊之殇",
    detail: "造成等同于自身当前生命50%的伤害",
    cost: 2,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: Admin.role.state.of(0).get().Health * 0.5
      });
    }
  },
  a024: {
    name: "节奏感",
    detail: "本场战斗中\n每使用一张通式\n回复5生命值",
    cost: 2,
    interim: true,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("rhythm");
    }
  },
  a025: {
    name: "魔豆",
    detail: "每回合回复5生命\n获得2额外灵力\n持续3回合",
    cost: 1,
    interim: true,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("magic_bean", 3);
    },
    lock: true
  },
  a026: {
    name: "以血为刃",
    detail: "造成伤害时\n伤害+8，生命值-4\n持续一回合",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("blood_blade", 1);
    },
    lock: true
  },
  a012: {
    name: "傲慢",
    detail: "手牌加入随机通式*1\n获得2额外灵力",
    cost: 0,
    handle: function (Admin, Target) {
      Admin.handcard.insert.toHolds(Object.keys(basecard).rd()[0]);
      Admin.role.power.of(0).add(2);
    }
  },
  a013: {
    name: "强欲",
    detail: "抽两张牌",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.handcard.draw.amount(2).fromLeft();
    }
  },
  a014: {
    name: "暴怒",
    detail: "丢弃一张通式\n获得本能*5",
    cost: 2,
    explain: ["instinct"],
    handle: function (Admin, Target) {
      let source = Admin.handcard.getHolds().filter(c => c.type == "spellcard");
      if (source.length > 0) {
        Admin.handcard.abandon.type("basecard").amount(1).fromHolds();
        Admin.role.buff.of(0).add("instinct", 5);
      }
      else msg({ content: "通式数量不足" });
    }
  },
  a015: {
    name: "暴食",
    detail: "额外灵力+7",
    cost: 3,
    interim: true,
    handle: function (Admin, Target) {
      Admin.role.power.of(0).add(8);
    }
  },
  a016: {
    name: "色欲",
    detail: "指定目标下次行动为\n造成等同于\n15%生命上限的伤害",
    cost: 2,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("lust");
    }
  },
  a018: {
    name: "怠惰",
    detail: "造成和上一张打出的牌同样的效果\n对怠惰自身无效",
    cost: 2,
    handle: function (Admin, Target) {
      let last_card = Admin.cache["last_card"];
      if (last_card) {
        if (last_card in basecard) basecard[last_card].handle(Admin, Admin.cache["last_target"]);
        else spellcard[last_card].handle(Admin, Admin.cache["last_target"]);
      }
      else msg({ content: "你还一张牌都没打过" });
    }
  },
  a019: {
    name: "嫉妒",
    detail: "丢弃所有手牌\n抽取等量手牌",
    cost: 2,
    handle: function (Admin, Target) {
      let amount = Admin.handcard.getHolds().length;
      Admin.handcard.abandon.amount(amount - 1).fromHolds();
      Admin.handcard.draw.amount(amount).fromLeft();
    }
  },
  a000: {
    name: "谦逊",
    detail: "灵力消耗-1\n持续一回合",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("throttle");
    },
    lock: true
  },
  a005: {
    name: "贞洁",
    detail: "驱散自身拥有的\n随机一个负面效果\n回复8生命",
    cost: 2,
    handle: function (Admin, Target) {
      let buff = Admin.role.buff.of(0).getAll();
      let target = Object.keys(buff).filter(b => !buff[b].positive).rd()[0];
      Admin.role.buff.of(0).clear(target);
      Admin.role.heal.target(0).by({
        type: "static",
        value: 8
      });
    },
    lock: true
  },
  a010: {
    name: "慷慨",
    detail: "丢弃一张牌\n抽两张牌",
    cost: 0,
    handle: function (Admin, Target) {
      Admin.handcard.abandon.amount(1).fromHolds();
      Admin.handcard.draw.amount(2).fromLeft();
    },
    lock: true
  },
  a011: {
    name: "耐心",
    detail: "每打出一张普通攻击\n获得专注*5\n持续一回合",
    cost: 2,
    explain: ["focus"],
    handle: function (Admin, Target) {
      Admin.cache["patience"] = true;
    },
    lock: true
  },
  a020: {
    name: "宽容",
    detail: "从弃牌堆中抽两张牌\n获得2额外灵力",
    cost: 3,
    handle: function (Admin, Target) {
      Admin.handcard.draw.amount(2).fromUsed();
      Admin.role.power.of(0).add(2);
    },
    lock: true
  },
  a027: {
    name: "节制",
    detail: "失去所有灵力\n下回合获得双倍\n额外灵力",
    cost: 0,
    interim: true,
    handle: function (Admin, Target) {
      let amount = Admin.role.power.of(0).get();
      Admin.role.power.of(0).clear();
      Admin.role.buff.of(0).add("charging", amount * 2);
    },
    lock: true
  },
  a028: {
    name: "勤奋",
    detail: "手牌灵力消耗+2\n效果翻倍\n持续一回合",
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("diligence", 1);
    },
    lock: true
  },
  a029: {
    name: "散华之箭",
    detail: "造成12穿透伤害\n目标每有1种负面效果，伤害次数+1",
    cost: 2,
    aim: true,
    handle: function (Admin, Target) {
      let amount = Admin.enermy.buff.of(Target).count(false);
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: 12,
        penetrate: true,
        amount: 1 + amount
      });
    }
  },
  a030: {
    name: "影子戏法",
    detail: "造成4*2间接伤害\n获得影袭*1\n回合初丢弃全部该卡",
    cost: 1,
    aim: true,
    interim: true,
    explain: ["shadow_joke"],
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: 2,
        amount: 4,
        indirect: true,
        shadow_joke: true
      });
      Admin.role.buff.of(0).set("shadow_joke", 1);
    },
    lock: true
  },
  a031: {
    name: "避世",
    detail: "获得安全的空间*6",
    cost: 3,
    explain: ["iron_skin"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("iron_skin", 6);
    }
  },
  a032: {
    name: "挑战者",
    detail: "造成5伤害\n场上每有1敌人\n伤害+5",
    cost: 2,
    aim: true,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("basecard").by({
        type: "static",
        value: 5 + 5 * Admin.enermy.survival().length
      });
    }
  },
  a033: {
    name: "红月安魂曲",
    detail: "造成的伤害暴击时\n转化为穿透伤害\n持续一回合",
    cost: 2,
    explain: ["penetrate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).set("moon_sleep", 1);
    },
    lock: true
  },
  a034: {
    name: "白日酒",
    detail: "回复12生命\n超出的部分转化为\n等量防御结界",
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.heal.target(0).by({
        type: "static",
        value: 12,
        cheer_up: true
      });
    },
    lock: true
  },
  a035: {
    name: "借势",
    detail: "手牌加入普通攻击*1\n获得2额外灵力",
    cost: 0,
    handle: function (Admin, Target) {
      Admin.handcard.insert.amount(1).toHolds(Admin.data.role);
      Admin.role.power.of(0).add(2);
    }
  },
  a036: {
    name: "单向通行",
    detail: "获得加速*2\n每次打出该卡时\n多获得加速*2",
    cost: 2,
    explain: ["accelerate"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("accelerate", 2);
      if (!Admin.cache["accelerate_count"]) Admin.cache["accelerate_count"] = 1;
      else Admin.cache["accelerate_count"]++;
      Admin.role.buff.of(0).add("accelerate", Admin.cache["accelerate_count"] * 2);
    }
  },
  a037: {
    name: "虚实一线天",
    detail: "获得谨慎*2\n场上每有1敌人\n额外获得谨慎*1",
    cost: 2,
    explain: ["cautious"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("cautious", 2 + Admin.enermy.survival().length);
    },
    lock: true
  },
  a038: {
    name: "醒时月",
    detail: "指定上一张打出的牌\n每回合初复制到手牌\n对醒时月自身无效",
    cost: 3,
    interim: true,
    handle: function (Admin, Target) {
      let last_card = Admin.cache["last_card"];
      if (last_card) {
        Admin.handcard.insert.amount(1).interim(true).toHolds(last_card);
        if (!Admin.cache["a038_round_inset_card"]) Admin.cache["a038_round_inset_card"] = [];
        Admin.cache["a038_round_inset_card"].push(last_card);
      }
      else msg({ content: "你还一张牌都没打过" });
    },
    lock: true
  }
};

for (let c in basecard) {
  basecard[c].type = "basecard";
  basecard[c].role = "base";
}

export default basecard;