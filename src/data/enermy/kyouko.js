const kyouko = {
  name: "幽谷响子",
  intro: "在山谷中正直地响应声音的妖怪",
  detail: "没有行动。\n一方受到治疗时，另一方受到一半治疗。\n一方受到伤害时，另一方受到一半伤害。\n第四回合初逃跑。",
  type: "elite",
  scene: ["shrine", "town"],
  growth: {
    health: 1.7,
    attack: 2,
    speed: 1.5
  },
  onload: (Admin, index) => {
    if (!Admin.cache["kyouko"]) Admin.cache["kyouko"] = [];
    Admin.cache["kyouko"].push(index);
  },
  action: (Admin, index) => {
    if (Admin.role.event.round.count == 4) Admin.battle.runOutAway(index);
  }
}

export default kyouko;