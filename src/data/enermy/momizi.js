const momizi = {
  name: "白狼天狗",
  intro: "在妖怪之山中负责巡逻和警戒",
  detail: "目标回合会在开始十秒后自动结束。攻击力较高。",
  type: "zagu",
  scene: ["forest", "town"],
  growth: {
    health: 1,
    attack: 1,
    speed: 1.2
  },
  onload: (Admin, index) => {
    if (!Admin.cache["momizi"]) Admin.cache["momizi"] = [];
    Admin.cache["momizi"][index] = true;
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 170
    });
  }
}

export default momizi;