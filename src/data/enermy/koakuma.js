const koakuma = {
  name: "小恶魔",
  intro: "不知为何出现在外界的神秘的恶魔",
  detail: "在自己的回合以外受到的伤害-90%，并造成等量反伤，攻击能力强，第四回合生命值变为1。",
  type: "elite",
  scene: ["town"],
  growth: {
    health: 1.2,
    attack: 2,
    speed: 1.3
  },
  onload: (Admin, index) => {
    Admin.enermy.buff.of(index).set("iron_skin", 9);
    if (!Admin.cache["koakuma"]) Admin.cache["koakuma"] = [];
    Admin.cache["koakuma"][index] = 1;
  }, 
  action: (Admin, index) => {
    Admin.enermy.buff.of(index).add("strength", 2);
    Admin.role.buff.of(0).add("bleed", 4);
    Admin.role.buff.of(0).add("burning", 4);
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 150,
    });
    if (Admin.role.event.round.count == 3) {
      Admin.enermy.state.of(index).set("Health", 0.1);
    }
    Admin.enermy.buff.of(index).set("iron_skin", 9);
  }
}

export default koakuma;