const narumi = {
  name: "矢田寺成美",
  intro: "在魔法森林的魔力驱动下得到生命的地藏像",
  detail: "会不断重生，随着被打败次数的增加而增加攻击、减少生命上限，唯有一击将其打败才是真正战胜她。",
  type: "elite",
  scene: ["forest", "town"],
  growth: {
    health: 1.5,
    attack: 2,
    speed: 1.3
  },
  onload: (Admin, index) => {
    if (!Admin.cache["narumi"]) Admin.cache["narumi"] = [];
    Admin.cache["narumi"][index] = 1;
  },
  action: (Admin, index) => {
    let count = Admin.cache["narumi"][index];
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 50 * count
    });
    count > 1 && Admin.enermy.buff.of(index).set("magic_life", count - 1);
  }
}

export default narumi;