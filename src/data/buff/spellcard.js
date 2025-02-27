const marisa = {
  hypodynamic: {
    name: "乏力",
    detail: "回合初失去所有灵力。",
    expend: true
  },
  orrerys_sun: {
    name: "太阳仪",
    detail: "直接攻击在次回合造成120%*1(每层+1)间接伤害。生效时层数-1。",
    positive: true
  },
  marisa_time: {
    name: "魔理沙时间",
    detail: "暴击率+40%。",
    positive: true,
    interim: true
  },
  grand_cross: {
    name: "大十字",
    detail: "接下来的1(每层+1)次伤害，暴击伤害+100%。",
    positive: true,
    expend: true
  },
  test_slave: {
    name: "试验用使魔",
    detail: "所有伤害截走25%，在回合末合并结算为群体伤害。",
    positive: true
  },
  milky_way: {
    name: "银河",
    detail: "伤害+2(每层+2)。",
    positive: true
  }
}

const youmu = {
  Bright_Bitter_Wheel: {
    name: "流转",
    detail: "普通攻击造成伤害时，获得临时力量*1。回合初清除。",
    positive: true,
    interim: true
  },
  rebound: {
    name: "反射下界斩",
    detail: "下一次受到伤害时\n闪避该伤害\n并造成2*7群体伤害。生效时层数-1。",
    positive: true,
    expend: true
  },
  yanfan: {
    name: "燕返",
    detail: "下一次普通攻击伤害+80%(每层+80%)。",
    positive: true
  },
  meditation_slash: {
    name: "迷途之月",
    detail: "若对目标造成的伤害，少于目标生命值5%，对目标附加恍惚*1",
    positive: true
  },
  telepathism: {
    name: "通灵",
    detail: "受到所有伤害时，10%(每层+10%)概率化解，并对伤害来源进行必定暴击的普通攻击，层数-3。回合初清除。",
    positive: true,
    interim: true
  },
  six_roots_clean: {
    name: "六道怪奇",
    detail: "普攻伤害变为4*3。回合初清除。",
    positive: true,
    interim: true
  },
  crime_fire: {
    name: "业火",
    detail: "受到伤害时，60%概率获得燃烧*1。回合初清除。",
    interim: true
  },
  tiannvfan: {
    name: "天女返",
    detail: "每有1速度。暴击伤害+20%。",
    positive: true
  },
  yinianwuliangjie: {
    name: "一念无量劫",
    detail: "暴击伤害+100%(每层+100%)。回合初清除。",
    positive: true,
    interim: true
  },
  sanhunqipo: {
    name: "三魂七魄",
    detail: "造成的伤害暴击时，额外灵力+1。回合初清除。",
    positive: true,
    interim: true
  },
  dawuxianhui: {
    name: "大悟显晦",
    detail: "普通攻击伤害变为10。",
    positive: true
  },
  xianshizhiwang: {
    name: "现世妄执",
    detail: "普攻消耗灵力+1，伤害+100%。回合初清除。",
    positive: true,
    interim: true
  },
  xuezhenchimei: {
    name: "血振魑魅",
    detail: "受到伤害时，触发一次通灵效果。",
    positive: true
  }
}

const reisen = {
  illusory: {
    name: "虚幻",
    detail: "命中率*95%(每层*95%)。"
  },
  lunatic: {
    name: "狂气",
    detail: "受到的伤害+5%(每层+5%)。"
  },
  insanity: {
    name: "疯狂",
    detail: "受到1(每层+1)穿透伤害。"
  },
}

const reimu = {
  pure_happy: {
    name: "清欢",
    detail: "回合开始时对所有敌方目标造成1(每层+1)穿透伤害。自身每受到1伤害层数-2。",
    positive: true
  },
  font_safe: {
    name: "前方安全",
    detail: "造成伤害时，回复5生命值，获得恍惚*2，获得2清欢。回合初清除。",
    interim: true,
    positive: true
  },
  hakurei_phantom: {
    name: "博丽幻影",
    detail: "40%概率闪避伤害，闪避时获得清欢*4。回合初清除。",
    interim: true,
    positive: true
  },
  trance_cage: {
    name: "妖怪拘禁符",
    detail: "下次行动变为附加恍惚*3。生效时层数-1。",
    expend: true
  },
  waiting_pearl: {
    name: "明珠暗投",
    detail: "回合初获得清欢*12，抽两张牌。生效时层数-1。",
    expend: true,
    positive: true
  },
  yinyang_bird: {
    name: "阴阳飞鸟井",
    detail: "打出符卡时40%概率获得2额外灵力。回合初清除。",
    positive: true,
    interim: true
  },
  eight_dragon_kill: {
    name: "八方龙杀阵",
    detail: "受到伤害-30%，速度-1。",
    positive: true
  },
  big_bad_sun: {
    name: "大祸津日",
    detail: "造成伤害-90%，治疗效果+100%。回合初清除。",
    positive: true,
    interim: true
  }
}

const spellcard = {
  fool_range: {
    name: "愚者的靶场",
    detail: "抽牌数+1(每层+1)，手牌上限-1(每层-1)。回合初移除。"
  },
  magic_fabric: {
    name: "魔法布料",
    detail: "下一次打出人偶牌时，将其临时复制到手牌。",
    positive: true,
    expend: true
  },
  weilaiwenle: {
    name: "未来文乐",
    detail: "下回合初抽牌至上限。",
    positive: true,
    interim: true
  }
}

Object.assign(spellcard, marisa);
Object.assign(spellcard, youmu);
Object.assign(spellcard, reisen);
Object.assign(spellcard, reimu);

export default spellcard;