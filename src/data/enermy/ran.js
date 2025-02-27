const ran = {
  name: "八云蓝",
  intro: "凭依在九尾妖狐上的式神",
  detail: "增加全体造成的伤害，为其它友方承担一半伤害，每回合为自己提供阻挡伤害的结界。",
  type: "boss",
  unsummonable: true,
  growth: {
    health: 3.5,
    attack: 2,
    speed: 1.3
  },
  onload: (Admin, index) => {
    Admin.cache["ran"] = true;
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.buff.of(index).add("barrier", Math.ceil(state.health * 0.4));
    setTimeout(_ => {
      Admin.enermy.buff.of(index).addAll("strength", 2);
      Admin.enermy.buff.of(1).set("cautious", 4);
    })
  },
  action: (Admin, index) => {
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.buff.of(index).add("barrier", Math.ceil(state.health * 0.4));
    Admin.enermy.buff.of(index).addAll("strength", 2);
  }
}

export default ran;