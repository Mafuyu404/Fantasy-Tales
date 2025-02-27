const nitori = {
  name: "河童",
  intro: "拥有操纵水程度的能力",
  detail: "会妨碍目标的治疗，攻击时回复自身少量生命，第三回合初逃跑。",
  type: "zagu",
  scene: ["town"],
  growth: {
    health: 1.2,
    attack: 1.2,
    speed: 1
  },
  onload: (Admin, index) => {
    Admin.role.buff.of(0).set("water_joke", 2);
    Admin.enermy.buff.of(index).set("iron_skin", 4);
  },
  action: (Admin, index) => {
    Admin.enermy.buff.of(index).set("iron_skin", 4);
    Admin.role.buff.of(0).set("water_joke", 2);
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 60,
      amount: 2
    });
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.heal.target(index).by({
      type: "static",
      value: state.health * 0.1
    });
    if (Admin.role.event.round.count == 3) Admin.battle.runOutAway(index);
  }
}

export default nitori;