const yukari0 = {
  name: "八云紫",
  intro: "参与创立幻想乡的妖怪贤者之一",
  detail: "擅长睡觉的妖怪贤者，行动很快，且攻击会使人变得慵懒。",
  type: "special",
  unsummonable: true,
  growth: {
    health: 2,
    attack: 2,
    speed: 1.7
  },
  onload: function (Admin, index) {
    Admin.enermy.buff.of(index).set("cautious", 3);
    Admin.enermy.buff.of(index).set("barrier", 20);
  },
  action: function (Admin, index) {
    Admin.enermy.buff.of(index).set("cautious", 3);
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100
    });
    if (Admin.role.event.round.count % 2 == 1)
      Admin.role.buff.of(0).add("tired", 2);
  }
}

export default yukari0;