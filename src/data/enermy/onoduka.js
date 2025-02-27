const onoduka = {
  name: "小野冢小町",
  intro: "担任三途河的摆渡人一职的死神",
  detail: "根据损失的生命值有不同的行动。\n0%-20%，攻击并附加易伤。\n20%-40%，多段攻击。\n40%-60%，高额单次伤害。\n60%-80%，攻击并回复等量生命，附加迟缓。\n80%以上，高额多段穿透伤害。",
  type: "elite",
  scene: ["forest", "town"],
  growth: {
    health: 1.7,
    attack: 2,
    speed: 1.3
  },
  action: (Admin, index) => {
    let state = Admin.enermy.state.of(index).get();
    let hurt = 1 - state.Health / state.health;
    if (hurt < 0.2) {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 70
      });
      Admin.role.buff.of(0).add("fragile", 3);
    }
    else if (hurt < 0.4) {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 30,
        amount: 4
      });
    }
    else if (hurt < 0.6) {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 150
      });
    }
    else if (hurt < 0.8) {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 100
      });
      Admin.enermy.heal.target(index).by({
        type: "static",
        value: state.health / 8
      });
      Admin.role.buff.of(0).add("tardy", 3);
    }
    else {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 50,
        amount: 3,
        penetrate: true
      });
    }
  }
}

export default onoduka;