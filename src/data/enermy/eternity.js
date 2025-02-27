const eternity = {
  name: "凤蝶的妖精",
  intro: "拥有播撒鳞粉程度的能力",
  detail: "攻击造成穿透伤害，附加[恍惚]效果",
  type: "zagu",
  scene: ["shrine", "forest"],
  growth: {
    health: 1.2,
    attack: 1,
    speed: 1.3
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100,
      penetrate: true
    });
    Admin.role.buff.of(0).add("trance", 2);
  }
}

export default eternity;