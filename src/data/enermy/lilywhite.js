const lilywhite = {
  name: "报春的妖精",
  intro: "拥有告知春天到来程度的能力",
  detail: "不受任何效果影响，且攻击造成随机伤害，清除随机正面效果。",
  type: "zagu",
  scene: ["shrine", "forest"],
  growth: {
    health: 0.8,
    attack: 1.2,
    speed: 1
  },
  action: (Admin, index) => {
    let r = Math.random();
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100 - r * 100,
    });
    Admin.enermy.buff.of(index).clearAll();
    Admin.role.buff.of(0).clear(true);
  }
}

export default lilywhite;