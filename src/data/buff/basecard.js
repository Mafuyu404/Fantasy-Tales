const base = {
  rhythm: {
    name: "节奏感",
    detail: "打出通式时回复3(每层+3)生命值。",
    positive: true
  },
  magic_bean: {
    name: "魔豆",
    detail: "回合初获得2额外灵力，持续1(每层+1)回合。",
    positive: true,
    expend: true
  },
  blood_blade: {
    name: "血刃",
    detail: "造成伤害时，伤害+8，生命值-4。回合初移除。",
    interim: true
  },
  wrath: {
    name: "暴怒",
    detail: "普通攻击伤害+30%(每层+30%)。回合初移除。",
    interim: true
  },
  lust: {
    name: "色欲",
    detail: "下次行动变为造成15%最大生命值的伤害。",
    expend: true
  },
  humility: {
    name: "谦逊",
    detail: "通式灵力消耗-1(每层-1)。回合初移除。",
    interim: true,
    positive: true
  },
  diligence: {
    name: "勤奋",
    detail: "手牌灵力消耗+2，效果翻倍。回合初移除。",
    positive: true,
    interim: true
  },
  shadow_joke: {
    name: "影袭",
    detail: "造成间接伤害时，生命-1，手牌加入影子戏法*1。回合初移除。",
    positive: true,
    interim: true
  },
  moon_sleep: {
    name: "红月安魂曲",
    detail: "造成的伤害暴击时，转化为穿透伤害。回合初移除。",
    positive: true,
    interim: true
  }
}

export default base