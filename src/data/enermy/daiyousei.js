const daiyousei = {
  name: "大妖精",
  intro: "路过的较强妖精",
  detail: "回合初获得[自然加护]。",
  type: "elite",
  scene: ["shrine", "town"],
  growth: {
    health: 1.5,
    attack: 2,
    speed: 1.3
  },
  onload: (Admin, index) => {
    Admin.enermy.buff.of(index).set("natral_protect", 5);
  },
  action: (Admin, index) => {
    let amount = Admin.enermy.buff.of(index).get("natral_protect");
    if (!amount) Admin.enermy.buff.of(index).set("natral_protect", 5);
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 80,
    });
    Admin.role.buff.of(0).add("bleed", amount * 2);
  }
}

export default daiyousei;