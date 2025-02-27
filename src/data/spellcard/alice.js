import sector from "../sector";

function dollAttack(Admin, Target) {
  Admin.enermy.damage.target(Target).source("normal_attack").by({
    type: "static",
    value: 4,
  });
  for (let doll of Admin.role.doll.get()) {
    if (doll.key == "geliya") {
      Admin.enermy.damage.targetAll().source("normal_attack").by({
        type: "static",
        value: doll.attack,
        indirect: true
      });
    } else {
      Admin.enermy.damage.target(Target).source("normal_attack").by({
        type: "static",
        value: doll.key == "lundun" ? doll.health : doll.attack,
        indirect: true
      });
    }
  }
}

const alice = {
  alice: {
    name: '人偶千枪',
    detail: '造成4伤害\n场上所有人偶\n同时对目标进行攻击\n本回合末再进行一次',
    cost: 1,
    handle: function (Admin, Target) {
      dollAttack(Admin, Target);
      if (!Admin.cache["roundEndAttack"]) Admin.cache["roundEndAttack"] = [];
      Admin.cache["roundEndAttack"].push(_ => dollAttack(Admin, Target));
    },
    type: "normal_attack",
    aim: true
  },
  al001: {
    name: '狡猾的献祭',
    detail: '造成32伤害\n选择三个人偶移除\n获得蓬莱人偶*1',
    cost: 0,
    handle: function (Admin, Target) {
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 32
      });
      Admin.handcard.insert.amount(1).toHolds("al024");
      Admin.role.doll.remove(3)
    },
    aim: true
  },
  al002: {
    name: '小小军势',
    detail: '获得气势*2\n场上每有一个人偶\n额外获得气势*1',
    cost: 2,
    explain: ["momentum"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("momentum", 2 + Admin.role.doll.get().length);
    }
  },
  al003: {
    name: '回归虚无',
    detail: '每有一个人偶\n造成5群体伤害\n移除所有人偶',
    cost: 0,
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 5,
        amount: Admin.role.doll.get().length
      });
      Admin.role.doll.clearAll();
    }
  },
  al004: {
    name: '魔法布料',
    detail: '下一次打出人偶牌时\n将其临时复制到手牌',
    cost: 1,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("magic_fabric", 1);
    }
  },
  al005: {
    name: '人偶小口袋',
    detail: '下回合开始时\n额外灵力+3',
    cost: 2,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("charging", 3);
    }
  },
  al006: {
    name: '人偶大口袋',
    detail: '下回合开始时\n额外灵力+4',
    cost: 3,
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("charging", 4);
    }
  },
  al007: {
    name: '绊线',
    detail: '造成4群体伤害\n每剩余1灵力\n伤害次数+1',
    cost: 2,
    handle: function (Admin, Target) {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 4,
        amount: Admin.role.power.of(0).get()
      });
    }
  },
  al008: {
    name: '手工剪刀',
    detail: '选择一个人偶移除\n临时复制魔法布料*2\n加入到手牌',
    cost: 1,
    explain: ["al004"],
    handle: function (Admin, Target) {
      Admin.handcard.insert.amount(2).interim(true).toHolds("al004");
      Admin.role.doll.remove(1);
    }
  },
  al009: {
    name: '缝纫针',
    detail: '附加虚弱*1、易伤*1\n目标每有1种debuff\n获得虚弱*1、易伤*1',
    cost: 2,
    explain: ["weak", "fragile"],
    handle: function (Admin, Target) {
      let amount = Admin.enermy.buff.of(Target).count(false);
      Admin.enermy.buff.of(Target).add("weak", amount + 1);
      Admin.enermy.buff.of(Target).add("fragile", amount + 1);
    },
    aim: true
  },
  al010: {
    name: '千枪堡垒',
    detail: '场上每有一个人偶\n获得安全的空间*1',
    cost: 2,
    explain: ["iron_skin"],
    handle: function (Admin, Target) {
      Admin.role.buff.of(0).add("iron_skin", Admin.role.doll.get().length);
    }
  },
  al011: {
    name: '七色魔法书',
    detail: '丢弃所有非人偶手牌\n额外灵力+5',
    cost: 2,
    handle: function (Admin, Target) {
      let holds = Admin.handcard.getHolds();
      let target = holds.map((_, i) => i).filter(i => !holds[i].explain || !holds[i].explain.includes("doll"));
      Admin.handcard.abandon.fromHolds(target);
      Admin.role.power.of(0).add(7);
    }
  },
  al012: {
    name: '玩偶战争',
    detail: '抽两张人偶牌',
    cost: 2,
    handle: function (Admin, Target) {
      let range = Admin.handcard.getLefts().filter(card => card.explain && card.explain.includes("doll"));
      Admin.handcard.draw.amount(2).from(range.map(card => card.index));
    }
  },
  al013: {
    name: '缠丝网',
    detail: '清空自然灵力\n获得防御结界*16',
    cost: 1,
    explain: ["interim_barrier"],
    handle: function (Admin, Target) {
      let exPower = Admin.role.power.of(0).getExPower();
      Admin.role.power.of(0).clear();
      Admin.role.power.of(0).add(exPower);
      Admin.role.buff.of(0).add("barrier", 16);
    }
  },
  al014: {
    name: '少女文乐',
    detail: '抽三张牌',
    cost: 3,
    handle: function (Admin, Target) {
      Admin.handcard.draw.amount(3).fromLeft();
    }
  },
  al015: {
    name: '未来文乐',
    detail: '丢弃三张手牌\n下回合初抽牌至上限',
    cost: 2,
    handle: function (Admin, Target) {
      Admin.handcard.abandon.amount(3).fromHolds();
      Admin.role.buff.of(0).set("weilaiwenle", 1);
    }
  },
  al016: {
    name: '人偶祭典',
    detail: '触发回合结束的效果',
    cost: 3,
    handle: function (Admin, Target) {
      sector.roleRoundEnd(Admin);
    }
  },
  al017: {
    name: '人偶十字军',
    detail: '丢弃两张手牌\n放置泛用人偶*3',
    cost: 1,
    explain: ["al035"],
    handle: function (Admin, Target) {
      Admin.handcard.abandon.amount(2).fromHolds();
      for (let _ of [1, 2, 3])
        Admin.role.doll.add({
          health: 12,
          attack: 4,
          key: "fanyong",
          name: "泛用人偶",
          card: "al035"
        });
    }
  },
  al018: {
    name: '敢死小分队',
    detail: '临时复制自爆人偶*3\n加入到手牌',
    cost: 1,
    explain: ["al034"],
    handle: function (Admin, Target) {
      Admin.handcard.insert.amount(3).interim(true).toHolds("al034");
    }
  },
  al019: {
    name: '狡猾的吟颂者',
    detail: '消耗全部灵力\n每消耗1灵力\n对目标附加易伤*1',
    cost: 2,
    explain: ["fragile"],
    handle: function (Admin, Target) {
      Admin.enermy.buff.of(Target).add("fragile", Admin.role.power.of(0).get());
      Admin.role.power.of(0).clear();
    },
    aim: true
  },
  al020: {
    name: '人偶鲸鱼座',
    detail: '造成8群体伤害\n场上每有1自爆人偶\n伤害*140%\n移除全部自爆人偶',
    cost: 2,
    handle: function (Admin, Target) {
      let dolls = Admin.role.doll.get();
      let source = dolls.map((_, i) => i).filter(i => dolls[i].key == "zibao");
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: 8 * Math.pow(1.5, source.length)
      });
      Admin.role.doll.clearAll(source);
    }
  },
  al021: {
    name: '海中的人偶',
    detail: '丢弃所有人偶手牌\n复制等量自爆人偶\n临时加入手牌',
    cost: 0,
    explain: ["al034"],
    handle: function (Admin, Target) {
      let holds = Admin.handcard.getHolds();
      let target = holds.map((_, i) => i).filter(i => holds[i].explain && holds[i].explain.includes("doll"));
      Admin.handcard.abandon.fromHolds(target);
      Admin.handcard.insert.amount(target.length).interim(true).toHolds("al034");
    }
  },
  al022: {
    name: '萌萌大千枪',
    detail: '造成8伤害\n场上每有1泛用人偶\n伤害+8',
    cost: 1,
    handle: function (Admin, Target) {
      let amount = Admin.role.doll.get().filter(doll => doll.key == "fanyong").length;
      Admin.enermy.damage.target(Target).source("spellcard").by({
        type: "static",
        value: 8 + 8 * amount
      });
    },
    aim: true
  },
  al023: {
    name: '自杀协议',
    detail: '额外灵力+4\n获得疲倦*4',
    cost: 0,
    explain: ["tired"],
    handle: function (Admin, Target) {
      Admin.role.power.of(0).add(4);
      Admin.role.buff.of(0).add("tired", 4);
    }
  },
  al024: {
    name: '蓬莱人偶',
    detail: '人偶:耐久1/攻击4\n损坏时对伤害来源\n造成40间接穿透伤害',
    cost: 1,
    interim: true,
    explain: ["doll", "special_doll", "penetrate"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "蓬莱人偶",
        key: "penglai",
        health: 1,
        attack: 4,
        special: true,
        card: "al024"
      });
    }
  },
  al025: {
    name: '法兰西人偶',
    detail: '人偶:耐久20/攻击16',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "法兰西人偶",
        key: "falanxi",
        health: 20,
        attack: 16,
        special: true,
        card: "al025"
      });
    }
  },
  al026: {
    name: '俄罗斯人偶',
    detail: '人偶:耐久4/攻击2\n对目标造成间接伤害\n附带其当前生命3%\n额外伤害',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "俄罗斯人偶",
        key: "eluosi",
        health: 4,
        attack: 2,
        special: true,
        card: "al026"
      });
    }
  },
  al027: {
    name: '上海人偶',
    detail: '人偶:耐久4/攻击4\n造成伤害时20%概率\n目标每有1负面效果\n受到等层数额外伤害',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "上海人偶",
        key: "shanghai",
        health: 4,
        attack: 2,
        special: true,
        card: "al027"
      });
    }
  },
  al028: {
    name: '荷兰人偶',
    detail: '人偶:耐久4/攻击4\n流血效果触发后移除\n造成间接伤害时\n对目标附加流血*1',
    cost: 2,
    explain: ["doll", "special_doll", "bleed"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "荷兰人偶",
        key: "helan",
        health: 4,
        attack: 2,
        special: true,
        card: "al028"
      });
    }
  },
  al029: {
    name: '京都人偶',
    detail: '人偶:耐久16/攻击4\n每回合结束时\n额外灵力+2',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "京都人偶",
        key: "jingdu",
        health: 16,
        attack: 2,
        special: true,
        card: "al029"
      });
    }
  },
  al030: {
    name: '伦敦人偶',
    detail: '人偶:耐久24/攻击0\n攻击等同于耐久',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "伦敦人偶",
        key: "lundun",
        health: 24,
        attack: 0,
        special: true,
        card: "al030"
      });
    }
  },
  al031: {
    name: '奥尔良人偶',
    detail: '人偶:耐久16/攻击4\n每回合结束时\n回复10生命',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "奥尔良人偶",
        key: "aoerliang",
        health: 16,
        attack: 4,
        special: true,
        card: "al031"
      });
    }
  },
  al032: {
    name: '西藏人偶',
    detail: '人偶:耐久36/攻击4',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "西藏人偶",
        key: "xizang",
        health: 36,
        attack: 4,
        special: true,
        card: "al032"
      });
    }
  },
  al033: {
    name: '歌利亚人偶',
    detail: '人偶:耐久20/攻击6\n攻击目标为全体敌人',
    cost: 2,
    explain: ["doll", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "歌利亚人偶",
        key: "geliya",
        health: 20,
        attack: 6,
        special: true,
        card: "al033"
      });
    }
  },
  al034: {
    name: '自爆人偶',
    detail: '人偶:耐久12/攻击4\n回合结束时移除\n并造成5群体伤害\n此人偶无放置上限',
    cost: 1,
    explain: ["doll"],
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "自爆人偶",
        key: "zibao",
        health: 12,
        attack: 4,
        card: "al034"
      });
    }
  },
  al035: {
    name: '泛用人偶',
    detail: '人偶:耐久12/攻击4\n两回合后移除\n此人偶无放置上限',
    cost: 1,
    explain: ["doll"],
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "泛用人偶",
        key: "fanyong",
        health: 12,
        attack: 4,
        card: "al035",
        time: 2
      });
    }
  },
  al036: {
    name: '探索人偶',
    detail: '人偶:耐久4/攻击2\n回合初与回合末\n各对随机目标\n附加曝光*2',
    cost: 2,
    explain: ["doll", "special_doll", "exposure"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "探索人偶",
        key: "tansuo",
        health: 4,
        attack: 2,
        special: true,
        card: "al036"
      });
    }
  },
  al037: {
    name: '圆桌人偶',
    detail: '人偶:耐久8/攻击4\n回合初与回合末\n复制人偶千枪*1\n加入到手牌',
    cost: 3,
    explain: ["doll", "alice", "special_doll"],
    special: true,
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "圆桌人偶",
        key: "yuanzhuo",
        health: 8,
        attack: 4,
        special: true,
        card: "al037"
      });
    }
  },
  al038: {
    name: '半自主人偶',
    detail: '人偶:耐久8/攻击4\n回合初与回合末\n各放置泛用人偶*1',
    cost: 3,
    explain: ["doll", "special_doll", "al035"],
    handle: function (Admin, Target) {
      Admin.role.doll.add({
        name: "半自主人偶",
        key: "banzizhu",
        health: 8,
        attack: 4,
        special: true,
        card: "al038"
      });
    }
  }
}

for (let key in alice) {
  alice[key].role = "alice";
}

export default alice;