const kanako = {
  name: "八坂神奈子",
  intro: "守矢神社祭祀的神之一，是蛇神和战神",
  detail: "每回合获得能阻挡伤害的[乾之盾]，奇数回合丢弃目标两张牌，偶数回合进行攻击。",
  type: "boss",
  growth: {
    health: 3.5,
    attack: 2,
    speed: 1
  },
  onload: function (Admin, index) {
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.buff.of(index).add("qianzhidun", retain(state.health / 9, 0));
  },
  action: function (Admin, index) {
    let state = Admin.enermy.state.of(index).get();
    Admin.enermy.buff.of(index).add("qianzhidun", retain(state.health / 9, 0));
    if (Admin.role.event.round.count % 2 == 0) Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 200
    });
    else Admin.handcard.abandon.amount(2).fromHolds();
  }
}

export default kanako;