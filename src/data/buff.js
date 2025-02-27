import collection from "./buff/collection";
import spellcard from "./buff/spellcard";
import basecard from "./buff/basecard";
import enermy from "./buff/enermy";
import equipment from "./buff/equipment";
import souvenir from "./buff/souvenir";

const buff = {
  "tired": {
    "name": "疲倦",
    "detail": "回合开始时回复灵力减少1(每层+1)。生效时层数-1。",
    "expend": true
  },
  "prophesy": {
    "name": "预言",
    "detail": "消除接下来受到的1(每层+1)次攻击。生效时层数-1。每回合初清空。",
    "positive": true,
    "interim": true
  },
  "foresee": {
    "name": "预知",
    "detail": "消除接下来受到的1(每层+1)次攻击。生效时层数-1。",
    "positive": true
  },
  "interim_barrier": {
    "name": "临时防御结界",
    "detail": "阻挡1(每层+1)点伤害。生效时层数-1。每回合初清空。",
    "positive": true,
    "interim": true
  },
  "barrier": {
    "name": "防御结界",
    "detail": "阻挡1(每层+1)点伤害。生效时层数-1。",
    "positive": true
  },
  "burning": {
    "name": "燃烧",
    "detail": "每回合扣除2%(每层+2%)最大生命值。生效时层数-5。",
    "expend": 5
  },
  "bleed": {
    "name": "流血",
    "detail": "回合开始时受到1(每层+1)额外伤害。受治疗时移除。"
  },
  "tardy": {
    "name": "迟缓",
    "detail": "速度*95%(每层*95%)。回合初层数减半。",
  },
  "fragile": {
    "name": "易伤",
    "detail": "受到伤害+10%(每层+10%)。回合初层数-2。",
    "decrease": true,
  },
  "strength": {
    "name": "力量",
    "detail": "造成的伤害+10%(每层+10%)。",
    "positive": true
  },
  "insulation": {
    "name": "绝缘",
    "detail": "无法获得任何灵力。",
    "interim": true,
    roundend: true
  },
  throttle: {
    name: "节流",
    detail: "灵力消耗-1(每层-1)。",
    positive: true,
    interim: true
  },
  iron_skin: {
    name: "安全的空间",
    detail: "受到的伤害-10%(每层-10%)。回合初清除。",
    positive: true,
    interim: true
  },
  weak: {
    name: "虚弱",
    detail: "造成的伤害-10%(每层-10%)。回合末清除。",
    interim: true,
    roundend: true
  },
  interim_strength: {
    name: "临时力量",
    detail: "造成的伤害+10%(每层+10%)。回合初清除。",
    positive: true,
    interim: true
  },
  accelerate: {
    name: "加速",
    detail: "速度+0.1(每层+0.1)。",
    positive: true
  },
  trance: {
    name: "恍惚",
    detail: "命中率-10%(每层-10%)。",
    interim: true,
    roundend: true
  },
  strong_luck: {
    name: "强运",
    detail: "概率判定均为正面。回合初清除。",
    interim: true,
    positive: true
  },
  charging: {
    name: "充能",
    detail: "回合初获得1(每层+1)额外灵力。回合初移除。",
    interim: true,
    positive: true
  },
  focus: {
    name: "专注",
    detail: "符卡造成的伤害+10%(每层+10%)。回合初移除。",
    positive: true,
    interim: true
  },
  instinct: {
    name: "本能",
    detail: "普通攻击造成的伤害+10%(每层+10%)。回合初移除。",
    positive: true,
    interim: true
  },
  exposure: {
    name: "曝光",
    detail: "受到伤害均为穿透伤害，持续1(每层+1)回合。",
    decrease: true,
    // roundend: true
  },
  cautious: {
    name: "谨慎",
    detail: "10%(每层+10%)概率闪避伤害。",
    positive: true
  },
  momentum: {
    name: "气势",
    detail: "造成的所有伤害+1(每层+1)。持续一回合。",
    interim: true,
    positive: true
  }
}

Object.assign(buff, collection);
Object.assign(buff, spellcard);
Object.assign(buff, basecard);
Object.assign(buff, enermy);
Object.assign(buff, equipment);
Object.assign(buff, souvenir);

for (let b in buff) {
  if (buff[b].positive) buff[b].color = "blue";
  else buff[b].color = "purple";
}

export default buff;