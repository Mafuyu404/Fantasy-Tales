const cirno = {
  name: "冰之妖精",
  intro: "冷酷的智者",
  detail: "附加[迟缓]和[疲倦]。",
  type: "zagu",
  scene: ["shrine", "town"],
  growth: {
    health: 1,
    attack: 1,
    speed: 1.2
  },
  onload: (Admin, index) => {
    Admin.role.buff.of(0).add("tired", 2);
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100,
    });
    Admin.role.buff.of(0).add("tardy", 3);
  }
}

export default cirno;