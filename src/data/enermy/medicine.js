const medicine = {
  name: "梅蒂欣",
  intro: "扔到铃兰田的人偶化作的妖怪",
  detail: "铃兰花毒素的化身。\n生命值低于40%时吸收目标身上一半的[忧郁之毒]，回复等量生命。",
  type: "boss",
  growth: {
    health: 3.5,
    attack: 2,
    speed: 1.2
  },
  onload: function (Admin, index) {
    Admin.enermy.buff.of(index).set("poison_body", 1);
  },
  action: function (Admin, index) {
    let state = Admin.enermy.state.of(index).get();
    if (state.Health / state.health < 0.5) {
      let amount = Admin.role.buff.of(0).get("blue_poison");
      Admin.enermy.heal.target(index).by({
        type: "static",
        value: retain(amount / 2, 0)
      });
      Admin.role.buff.of(0).clear("blue_poison", retain(amount / 2, 0));
    }
    Admin.role.buff.of(0).add("blue_poison", retain(state.Health * 0.12, 0));
  }
}

export default medicine;