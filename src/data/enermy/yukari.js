const yukari = {
  name: "八云紫",
  intro: "参与创立幻想乡的妖怪贤者之一",
  detail: "幻想乡最古老的妖怪，行动难以预测。\n先手行动。\n一阶段可能攻击较弱。\n二阶段造成的大概是穿透伤害。\n三阶段自身不攻击但会使用特殊效果，并召唤先手攻击的橙。",
  type: "boss",
  unsummonable: true,
  growth: {
    health: 3,
    attack: 2,
    speed: 1.7
  },
  onload: function (Admin, index) {
    Admin.cache["yukari"] = 1;
    Admin.enermy.buff.of(index).set("cautious", 4);
    if (Admin.role.state.of(0).get().Health > 6)
      Admin.role.state.of(0).add("Health", -6);
  },
  action: function (Admin, index) {
    let state = Admin.enermy.state.of(index).get();
    if (Admin.role.state.of(0).get().Health > 6)
      Admin.role.state.of(0).add("Health", -6);
    Admin.enermy.buff.of(index).set("cautious", 4);
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 50
    });
    if (Admin.cache["yukari"] == 2) {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 70,
        penetrate: true
      });
    }
    if (Admin.cache["yukari"] == 3) {
      Admin.enermy.buff.addAll("cautious", 2);
      Admin.handcard.abandon.amount(1).fromHolds();
    }
  }
}

export default yukari;