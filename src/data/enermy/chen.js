const chen = {
  name: "橙",
  intro: "生活在迷途之家的猫妖",
  detail: "灵活的猫妖，速度大于目标时会先手行动，且造成的伤害为穿透伤害。",
  type: "elite",
  scene: ["shrine", "town"],
  growth: {
    health: 1.5,
    attack: 2,
    speed: 1.8
  },
  action: (Admin, index) => {
    for (let _ of [...Array(4).keys()]) Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 36,
      penetrate: true
    });
    Admin.role.buff.of(0).add("bleed", 1);
  },
  onload: (Admin, index) => {
    if (Admin.role.state.of(0).get().speed < Admin.enermy.state.of(index).get().speed)
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 80
      });
  }
}

export default chen;