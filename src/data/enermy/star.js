const star = {
  name: "星光的妖精",
  intro: "感应到活动事物程度的能力",
  detail: "攻击附加虚弱，为全体附加力量，受攻击时50%概率闪避。",
  type: "zagu",
  scene: ["forest", "town"],
  growth: {
    health: 0.7,
    attack: 1,
    speed: 1
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100,
    });
    Admin.role.buff.of(0).add("weak", 2 * Admin.role.event.round.count);
    Admin.enermy.buff.addAll("strength", 2);
    Admin.enermy.buff.of(index).set("cautious", 5);
  }
}

export default star;