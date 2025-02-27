const rumia = {
  name: "露米娅",
  intro: "拥有操纵黑暗程度的能力",
  detail: "会增加目标的卡牌灵力消耗，将目标所有牌的灵力消耗灵重新分配，并根据目标手牌数进行攻击。",
  type: "elite",
  scene: ["forest", "town"],
  growth: {
    health: 1.7,
    attack: 2,
    speed: 1.5
  },
  onload: (Admin, index) => {
    let cards = Admin.handcard.getAll();
    let currentOffset = Admin.handcard.getCostOffset().index;
    let totalCost = cards.map(c => c.cost).sum();
    totalCost += cards.length;
    let costs = cards.map(_ => 0);
    [...Array(totalCost).keys()].forEach(_ => {
      let target = [...costs.keys()].filter(i => costs[i] < 20);
      costs[target.rd()[0]]++;
    });
    costs.forEach((cost, i) => {
      Admin.handcard.setCost.byIndex(i, cost - cards[i].cost + currentOffset[i]);
    });
  },
  action: (Admin, index) => {
    Admin.role.damage.target(0).from(index).by({
      type: "scale",
      value: 60,
      amount: Admin.handcard.getHolds().length
    });
  }
}

export default rumia;