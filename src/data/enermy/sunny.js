const sunny = {
  name: "日光的妖精",
  intro: "具有操纵光的折射程度的能力",
  detail: "攻击造成多段伤害，还会回血。",
  type: "zagu",
  scene: ["forest", "town"],
  growth: {
    health: 1.2,
    attack: 1,
    speed: 1
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 80,
    });
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 60,
    });
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 40,
    });
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 20,
    });
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.heal.targetAll().by({
      type: "static",
      value: (state.health - state.Health) / 4
    });
  }
}

export default sunny;