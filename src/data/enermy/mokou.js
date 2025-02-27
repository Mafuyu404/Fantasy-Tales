const mokou = {
  name: "藤原妹红",
  intro: "不死的火鸟",
  detail: "每回合回复已损失生命的一半并造成等量伤害。",
  type: "boss",
  growth: {
    health: 4,
    attack: 2,
    speed: 1.5
  },
  action: function (Admin, index) {
    let state = Admin.enermy.state.of(index).get();
    let hurt = state.health - state.Health;
    Admin.role.damage.target(0).from(index).by({
      type: "static",
      value: hurt / 2
    });
    Admin.enermy.heal.target(index).by({
      type: "static",
      value: hurt / 2
    });
  }
}

export default mokou;