const rule = {
  rule_compass: {
    name: "莲子的指南针",
    detail: "她看见月亮便知晓目前的所在地，有了指南针就到达任何想去的地方。",
    effect: "选择你的奖励，最多二十个选项。"
  },
  rule_watch: {
    name: "莲子的手表",
    detail: "她手表的时间是乱的，不过她看见星星便知晓目前的时间。",
    effect: "每场战斗获得随机装备。"
  },
  rule_magnify: {
    name: "莲子的放大镜",
    detail: "她看到的东西变大了，是不是也意味着她变小了？",
    effect: "角色生命上限减半，造成伤害翻倍。"
  },
  rule_corkscrew: {
    name: "莲子的开瓶器",
    detail: "这个小玩意儿总会给她带来混乱。",
    effect: "所有敌人可以在任何场景生成。"
  },
  rule_dart: {
    name: "莲子的飞镖",
    detail: "她喜欢玩飞镖，因为嫌抛壳枪装填麻烦，不过还是扔一个就少一个。",
    effect: "所有卡牌变为灵力消耗0的一次性卡牌。"
  },
  rule_flashlight: {
    name: "莲子的手电筒",
    detail: "她说晚上拿着手电筒探险比较刺激，因为只能照清一个东西。",
    effect: "每个场景只生成一种杂鱼和一种强敌。"
  },
  rule_pencil: {
    name: "莲子的铅笔",
    detail: "她喜欢铅笔沙沙的声音，削一次就能用很久，不过越削越短……",
    effect: "自身治疗转化为等量临时防御结界。"
  }
}

for (let r in rule) {
  rule[r].type = "gray";
}

export default rule;