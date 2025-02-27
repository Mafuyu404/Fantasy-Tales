const equipment = {
  gongonier: {
    name: "血之矢",
    detail: "被动。造成的伤害暴击时，回复伤害10%的生命值。",
    passive: true,
    unlock: "ac028"
  },
  sword_of_feixiang: {
    name: "绯想之剑",
    detail: "被动。对处于负面效果下的敌人造成的伤害+40%。",
    passive: true,
    unlock: "ac029"
  },
  sunshade: {
    name: "阳伞",
    detail: "主动。将30%生命值转化为200%防御结界。",
    handle: (Admin, Target) => {
      let Health = Admin.role.state.of(0).get().Health;
      Admin.role.state.of(0).set("Health", Health * 0.7);
      Admin.role.buff.of(0).add("barrier", Math.ceil(Health * 0.3 * 2));
    },
    unlock: "default"
  },
  mirror_of_pear: {
    name: "净颇梨之镜",
    detail: "被动。普通攻击不消耗灵力，造成的伤害提高30%。",
    passive: true,
    unlock: "default"
  },
  mini_bagua_stove: {
    name: "迷你八卦炉",
    detail: "主动。造成30群体伤害。",
    handle: (Admin, Target) => {
      Admin.enermy.damage.targetAll().source("equipment").by({
        type: "static",
        value: 30
      });
    },
    unlock: "ac022"
  },
  louguanjian: {
    name: "楼观剑",
    detail: "主动。造成70间接伤害。",
    aim: true,
    handle: (Admin, Target) => {
      Admin.enermy.damage.target(Target).source("equipment").by({
        type: "static",
        value: 70,
        indirect: true
      });
    },
    unlock: "default"
  },
  hd_camera: {
    name: "高清相机",
    detail: "主动。指定目标两回合受到的伤害均为穿透伤害。",
    aim: true,
    handle: (Admin, Target) => {
      Admin.enermy.buff.of(Target).add("exposure", 2);
    },
    unlock: "ac030"
  },
  repentance_rod: {
    name: "悔悟之棒",
    detail: "被动。抽空牌库时，获得5额外灵力。",
    passive: true,
    unlock: "ac031"
  },
  circular_fan: {
    name: "团扇",
    detail: "被动。每打出1张符卡获得1张灵力消耗0的临时普通攻击。",
    passive: true,
    unlock: "default"
  },
  devil_tied_scroll: {
    name: "魔人经卷",
    detail: "主动。驱散目标身上的正面效果。",
    aim: true,
    handle: (Admin, Target) => {
      Admin.enermy.buff.of(Target).clearAll(true);
    },
    unlock: "default"
  },
  spinning_top: {
    name: "图腾",
    detail: "主动。将弃牌区的牌洗回牌堆。",
    handle: (Admin, Target) => {
      Admin.handcard.leftReset();
    },
    unlock: "ac000"
  },
  laevatain: {
    name: "莱瓦汀",
    detail: "主动。暴击率+100%，暴击伤害+50%，持续一回合。",
    handle: (Admin, Target) => {
      Admin.role.buff.of(0).set("laevatain", 1);
    },
    unlock: "default"
  },
  price_tag: {
    name: "月虹标价牌",
    detail: "主动。消耗10硬币，造成3*2伤害，增加一次装备可使用次数。",
    aim: true,
    handle: (Admin, Target) => {
      Admin.battle.equipment.left.add(1);
      if (Admin.data.coin > 0) {
        Admin.data.coin -= 10;
        Admin.enermy.damage.target(Target).source("equipment").by({
          type: "static",
          value: 2,
          amount: 4
        });
      }
      else window.msg({ content: "硬币不足" });
    },
    unlock: "ac032"
  },
  eagle_90: {
    name: "渡鸦RAVEN-90",
    detail: "主动。所有伤害附带50%的额外伤害，持续一回合。",
    handle: (Admin, Target) => {
      Admin.role.buff.of(0).set("eagle_90", 1);
    },
    unlock: "default"
  },
  messenger: {
    name: "信使",
    detail: "被动。可额外携带一种纪念品，替换时优先替换第二种。",
    passive: true,
    unlock: "ac033"
  }
}

for (let e in equipment) {
  equipment[e].type = "gold";
}

export default equipment;