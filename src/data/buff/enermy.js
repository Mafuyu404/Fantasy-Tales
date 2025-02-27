export default {
  natral_protect: {
    name: "自然加护",
    detail: "受到伤害时将伤害变为5，并对伤害来源附加流血*2。生效时层数-1。回合初移除。",
    expend: true,
    positive: true
  },
  poison_body: {
    name: "毒气花园",
    detail: "受到伤害时对伤害来源附加神经之毒*1。",
    positive: true
  },
  spirit_poison: {
    name: "神经之毒",
    detail: "回合初受到等同于5%(每层+5%)当前生命值的额外伤害，获得恍惚*1(每层+1)。",
    interim: true
  },
  blue_poison: {
    name: "忧郁之毒",
    detail: "回合结束时受到1(每层+1)间接伤害。"
  },
  qianzhidun: {
    name: "乾之盾",
    detail: "阻挡1(每层+1)点伤害，低于层数一半的伤害减半。生效时层数-1。",
    positive: true
  },
  magic_life: {
    name: "魔法生命",
    detail: "这是你第1(每层+1)次击败矢田寺成美。",
    positive: true
  },
  water_joke: {
    name: "水的花招",
    detail: "受到的治疗转化为对自身造成等量伤害。"
  },
  miracle: {
    name: "奇迹之风",
    detail: "受到的所有伤害-1(每层-1)。",
    positive: true
  },
  eyelashes: {
    name: "眼花",
    detail: "目标本回合第×张牌无效。该效果仅起指示作用。"
  },
  round_timer: {
    name: "回合倒计时",
    detail: "层数每秒-1，层数归零后回合结束。该效果仅起指示作用。",
    interim: true,
    roundEnd: true
  },
  shiki0: {
    name: "阎魔审判-是",
    detail: "能力: 攻击时附加易伤*3\n打破条件: 累计回复60生命值\n层数仅代表剩余指标",
    positive: true
  },
  shiki1: {
    name: "阎魔审判-非",
    detail: "能力: 攻击时回复15%生命\n打破条件: 累计造成20次暴击\n层数仅代表剩余指标",
    positive: true
  },
  shiki2: {
    name: "阎魔审判-曲",
    detail: "能力: 攻击时额外造成多段伤害\n打破条件: 累计消耗30灵力\n层数仅代表剩余指标",
    positive: true
  },
  shiki3: {
    name: "阎魔审判-直",
    detail: "能力: 攻击时清空自身负面效果\n打破条件: 累计抽十张牌\n层数仅代表剩余指标",
    positive: true
  },
}