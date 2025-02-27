const piece = {
  name: "地狱的妖精",
  intro: "拥有使人发狂程度的能力",
  detail: "攻击附加[燃烧]，低生命时为全体附加[力量]。",
  type: "zagu",
  scene: ["shrine", "town"],
  growth: {
    health: 1,
    attack: 1.2,
    speed: 1
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100,
    });
    let state = Admin.enermy.state.of(index).get();
    if (state.Health / state.health < 0.5) Admin.enermy.buff.addAll("strength", 5);
    Admin.role.buff.of(0).add("burning", 4);
  }
}

export default piece;