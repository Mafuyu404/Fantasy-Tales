<script>
  import { onMount, afterUpdate } from "svelte";
  import info_spellcard from "../data/spellcard.js";
  import info_basecard from "../data/basecard.js";
  import { data, Admin } from "../store";
  import sector from "../data/sector";
  import Card from "../addon/card.svelte";
  import keypress from "../data/keypress.js";

  const Data = deepCopy($data);
  const handcards = Object.unCount(Data.card);
  const cards = Object.assign(
    deepCopy(info_spellcard),
    deepCopy(info_basecard),
  );

  let left = [];
  let hold = [];
  let selected;
  let draging;
  let ready = false;
  const costOffset = {
    index: handcards.map((_) => 0),
    key: {},
    reset: function () {
      this.index = handcards.map((_) => 0);
      this.key = {};
    },
  };
  $: cost = costOffset && costOffsetApply();
  $: transformArray = hold && transformArrayRefreshFor();
  $: leftChange = left && leftChangeHandle();
  let left_card_show = false;
  let element_container;
  let animate = true;
  let barrier = false;
  let punch_cd = false;
  let interim = handcards.map((key) => cards[key].interim);
  let abandoned = handcards.map((_) => false);
  const expend = [];

  let info_sector = {
    limit: 4,
    drawAmount: 2,
    holdLimit: 4,
    handcards,
  };

  export let battle;

  const insertHandle = {
    amount: function (amount) {
      this.Amount = amount;
      return this;
    },
    cost: function (amount) {
      this.Cost = amount;
      return this;
    },
    interim: function (v) {
      this.Interim = v;
      return this;
    },
    toAll: function (key) {
      let res = [];
      if (!this.Amount) this.Amount = 1;
      [...Array(this.Amount).keys()].forEach((_) => {
        if (this.Interim) interim.push(true);
        else interim.push(cards[key].interim);
        handcards.push(key);
        let _costOffset = 0;
        if (typeof this.Cost == "number")
          _costOffset = this.Cost - cards[key].cost;
        costOffset.index = [...costOffset.index, _costOffset];
        res.push(handcards.length - 1);
      });
      this.Amount = false;
      this.Cost = false;
      return res;
    },
    toHolds: function (key) {
      let res = this.toAll(key);
      setTimeout((_) => {
        hold = [...hold, ...res];
      }, 600);
    },
    toLeft: function (key) {
      let res = this.toAll(key);
      left = [...left, ...res];
    },
  };
  const drawHandle = {
    amount: function (a) {
      this.Amount = a;
      return this;
    },
    type: function (t) {
      this.Type = t;
      return this;
    },
    fromAll: function () {
      const range = handcards
        .map((_, i) => i)
        .filter((i) => !expend.includes(i) && !hold.includes(i));
      if (range.length <= this.Amount) msg({ content: "抽空了" });
      let holdLimit = 4 + Math.round($Admin.role.state.of(0).get().speed);
      let info = { holdLimit, amount: this.Amount };
      sector.drawCard($Admin, info);
      let holdLength = hold.length,
        margin = info.holdLimit - holdLength,
        drawAmount = Math.min(margin, info.amount);
      setTimeout((_) => {
        range
          .rd()
          .splice(0, drawAmount)
          .forEach((i) => {
            hold = [...hold, i];
            if (left.includes(i)) left = left.filter((ii) => ii != i);
          });
      }, 600);
      if (drawAmount > margin) msg({ content: "达到手牌上限" });
    },
    fromLeft: function () {
      Object.keys(cards).filter((c) => Object.keys(info_basecard).includes(c));
      Object.keys(cards).filter((c) => Object.keys(info_spellcard).includes(c));
      this.from(left);
    },
    fromExpend: function () {
      this.from(expend);
    },
    fromUsed: function () {
      const range = handcards
        .map((_, i) => i)
        .filter(
          (i) => !expend.includes(i) && !hold.includes(i) && !left.includes(i),
        );
      this.from(range);
    },
    from: function (_range) {
      $Admin.sound("paper");
      let range = _range;
      if (this.Type)
        range = _range.filter((i) => cards[handcards[i]].type == this.Type);
      if (range.length <= this.Amount) msg({ content: "抽空了" });
      let holdLimit = 4 + Math.round($Admin.role.state.of(0).get().speed);
      let info = { holdLimit, amount: this.Amount, drawLimit: range.length };
      sector.drawCard($Admin, info);
      let holdLength = hold.length,
        leftLength = range.filter((i) => !hold.includes(i)).length,
        margin = info.holdLimit - holdLength,
        drawAmount = Math.min(margin + 1, info.amount, leftLength);
      if (drawAmount > margin) msg({ content: "达到手牌上限" });
      setTimeout((_) => {
        let res;
        if (!this.Type) {
          res = _range.rd().slice(0, drawAmount)
        } else {
          res = range.rd().splice(0, drawAmount);
        }
        hold = [...hold, ...res];
        left = left.filter((i) => !res.includes(i));
      }, 600);
    },
  };
  const abandonHandle = {
    amount: function (a) {
      this.Amount = a;
      return this;
    },
    type: function (t) {
      this.Type = t;
      return this;
    },
    fromHolds: function (_target) {
      let info = {
        amount: this.Amount,
        type: this.Type,
      };
      sector.abandonCard($Admin, info);
      setTimeout((_) => {
        let source;
        if (info.type == "spellcard")
          source = hold.filter(
            (ii) => cards[handcards[ii]].type == "spellcard",
          );
        else source = deepCopy(hold);
        let target = source.rd().splice(0, info.amount);
        target.forEach((t) => (abandoned[t] = true));
        target = target.map((t) => hold.indexOf(t));
        if (_target) target = _target;
        setTimeout((_) => {
          transformArray = transformArrayRefreshFor(target);
          setTimeout((_) => {
            animate = false;
            hold = hold.filter((_, i) => !target.includes(i));
            abandoned.set(false);
            setTimeout((_) => (animate = true), 50);
          }, 250);
        }, 200);
      }, 600);
    },
  };
  const handcard = {
    refresh,
    punch,
    aim: () => {
      if (handcards[selected]) return "aim" in cards[handcards[selected]];
      else return true;
    },
    getHolds: (_) => {
      return hold.map((i) => {
        let key = handcards[i],
          res = deepCopy(cards[key]);
        res.cost = cost[i];
        res.key = key;
        res.index = i;
        return res;
      });
    },
    getLefts: (_) => {
      return left.map((i) => {
        let key = handcards[i],
          res = deepCopy(cards[key]);
        res.cost = cost[i];
        res.key = key;
        res.index = i;
        return res;
      });
    },
    getUseds: (_) => {
      let all = [...handcards.keys()];
      all = all.filter((i) => !hold.includes(i) || !left.includes(i));
      return all;
    },
    getAll: (_) => {
      return handcards.map((card, i) => {
        let res = deepCopy(cards[card]);
        res.cost = cost[i];
        res.key = card;
        res.index = i;
        res.interim = interim[i];
        return res;
      });
    },
    draw: drawHandle,
    setCost: {
      byIndex: (index, value) => {
        costOffset.index[index] = value;
      },
      byKey: (key, value) => {
        costOffset.key[key] = value;
      },
    },
    getCostOffset: function () {
      return costOffset;
    },
    setInterim: {
      byIndex: (index, value) => {
        interim[index] = value;
      },
      byKey: (key, value) => {
        handcards.forEach((k, ii) => {
          if (k == key) interim[ii] = value;
        });
        interim = interim;
      },
    },
    insert: insertHandle,
    abandon: abandonHandle,
    Cost,
    leftReset,
    punch: directPunch,
  };
  $Admin.handcard = handcard;

  onMount((_) => {
    keypress.bind("d", function () {
      if (draging > hold.length - 1) draging = hold.length - 1;
      if (typeof draging != "number" || draging == hold.length - 1) draging = 0;
      else draging++;
    });
    keypress.bind("a", function () {
      if (draging > hold.length - 1) draging = hold.length - 1;
      if (typeof draging != "number" || draging == 0) draging = hold.length - 1;
      else draging--;
    });
    keypress.bind("space", directPunch);
    keypress.bind("enter", function () {
      $Admin.battle.round.get() && $Admin.role.event.round.end();
    });
    keypress.bind("f", function () {
      left_card_show = !left_card_show;
    });
    setTimeout((_) => {
      sector.handcardOnload($Admin, info_sector);
      leftReset();
    });
  });
  afterUpdate((_) => {
    if (element_container)
      element_container.ontouchstart = function (event) {
        let originX = event.touches[0].pageX;
        let scrollTop = element_container.scrollTop;
        element_container.ontouchmove = function (e) {
          let x = e.touches[0].pageX;
          element_container.scrollTop = scrollTop + x - originX;
        };
      };
    if ($Admin.data.rule.includes("rule_dart")) {
      interim.set(true);
      cost.set(0);
    }
  });

  function leftChangeHandle() {
    setTimeout((_) => (leftChange = false), 800);
    return true;
  }
  function refresh() {
    $Admin.sound("paper");
    // 修改后的机制，用索引代表符卡，避免普攻被吞
    const info = {
      holdLimit: 4 + Math.round($Admin.role.state.of(0).get().speed),
      drawAmount: Math.max(0, 2 + speedHandle()),
      drawLimit: left.length,
      ex: [],
      handcards,
      hold,
    };
    if (left.length < info.drawAmount) leftReset();
    if ($Admin.role.event.round.count == 1) {
      info.drawAmount++;
    }
    sector.handcardRefresh($Admin, info);
    let margin = info.holdLimit - hold.length,
      drawAmount = Math.min(margin, info.drawAmount, left.length);
    hold = [...hold, ...left.splice(0, drawAmount), ...info.ex];
    left = left;
  }
  function leftReset() {
    let res = handcards
      .map((_, i) => i)
      .filter((i) => !hold.includes(i) && !expend.includes(i))
      .rd();
    let info_sector = {
      res,
    };
    sector.handcardLeftReset($Admin, info_sector);
    left = res;
    return res;
  }
  function punch(target) {
    let _card = cards[handcards[selected]];
    _card.key = handcards[selected];
    _card.index = selected;
    let type;
    type = "role" in _card ? "spellcard" : "basecard";
    if (Data.role == handcards[selected]) type = "normal_attack";
    const info = {
      cost: Cost(),
      type,
      card: _card,
      target,
      valid: true,
    };
    if (!battle.round.get()) msg({ content: "不在你的回合" });
    else if (info.cost === false) msg({ content: "条件不足" });
    else if (info.cost > $Admin.role.power.of(0).get())
      msg({ content: "灵力不足" });
    else {
      $Admin.role.power.of(0).cost(info.cost);
      sector.punchCard($Admin, info);
      let output = cards[handcards[selected]].handle;
      if (info.valid) output($Admin, target);
      $Admin.cache["last_card"] = handcards[selected];
      $Admin.cache["last_target"] = target;
    }
  }
  function Cost(index) {
    if (!index) index = selected;
    const info = {
      card: deepCopy(cards[handcards[index]]),
      cost: cost[index],
      valid: true,
      index_of_all: index,
      index_of_holds: hold.indexOf(index),
    };
    info.card.key = handcards[index];
    sector.beforePowerCost($Admin, info);
    if (!info.valid) return false;
    else return info.cost;
  }
  function speedHandle() {
    let target = $Admin.enermy.state.getAll().filter((e) => e.Health > 0);
    let adv = target.reduce((a, c) => a + c.speed, 0) / target.length;
    let value = Math.abs($Admin.role.state.of(0).get().speed - adv);
    let n = value - parseInt(value);
    let res = parseInt(value) + Number(r() < n);
    return $Admin.role.state.of(0).get().speed > adv ? res : -res;
  }
  function costOffsetApply() {
    let info_cards = deepCopy(cards);
    for (let key in costOffset.key) info_cards[key].cost += costOffset.key[key];
    let res = handcards.map((c) => info_cards[c].cost);
    costOffset.index.forEach((c, i) => (res[i] += c));
    res = res.map((v) => Math.max(0, v));
    cost = res;
    return res;
  }
  function dragCancel(target) {
    const s = selected;
    punch(target);
    barrier = true;
    setTimeout((_) => {
      animate = false;
      hold = hold.filter((i) => i != s);
      setTimeout((_) => {
        animate = true;
        barrier = false;
        if (interim[s]) expend.push(s);
      }, 80);
    }, 500);
  }
  function directPunch(target, rclick) {
    if (punch_cd) return;
    if (!$Admin.battle.round.get()) msg({ content: "不在你的回合" });
    else {
      selected = hold[draging];
      const s = selected;
      let _cost = $Admin.handcard.Cost();
      if (_cost === false) {
        msg({ content: "条件不足" });
      } else if ($Admin.role.power.of(0).get() < _cost)
        msg({ content: "灵力不足" });
      else {
        if (typeof target != "number") target = $Admin.enermy.info.getAiming();
        if (typeof target != "number") msg({ content: "请选择目标" });
        else {
          transformArray = transformArrayRefreshFor([draging]);
          punch(target);
          punch_cd = true;
          ready = true;
          setTimeout((_) => {
            animate = false;
            hold = hold.filter((i) => i != s);
            setTimeout((_) => {
              animate = true;
              if (interim[s]) expend.push(s);
              if (!rclick) {
                if (draging > hold.length - 1) draging = hold.length - 1;
              }
              else draging = null;
              punch_cd = false;
              selected = null;
              ready = false;
            }, 10);
          }, 200);
        }
      }
    }
  }
  function transformArrayRefreshFor(index) {
    index = index ? index : [];
    let _hold = hold.filter((ii, i) => !index.includes(i));
    let l = Math.max(_hold.length, 6) - 1;
    let res = _hold.map((ii, i) => {
      return {
        x: ((i - (_hold.length - 1) / 2) * 560) / l,
        y:
          (Math.sqrt(
            490000 - Math.pow(((i - (_hold.length - 1) / 2) / l) * 700, 2),
          ) -
            600) /
            2.5 -
          90,
        rotate: (i - (_hold.length - 1) / 2) * ((15 * 2) / l),
      };
    });
    for (let i of index)
      if (typeof i == "number") {
        res.splice(i, 0, transformArray[i]);
      }
    return res;
  }
  function select(index, ii) {
    if (typeof index == "number") selected = ii;
    else selected = null;
    transformArray = transformArrayRefreshFor([index]);
    draging = index;
  }
</script>

<div class="handcards">
  {#each hold as ii, i (i)}
    <Card
      key={handcards[ii]}
      action={dragCancel}
      select={(v) => select(v ? i : null, ii)}
      cost={cost[ii]}
      transform={transformArray[i]}
      {animate}
      interim={interim[ii]}
      abandoned={abandoned[ii]}
      drag={draging == i}
      ready={ready && draging == i}
    />
  {/each}
  <div class="barrier" style="display:{barrier ? 'block' : 'none'}"></div>
  <div
    class="left-card-close"
    style="display:{left_card_show ? 'block' : 'none'}"
    on:click={(_) => (left_card_show = false)}
  ></div>
  <div
    class="left-card {left_card_show && 'show'}"
    on:click={(_) => (left_card_show = true)}
  >
    <icon class="icon-left_card {leftChange && 'animate_leftChange'}" />
    <txt>{left.length}</txt>
    <div>
      <div class="list">
        {#if left.length == 0}
          <txt>空空如也</txt>
        {/if}
        <div bind:this={element_container}>
          {#each left as ii (ii)}
            <Card key={handcards[ii]} />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .left-card-close {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
  }
  .left-card {
    position: absolute;
    bottom: -80px;
    color: white;
    align-items: center;
  }
  .left-card > icon {
    transition: 0.3s;
    cursor: pointer;
  }
  .left-card > icon:hover {
    transform: scale(1.2);
  }
  .left-card > txt {
    --shadow: #666;
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
  }
  .animate_leftChange {
    animation: lefts 0.8s forwards;
  }
  @keyframes lefts {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
  .left-card .list > txt {
    font-size: 72px;
    position: absolute;
    color: #ccc;
    font-family: title;
  }
  .left-card > div {
    position: absolute;
    visibility: hidden;
    z-index: -1;
    opacity: 0;
    filter: drop-shadow(0 0 6px #666);
    bottom: 42px;
    transition: 0.3s;
  }
  .left-card .list {
    width: 720px;
    height: 450px;
    padding: 25px;
    box-sizing: border-box;
    filter: drop-shadow(0 0 6px #666);
    align-items: center;
    justify-content: center;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='rgb(255, 220, 220)' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 120px;
    clip-path: polygon(
      30px 0,
      690px 0,
      100% 30px,
      100% 420px,
      690px 100%,
      30px 100%,
      0 420px,
      0 30px
    );
  }
  .left-card .list > div {
    padding: 10px;
    margin: auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .left-card .list > div::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .left-card.show > div {
    visibility: visible;
    opacity: 1;
    z-index: 50;
  }
  .left-card > icon {
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
    font-size: 42px;
  }
  .left-card > txt {
    font-size: 18px;
    font-family: title;
    position: absolute;
    right: -5px;
    bottom: -5px;
  }

  .barrier {
    position: absolute;
    height: 1000px;
    width: 760px;
    top: -100px;
  }
  .handcards {
    flex-direction: row;
    justify-content: center;
    height: 180px;
    z-index: 4;
    width: 600px;
    position: relative;
    bottom: 100px;
  }

  :global(.handcards > .card) {
    position: absolute;
  }

  @keyframes animate_spellcard {
    0% {
      opacity: 0;
      transform: translateY(120px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
  @keyframes useSpellcard {
    0% {
      transform: translateY(-20px);
    }
    50% {
      transform: rotateY(90deg) translateY(-20px);
    }

    100% {
      transform: rotateY(90deg) translateY(-20px);
      width: 0;
      margin: 0;
      border: 0;
    }
  }
</style>
