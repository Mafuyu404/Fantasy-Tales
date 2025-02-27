const lunar = {
  name: "月光的妖精",
  intro: "拥有消除周围声音程度的能力",
  detail: "攻击时丢弃目标一张牌，还会回血。",
  type: "zagu",
  scene: ["forest", "town"],
  growth: {
    health: 1,
    attack: 1,
    speed: 1
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 150
    });
    Admin.handcard.abandon.amount(1).fromHolds();
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.heal.targetAll().by({
      type: "static",
      value: (state.health - state.Health) / 4
    });
  }
}

export default lunar;