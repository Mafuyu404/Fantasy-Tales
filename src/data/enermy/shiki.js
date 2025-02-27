const shiki = {
  name: "四季映姬",
  intro: "是非曲直厅内裁决幻想乡死者的阎魔",
  detail: "每过一回合使目标手牌上限-1，且拥有多种强大的能力，达成特定的条件后可打破相应的能力，细节以效果形式标明。",
  type: "boss",
  growth: {
    health: 3.5,
    attack: 2,
    speed: 1.5
  },
  onload: function (Admin, index) {
    Admin.cache["shiki"] = [60, 20, 30, 10];
    Admin.cache["shiki"].forEach((a, i) => a > 0 && Admin.enermy.buff.of(index).set(`shiki${i}`, a));
  },
  action: function (Admin, index) {
    let state = Admin.enermy.state.of(index).get();
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 70
    });
    if (Admin.cache["shiki"][3] > 0) {
      Admin.enermy.buff.of(index).clearAll(false);
    }
    if (Admin.cache["shiki"][0] > 0) {
      Admin.role.buff.of(0).add("fragile", 3);
    }
    if (Admin.cache["shiki"][2] > 0) {
      Admin.role.damage.target(0).from(index).by({
        type: "scale",
        value: 25,
        amount: 5
      });
    }
    if (Admin.cache["shiki"][1] > 0) {
      Admin.enermy.heal.target(index).by({
        type: "static",
        value: state.health * 0.2
      });
    }
    Admin.cache["shiki"].forEach((a, i) => a > 0 && Admin.enermy.buff.of(index).set(`shiki${i}`, a));
  }
}

export default shiki;