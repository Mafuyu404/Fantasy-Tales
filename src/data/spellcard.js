import marisa from "./spellcard/marisa";
import reimu from "./spellcard/reimu";
import youmu from "./spellcard/youmu";
import alice from "./spellcard/alice";

const spellcard = {
  pachi: {
    name: "魔力光束",
    detail: "造成7伤害\n必定命中",
    role: "pachi",
    cost: 1
  },
  royal_lare: {
    name: "皇家圣焰",
    detail: "精灵魔法:12/20/30群体伤害\n附加燃烧*1/2/3",
    role: "pachi",
    cost: 3
  },
  philosophers_stone: {
    name: "贤者之石",
    detail: "精灵魔法缩短一回合\n抽取一张符卡",
    role: "pachi",
    cost: 3
  },
  silent_selene: {
    name: "沉静的月神",
    detail: "清除全体敌人正面效果，下一回合无法行动，不受到任何伤害",
    role: "pachi",
    cost: 3
  },
  silver_dragon: {
    name: "银龙",
    detail: "12伤害\n精灵魔法:14/24/34伤害",
    role: "pachi",
    cost: 3
  },
  bury_in_lake: {
    name: "湖葬",
    detail: "每回合造成6间接伤害，回复等量生命，持续3回合",
    role: "pachi",
    cost: 3
  },
  jellyfish_princess: {
    name: "水母公主",
    detail: "每回合回复10%最大生命值并获得1额外灵力，持续3回合",
    role: "pachi",
    cost: 3
  },
  "sylphy_horn": {
    name: "风灵的角笛",
    detail: "精灵魔法:回复12/20/30生命值",
    role: "pachi",
    cost: 3
  },
  "emerald_megalopolis": {
    name: "翡翠巨城",
    detail: "下一回合伤害提高\n20%，每造成一次伤害额外提高20%",
    role: "pachi",
    cost: 3
  },
  // "alice": {
  //   name: "人偶千枪",
  //   detail: "造成9伤害\n对于负面效果下的目标必定暴击",
  //   role: "alice",
  //   cost: 1
  // },
  // "artful_sacrifice": {
  //   name: "狡猾的献祭",
  //   detail: "清除随机人偶\n造成36伤害",
  //   role: "alice",
  //   cost: 3
  // },
  // "return_inanimateness": {
  //   name: "回归虚无",
  //   detail: "清除所有人偶\n每清除1人偶\n造成6群体伤害",
  //   role: "alice",
  //   cost: 3
  // },
  // "little_legion": {
  //   name: "小小军势",
  //   detail: "人偶造成两倍伤害\n持续一回合",
  //   role: "alice",
  //   cost: 3
  // },
  // "shanghai_doll": {
  //   name: "上海人偶",
  //   detail: "人偶:攻击15\n耐久25\n",
  //   role: "alice",
  //   cost: 3
  // },
  // "penglai_doll": {
  //   name: "蓬莱人偶",
  //   detail: "人偶:耐久1\n损坏时造成45伤害",
  //   role: "alice",
  //   cost: 3
  // },
  // "kyoto_doll": {
  //   name: "京都人偶",
  //   detail: "人偶:攻击4,耐久12\n每回合获得\n2额外灵力",
  //   role: "alice",
  //   cost: 3
  // },
  // "xizang_doll": {
  //   name: "西藏人偶",
  //   detail: "人偶:攻击4,耐久36",
  //   role: "alice",
  //   cost: 3
  // },
  // "london_doll": {
  //   name: "伦敦人偶",
  //   detail: "人偶:耐久20\n攻击等同于耐久",
  //   role: "alice",
  //   cost: 3
  // },
  // "russia_doll": {
  //   name: "俄罗斯人偶",
  //   detail: "人偶:攻击4,耐久12\n造成群体伤害",
  //   role: "alice",
  //   cost: 3
  // },
  // "holland_doll": {
  //   name: "荷兰人偶",
  //   detail: "人偶:攻击4,耐久12\n在场时所有攻击\n附加流血*1",
  //   role: "alice",
  //   cost: 3
  // },
  // "orleans_doll": {
  //   name: "奥尔良人偶",
  //   detail: "人偶:攻击4,耐久12\n每回合开始时和结束时回复7生命值",
  //   role: "alice",
  //   cost: 3
  // },
  "kokoro": {
    name: "心之舞",
    detail: "造成9伤害\n回复3生命",
    role: "kokoro",
    cost: 1
  },
  "kokoro_roulette": {
    name: "心的轮盘",
    detail: "佩戴随机其它面具",
    role: "kokoro",
    cost: 3
  },
  "masked_heart_dance": {
    name: "假面丧心舞",
    detail: "佩戴所有面具\n灵力消耗+1\n直到下次佩戴面具",
    role: "kokoro",
    cost: 3
  },
  "taboo_wolf_face": {
    name: "忌狼之面",
    detail: "佩戴两次当前佩戴的面具",
    role: "kokoro",
    cost: 3
  },
  "demon_fox_face": {
    name: "妖狐面",
    detail: "面具:额外灵力大于1;灵力消耗-1(+1)",
    role: "kokoro",
    cost: 3
  },
  "big_spider_face": {
    name: "大蜘蛛面",
    detail: "面具:回合内进行超过3次攻击;造成的伤害+30%(+30%)",
    role: "kokoro",
    cost: 3
  },
  "ghost_face": {
    name: "鬼婆面",
    detail: "面具:生命值在40%以下;回复效果+30%(+30%)",
    role: "kokoro",
    cost: 3
  },
  "long_wall_face": {
    name: "长壁面",
    detail: "面具:单次受伤15以上;回复造成伤害30%(+30%)的生命",
    role: "kokoro",
    cost: 3
  },
  "Hot_man_face": {
    name: "火男面",
    detail: "面具:新增正面效果;治疗时造成100%(+100%)额外群伤",
    role: "kokoro",
    cost: 3
  },
  "lion_face": {
    name: "狮子面",
    detail: "面具:手牌数超过5;抽牌数+1(+1)",
    role: "kokoro",
    cost: 3
  },
  "worryingly": {
    name: "杞人忧地",
    detail: "清除随机面具\n造成15群体伤害",
    role: "kokoro",
    cost: 3
  },
  "reisen": {
    name: "Lunatic Gun",
    detail: "造成8伤害\n附加疯狂*4",
    role: "reisen",
    cost: 1
  },
  "lunatic_red_eyes": {
    name: "幻胧月睨",
    detail: "所有疯狂翻倍",
    role: "reisen",
    cost: 3
  },
  "invisible_full_moon": {
    name: "真实之月",
    detail: "造成12穿透伤害\n附加疯狂*16",
    role: "reisen",
    cost: 3
  },
  "visionary_tuning": {
    name: "幻视调律",
    detail: "造成12伤害\n附加虚幻*12",
    role: "reisen",
    cost: 3
  },
  "illusion_seeker": {
    name: "狂视调律",
    detail: "造成12伤害\n附加狂气*12",
    role: "reisen",
    cost: 3
  },
  "mind_stopper": {
    name: "生神停止",
    detail: "回复10生命值\n获得虚幻*2",
    role: "reisen",
    cost: 3
  },
  "rocket_in_mist": {
    name: "胧月花栞",
    detail: "造成8群体伤害\n获得狂气*2",
    role: "reisen",
    cost: 3
  },
  "luna_wave": {
    name: "月面波纹",
    detail: "所有目标一半的狂气或虚幻施加给随机目标",
    role: "reisen",
    cost: 3
  },
  "luna_megalopolis": {
    name: "荣华之梦",
    detail: "清除所有狂气和虚幻\n清除自身疯狂",
    role: "reisen",
    cost: 3
  },
  "infrared_moon": {
    name: "赤月下",
    detail: "造成伤害时\n附加狂气*伤害50%\n持续一回合",
    role: "reisen",
    cost: 3
  },
  "invisible_half_moon": {
    name: "幻之月",
    detail: "造成伤害时\n附加虚幻*伤害50%\n持续一回合",
    role: "reisen",
    cost: 3
  }
}

spellcard.renko = {
  name: "愚者的飞镖",
  detail: "造成4间接伤害\n造成4穿透伤害",
  role: "renko",
  cost: 1,
  aim: true,
  explain: ["penetrate"],
  type: "normal_attack",
  handle: function (Admin, Target) {
    Admin.enermy.damage.target(Target).source("normal_attack").by({
      type: "static",
      value: 4,
      indirect: true
    });
    Admin.enermy.damage.target(Target).source("normal_attack").by({
      type: "static",
      value: 4,
      penetrate: true
    });
  }
}
spellcard.renko_spellcard = {
  name: "愚者的靶场",
  detail: "抽牌数+1\n手牌上限-1\n持续一回合",
  cost: 3,
  role: "renko",
  handle: function (Admin, Target) {
    Admin.role.buff.of(0).add("fool_range", 1);
  }
}

Object.assign(spellcard, marisa);
Object.assign(spellcard, reimu);
Object.assign(spellcard, youmu);
Object.assign(spellcard, alice);

for (let c in spellcard) if (spellcard[c].type != "normal_attack") spellcard[c].type = "spellcard";

export default spellcard;