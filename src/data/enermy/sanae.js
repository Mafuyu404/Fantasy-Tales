const sanae = {
  name: "东风谷早苗",
  intro: "守矢神社的巫女、风祝与现人神",
  detail: "不断叠加[奇迹之风]，根据层数进行攻击。\n低生命时消耗层数回复生命。\n低层数时消耗生命获取层数。",
  type: "boss",
  growth: {
    health: 3.5,
    attack: 2,
    speed: 1.5
  },
  onload: function (Admin, index) {
    Admin.enermy.buff.of(index).set("miracle", 4);
  },
  action: function (Admin, index) {
    let amount = Admin.enermy.buff.of(index).get("miracle");
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.buff.of(index).add("miracle", 2);
    if (amount < 4) {
      Admin.enermy.state.of(index).set("Health", state.Health * 0.7)
      Admin.enermy.buff.of(index).add("miracle", 4);
    }
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 16 + amount,
      amount: amount
    });
    if (state.Health / state.health < 0.4) {
      Admin.enermy.heal.target(index).by({
        type: "static",
        value: state.health * 0.3
      });
      Admin.enermy.buff.of(index).clear("miracle", 4);
    }
  }
}

export default sanae;