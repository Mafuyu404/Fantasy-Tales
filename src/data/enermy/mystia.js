const mystia = {
  name: "夜雀",
  intro: "拥有用歌声迷惑人程度的能力",
  detail: "目标每回合必须先打从左往右数第一张牌。\n指定一个随机数，目标每回合打出的第几张牌无效。",
  type: "zagu",
  scene: ["forest", "town"],
  growth: {
    health: 1,
    attack: 1,
    speed: 1.2
  },
  onload: (Admin, index) => {
    if (!Admin.cache["mystia_first"]) Admin.cache["mystia_first"] = [];
    if (!Admin.cache["mystia_invalid"]) Admin.cache["mystia_invalid"] = [];
    Admin.cache["mystia_first"][index] = true;
    let i = Math.floor(Math.random() * 3) + 2;
    Admin.cache["mystia_invalid"][index] = i;
    Admin.enermy.buff.of(index).set("eyelashes", i);
  },
  action: (Admin, index) => {
    let i = Math.floor(Math.random() * 3) + 2;
    Admin.cache["mystia_invalid"][index] = i;
    Admin.enermy.buff.of(index).set("eyelashes", i);
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 100
    });
  }
}

export default mystia;