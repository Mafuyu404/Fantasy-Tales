<script>
  import { onMount, beforeUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import {
    data,
    cache,
    setting,
    page,
    explore,
    frameEvent,
    Admin,
    Explain,
    archive,
  } from "../store";
  import Handcard from "./battleHandcard.svelte";
  import Enermy from "./battleEnermy.svelte";
  import State from "./battleState.svelte";
  // import Record from "./battleRecord.svelte";
  import equipment from "../data/equipment.js";
  import consumable from "../data/consumable.json";
  import growth from "../data/growth";
  import sector from "../data/sector";
  import enermy from "../data/enermy";

  if ($Admin.data.rule.includes("rule_watch")) {
    $data.equipment = Object.keys(equipment).rd()[0];
  }
  const Data = $data;
  $cache = {
    probability_count: 0,
    probability_array: summonProbabilityArray(),
  };
  $Admin.cache = $cache;
  $Admin.probability = probabilityHandle;

  let round = true;
  let result;
  let equipmentLeft = 1;
  let remark = "null";
  let element;
  let element_equipment;
  let cursor = {};
  let showRemark = false;
  let showConsumable = false;
  let element_consumable = [];
  let rewards = [];
  let coin = 0;
  let end = false;
  let equipment_reward = false;
  $Admin.data = $data;

  const battleWorker = {
    task: {
      role: {
        list: [],
        handle: (e) => e.content($Admin, e.target),
        state: false,
      },
      enermy: {
        list: [],
        handle: (e) => e.content($Admin, e.target),
        state: false,
      },
    },
    handle: function () {
      for (let type in this.task) {
        if (this.task[type].list.length > 0) {
          if (!this.task[type].state) {
            this.task[type].handle(this.task[type].list.shift());
            this.task[type].state = true;
          } else {
            if (this.task[type].list[0].time == 1)
              this.task[type].handle(this.task[type].list.shift());
            else this.task[type].list[0].time--;
          }
        } else this.task[type].state = false;
      }
    },
  };
  const effectHandle = {
    targetRole: function (index) {
      this.Type = "role";
      this.Target = index;
      return this;
    },
    targetEnermy: function (index) {
      this.Type = "enermy";
      this.Target = index;
      return this;
    },
    by: function (e, t) {
      battleWorker.task[this.Type].list.push({
        content: e,
        target: this.Target,
        time: t ? t : 20,
      });
    },
    listLengthOf: (type) => battleWorker.task[type].list.length,
    clearTask: function () {
      battleWorker.task[this.Type].list = battleWorker.task[
        this.Type
      ].list.filter((t) => t.target != this.Target);
    },
  };
  const equipmentHandle = {
    use: function () {
      equipment[Data.equipment].handle($Admin, this.Target);
      equipmentLeft--;
      sector.useEquipment($Admin);
      actionRemark.equipment = equipmentHandle.explain();
    },
    left: {
      get: (_) => equipmentLeft,
      add: function (v) {
        const info = {
          amount: v,
          left: equipmentLeft,
        };
        sector.equipmentLeftAdd($Admin, info);
        equipmentLeft += info.amount;
      },
    },
    explain: (_) => {
      let detail;
      if (!Data.equipment) detail = "还没有装备。";
      else if (equipment[Data.equipment].passive) detail = "这是被动装备。";
      else detail = `剩余可使用次数：${equipmentLeft}`;
      return detail;
    },
    target: function (index) {
      this.Target = index;
      return this;
    },
    aim: (_) => {
      if (Object.keys(cursor).length > 0)
        return "aim" in equipment[$Admin.data.equipment];
    },
    aimming: function () {
      if (!Data.equipment) msg({ content: "你还没有装备" });
      else if (equipmentLeft < 1) msg({ content: "次数用完了" });
      else if (!round);
      else if (equipment[Data.equipment].passive)
        msg({ content: "你这是被动装备" });
      else if (element.style.cursor == "none");
      else if ($Admin.mobile) {
        msg({ content: "点击目标以使用装备" });
        element.ontouchstart = (e) => {
          let res = $Admin.enermy.checkForPosition(e);
          setTimeout((_) => {
            if (typeof res == "number") {
              $Admin.enermy.equipmentAim();
              element.onclick = null;
            }
          });
        };
      } else {
        let from = deepCopy(element_equipment.getBoundingClientRect());
        from.x = (from.left + from.right) / 2;
        from.y = (from.top + from.bottom) / 2;
        element.style.cursor = "none";
        let moveEvent = (e) => {
          if (!e.x) e.x = e.touches[0].pageX;
          if (!e.y) e.y = e.touches[0].pageY;
          showRemark = true;
          remark = "equipment";
          let res = $Admin.enermy.checkForPosition(e);
          let mid = {
            x: (e.x + from.x) / 2,
            y: (e.y + from.y) / 2,
          };
          let deg = Math.atan((from.y - e.y) / (from.x - e.x));
          cursor.r = (deg / Math.PI) * 180 - 90;
          if (e.x > from.x) cursor.r += 180;
          cursor.l =
            Math.sqrt(Math.pow(e.x - from.x, 2) + Math.pow(e.y - from.y, 2)) +
            60;
          cursor.x = mid.x;
          cursor.y = mid.y - cursor.l / 2;
          cursor.aim = typeof res == "number";
        };
        element.onmousemove = moveEvent;
        setTimeout((_) => {
          element.onclick = () => {
            $Admin.enermy.equipmentAim();
            element.onmousemove = null;
            element.onclick = null;
            element.style.cursor = "unset";
            cursor = {};
          };
        });
      }
    },
  };
  const actionRemark = {
    equipment: equipmentHandle.explain(),
    // consumable: "使用携带的消耗品。",
    consumable: "查看持有物品",
    roundEnd: "没招了，轮到敌人了。",
    close: "不看了。",
    null: "",
  };
  const statisticsHandle = {
    round_items: [
      "round_punch_count",
      "round_damage_frequency",
      "round_expend_count",
      "round_damage_total",
      "round_max_damage",
      "round_max_hurt",
      "round_hurt_total",
      "round_hurt_frequency",
      "round_cost_total",
    ],
    roundData: [],
    resetRoundData: function () {
      this.round_items.forEach((i) => ($Admin.cache[i] = 0));
    },
    saveRoundData: function () {
      let res = {};
      this.round_items.forEach((i) => (res[i] = $Admin.cache[i]));
      this.roundData.push(res);
    },
    countTotal: function () {
      let res = {};
      this.round_items.forEach((i) => {
        let key = i.split("_");
        key[0] = "battle";
        res[key.join("_")] = this.roundData.map((d) => d[i]).sum();
      });
      res.battle_max_damage = Math.max(
        ...this.roundData.map((d) => d.round_max_damage),
      );
      res.battle_max_hurt = Math.max(
        ...this.roundData.map((d) => d.round_max_hurt),
      );
      return res;
    },
  };
  const battle = {
    round: {
      get: function () {
        return round;
      },
      set: function (v) {
        round = v;
      },
    },
    winEvent,
    deadEvent,
    result: (_) => result,
    effect: effectHandle,
    equipment: equipmentHandle,
    runOutAway,
  };
  $Admin.battle = battle;
  $Admin.effect = effectHandle;
  $Admin.statistics = statisticsHandle;

  onMount((_) => {
    sector.battleOnload($Admin);
    setTimeout((_) => $Admin.role.event.round.start());
    $frameEvent.add("battleWorker", (_) => battleWorker.handle(), 1);
    element_equipment.onmouseenter = (_) => (remark = "equipment");
    if ($Admin.mobile)
      element_equipment.ontouchstart = battle.equipment.aimming;
    else element_equipment.onmousedown = battle.equipment.aimming;
    setTimeout((_) => {
      $Admin.guide.add("enermy_info");
      $Admin.guide.add("state");
      $Admin.guide.add("handcards");
      $Admin.guide.add("round_end");
      if ($archive.guide.menu) $Admin.guide.add("menu_open");
      if (Data.equipment && !equipment[Data.equipment].passive)
        $Admin.guide.add("equipment");
    }, 200);
  });

  beforeUpdate((_) => {
    actionRemark.equipment = equipmentHandle.explain();
    if ($Admin.role)
      actionRemark.roundEnd = `现在是第${$Admin.role.event.round.count}回合。`;
    element_consumable.forEach((e, i) => {
      if (e) $Explain(e).with(consumable[Object.keys(Data.consumable)[i]]);
    });
    element_consumable.forEach((e, i) => {
      const key = Object.keys(Data.consumable)[i];
      if (e)
        e.onmousedown = (_) => {
          let _class = e.className;
          e.className = `${e.className} using`;
          let timer = setTimeout((_) => {
            msg({ content: `使用了[${consumable[key].name}]` });
            if (Data.consumable[key] == 1) delete Data.consumable[key];
            else Data.consumable[key]--;
            Data.consumable = Data.consumable;
            cancel();
          }, 1200);
          let cancel = (_) => {
            clearTimeout(timer);
            e.className = _class;
          };
          e.onmouseup = cancel;
          e.onmouseout = cancel;
        };
    });
  });

  function probabilityHandle(r) {
    if (r >= 0.9) r = 1;
    if (r <= 0.1) r = 0;
    let info = { probability: r };
    sector.probability($Admin, info);
    if ($cache.probability_count >= Data.probability_amount) {
      $cache.probability_array = [
        ...$cache.probability_array,
        ...summonProbabilityArray(),
      ];
    }
    let P = $cache.probability_array[$cache.probability_count++];
    // let R = Math.random();
    // if (P < R) {
    //   P = (P + R) / 2;
    // }
    return P < info.probability;
  }

  function runOutAway(who) {
    if (who === true) {
      msg({ content: "逃跑成功" });
    } else {
      $Admin.enermy.state.of(who).set("health", -1);
      $Admin.enermy.state.of(who).set("Health", -25565);
      msg({ content: "有人逃跑了！" });
    }
    let outAmount = $Admin.enermy.state
      .getAll()
      .map((state) => state.health)
      .filter((h) => h < 0).length;
    if ($Admin.enermy.survival().length == outAmount || who === true) {
      end = true;
      result = "none";
      $data.health = Math.ceil($Admin.role.state.get().Health);
      $explore.lv++;
      $cache = {};
      let enermys = $explore.enermy.filter((_, i) => $explore.target[i]);
      let survival = $Admin.enermy.survival();
      let out = enermys.map((_, i) => i).filter((i) => !survival.includes(i));
      $explore.enermy = $explore.enermy.filter((_, i) => !out.includes(i));
      $explore.target.set(false);
      let kills = enermys.filter((_, i) => !survival.includes(i));
      kills.forEach((e) => {
        rewards = [...rewards, enermy[e].color];
      });
      coin = 10 * rewards.length * (4 + rewards.length);
      statistics({ battle_defeat_total: kills.length });
    }
  }
  function winEvent(index) {
    if (end) return;
    if ($Admin.enermy.survival("left").length == 0) {
      end = true;
      $Admin.sound("win");
      let enermys = $explore.enermy.filter((_, i) => $explore.target[i]);
      if (!$data.trial) {
        sector.win($Admin);
        $data.health = Math.ceil($Admin.role.state.get().Health);
        $explore.lv++;
        enermys.forEach((e) => {
          if (e != "yukari0") rewards = [...rewards, enermy[e].color];
        });
        statistics({ battle_defeat_total: enermys.length });
        coin = 10 * rewards.length * (4 + rewards.length);
        $explore.enermy = $explore.enermy.filter((_, i) => !$explore.target[i]);
        let isFinalBoss = !$explore.enermy
          .map((e) => enermy[e].type)
          .includes("boss");
        if (rewards.includes("red") && isFinalBoss) {
          $Admin.data.chance.amount++;
          msg({ content: "残机+1" });
          $Admin.event.stageClear();
          if ($Admin.data.stage == 1) equipment_reward = true;
        }
        $explore.target.set(false);
      }
      setTimeout((_) => {
        if (enermys.includes("yukari") && !$data.trial) {
          $page = "Epilog";
        } else {
          result = "win";
          if (!enermys.includes("yukari0"))
            setTimeout((_) => $Admin.guide.add("win_reward"), 500);
        }
      }, 1200);
    }
  }
  function deadEvent(damage) {
    if (end) return;
    $Admin.sound("dead");
    end = true;
    result = "dead";
    if (!$data.trial) {
      let info = { damage: damage };
      sector.dead($Admin, info);
      $data.chance.amount--;
      if ($data.chance.amount >= 0) {
        $explore.lv = Math.max($explore.lv - 3, 1);
        $data.health = growth.role[$data.role].health;
        if ($Admin.data.rule.includes("rule_magnify")) $data.health /= 2;
        msg({ content: "已消耗一次重生机会" });
      }
      let enermys = $explore.enermy.filter((_, i) => $explore.target[i]);
      let survival = $Admin.enermy.survival();
      let out = enermys.map((_, i) => i).filter((i) => !survival.includes(i));
      $explore.enermy = $explore.enermy.filter((_, i) => !out.includes(i));
      let kills = enermys.filter((_, i) => !survival.includes(i));
      kills.forEach((e) => {
        rewards = [...rewards, enermy[e].color];
      });
      statistics({ battle_defeat_total: kills.length });
      $explore.target.set(false);
    }
  }
  function statistics(info) {
    $Admin.music.pause();
    if (!$data.trial) {
      $Admin.statistics.saveRoundData();
      const battle_data = $Admin.statistics.countTotal();
      battle_data["battle_round_total"] = $Admin.role.event.round.count;
      battle_data["battle_defeat_total"] = info["battle_defeat_total"];
      $Admin.data.statistics.push(battle_data);
      $data.probability_amount = $cache.probability_count;
      if ($cache.unlockedSpellcard) {
        $archive.unlocked.spellcard.push(...$cache.unlockedSpellcard);
      }
      if ($cache.unlockedRule) {
        $archive.unlocked.rule.push($cache.unlockedRule);
      }
      $Admin.upload;
    }
  }
  function summonProbabilityArray() {
    if (!Data.probability_amount) Data.probability_amount = 100;
    let step = 1 / (Data.probability_amount - 1);
    let res = [...Array(Data.probability_amount).keys()]
      .rd()
      .map((i) => i * step);
    return res;
  }
</script>

<div
  class="body {result}"
  style="background-image:url('/img/scene/{Data.scene}.webp')"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
  bind:this={element}
>
  {#if "x" in cursor}
    <div
      class="cursor"
      style="left:{cursor.x}px;top:{cursor.y}px;transform:rotate({cursor.r}deg);height:{cursor.l}px;--color:{cursor.aim
        ? '#f00'
        : '#00f'}"
      out:scale={{ duration: 250 }}
    >
      <div class="cursor-body"></div>
      <div class="pointer"></div>
    </div>
  {/if}
  <div class="battle {result}">
    <Enermy {battle} />
    <div class="role_action">
      <Handcard {battle} />
      <State {battle} />
      <div
        class="action {round ? 'in' : 'out'}Round {showRemark &&
          'showRemark'} {showConsumable && 'showConsumable'}"
        on:mouseover={(_) => {
          showRemark = true;
          if (showConsumable) {
            remark = "consumable";
          } else remark = "null";
        }}
        on:mouseout={(_) => {
          if (showConsumable) {
            remark = "consumable";
          } else {
            showRemark = false;
            remark = "null";
          }
        }}
      >
        <div class="equipment" bind:this={element_equipment} id="equipment">
          <icon class="icon-{Data.equipment ? Data.equipment : 'empty'}"></icon>
        </div>
        <div
          class="consumables"
          on:mouseenter={(_) => (remark = "consumable")}
          on:click={(_) => {
            $Admin.menu();
            // if (round) showConsumable = !showConsumable;
          }}
        >
          <icon class="icon-consumables"></icon>
        </div>
        <txt
          class="roundEnd"
          on:click={(_) => round && $Admin.role.event.round.end()}
          on:mouseenter={(_) => (remark = "roundEnd")}>结束<br />回合</txt
        >
        <!-- <txt
          class="hideconsumable"
          on:mouseenter={(_) => (remark = "close")}
          on:click={(_) => {
            showConsumable = false;
            showRemark = false;
          }}>x</txt
        > -->
        <txt class="remark">{actionRemark[remark]}</txt>
        {#if showConsumable}
          <div class="consumable-list">
            {#each Object.keys(Data.consumable) as c, i (i)}
              <icon class="icon-{c}" bind:this={element_consumable[i]}>
                {#if Data.consumable[c] > 1}
                  <txt>{Data.consumable[c]}</txt>
                {/if}
              </icon>
            {/each}
          </div>
          <txt class="tip">长按使用</txt>
        {/if}
      </div>
    </div>
  </div>
  <div
    class="barrier body"
    style="z-index:{result ? 9 : -1};{result && 'visibility:visible'}"
  >
    {#if result && result != "none"}
      <img src="/img/role/{$setting.resource}/{result}/{Data.role}.webp" />
    {/if}
    <div style="width: 180px;" id="win_reward">
      {#if result && result != "none"}
        <txt class="title">{result == "win" ? "胜利" : "满身疮痍"}</txt>
      {/if}
      {#each rewards as r, i (i)}
        <txt
          class="skip"
          on:click={(_) => {
            $Admin.event.getCollection(r);
            rewards.splice(i, 1);
            rewards = rewards;
          }}
        >
          获得{r == "blue" ? "蓝色" : r == "green" ? "绿色" : "红色"}收藏品
        </txt>
      {/each}
      {#if $data.chance.amount >= 0}
        {#if equipment_reward}
          <txt
            class="skip"
            on:click={(_) => {
              $Admin.event.getEquipment();
              equipment_reward = false;
            }}>获得装备</txt
          >
        {/if}
        {#if coin != 0}
          <txt
            class="skip"
            on:click={(_) => {
              $Admin.event.getCoin(coin);
              coin = 0;
            }}>获得{coin}<icon class="icon-coin"></icon></txt
          >
        {/if}
        <txt
          class="skip"
          on:click={(_) => {
            if ($data.trial) {
              $page = "Archive";
            } else $page = "Explore";
          }}>返回</txt
        >
      {:else}
        <txt
          class="skip"
          on:click={(_) => {
            $page = "Epilog";
          }}>结算</txt
        >
      {/if}
    </div>
  </div>
</div>

<style>
  .battle {
    justify-content: space-between;
    align-items: center;
    height: 640px;
  }
  .role_action {
    width: 1000px;
    align-items: center;
    position: absolute;
    bottom: 0;
  }

  .tip {
    position: absolute;
    left: 250px;
    top: 210px;
    font-size: 30px;
    font-family: write;
  }

  .consumable-list {
    flex-direction: row;
    font-size: 36px;
    position: absolute;
    top: 123px;
    margin-left: 10px;
    flex-wrap: wrap;
    width: 280px;
  }
  .consumable-list > icon {
    margin: 5px;
    -webkit-mask: url("/img/urban-sprite.webp");
    mask: url("/img/urban-sprite.webp");
    -webkit-mask-size: 3000% 100%;
    mask-size: 3000% 100%;
    position: relative;
  }
  .consumable-list txt {
    position: absolute;
    right: 0px;
    bottom: -4px;
    font-size: 22px;
    font-family: write;
    font-weight: bold;
    --shadow: #fff;
    text-shadow:
      0 0 6px var(--shadow),
      0 0 6px var(--shadow),
      0 0 6px var(--shadow),
      0 0 6px var(--shadow),
      0 0 6px var(--shadow),
      0 0 6px var(--shadow),
      0 0 6px var(--shadow);
  }
  .using {
    animation: used 1.2s steps(29) forwards;
  }

  .hideconsumable {
    font-size: 80px;
    font-family: write;
    margin-left: 20px;
    cursor: pointer;
  }

  .cursor {
    height: 500px;
    position: absolute;
    z-index: 5;
    align-items: center;
    width: 0px;
    filter: drop-shadow(0 0 2px var(--color)) drop-shadow(0 0 2px var(--color));
  }
  .cursor-body {
    background-color: #fff;
    height: 100%;
    width: 60px;
    clip-path: polygon(0 100%, 43% 30px, 57% 30px, 100% 100%);
  }
  .pointer {
    background-color: #fff;
    height: 60px;
    width: 44px;
    clip-path: polygon(0 100%, 50% 0, 100% 100%, 50% 90%);
    position: absolute;
  }

  .action {
    position: absolute;
    right: 5px;
    bottom: -165px;
    width: 350px;
    height: 260px;
    background-color: #fff;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='30' width='100%'><circle r='10' cx='20' cy='13' fill='%23888' /><line x1='80' x2='80' y1='0' y2='30' stroke='%23f00' /><line x1='0' x2='100%'  y1='28' y2='28' stroke='%2300f'/></svg>");
    background-repeat: repeat-y;
    transform: rotate(-5deg);
    transition: 0.3s;
    padding-left: 50px;
    box-sizing: border-box;
    flex-direction: row;
    color: #555;
    z-index: 6;
  }
  .showRemark {
    right: 15px;
    bottom: -115px;
  }
  .showConsumable {
    bottom: -25px;
    right: 35px;
  }
  .remark {
    margin-left: 20px;
    font-size: 30px;
    font-family: write;
    position: absolute;
    top: 90px;
  }
  .roundEnd {
    margin: 5px 10px;
    font-size: 60px;
    font-family: write;
    line-height: 40px;
    cursor: pointer;
    height: 200px;
    overflow: hidden;
  }
  .equipment,
  .consumables {
    align-items: center;
    cursor: pointer;
    transition: 0.2s;
    margin: 10px 10px;
    width: 70px;
    height: 70px;
  }
  .equipment > icon,
  .consumables > icon {
    font-size: 70px;
  }
  .outRound {
    right: -10px;
    bottom: -208px;
    cursor: wait;
  }
  .outRound > * {
    cursor: wait;
  }

  .barrier {
    flex-direction: row;
    visibility: hidden;
    transition: 0.4s;
    z-index: 7;
  }
  .barrier > img {
    height: 400px;
  }
  .barrier > div {
    justify-content: space-evenly;
    align-items: center;
    height: 320px;
  }
  .barrier > div > .title {
    text-align: center;
    color: white;
    font-size: 64px;
    line-height: 64px;
    font-family: "title";
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
  }
  .skip {
    flex-direction: row;
    justify-content: center;
    line-height: 30px;
    font-size: 24px;
    font-family: normal;
    text-shadow:
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888;
    color: white;
    cursor: pointer;
    transition: 0.2s;
    opacity: 0.6;
  }
  .skip:hover {
    transform: scale(1.1);
    opacity: 1;
  }
  .skip:active {
    text-shadow:
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff;
  }
  .skip:active img {
    filter: drop-shadow(0 0 4px #fff);
  }
  .win .barrier {
    backdrop-filter: brightness(1.2) contrast(1.2) blur(4px);
  }
  .win .barrier > * {
    animation: result 0.4s forwards;
  }
  .dead .barrier {
    animation: dead 4s forwards;
  }
  .none .barrier {
    backdrop-filter: blur(4px);
  }

  :global(.battle-input-damage) {
    position: absolute;
    color: white;
    font-size: 24px;
    width: 100px;
    text-align: center;
    animation: battleDamage 0.8s forwards;
    z-index: 5;
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
  }
  :global(.battle-input-heal) {
    position: absolute;
    color: lime;
    font-size: 24px;
    width: 100px;
    text-align: center;
    animation: battleHeal 0.8s forwards;
    text-shadow:
      0 0 2px white,
      0 0 2px white,
      0 0 2px white,
      0 0 2px white,
      0 0 2px white,
      0 0 2px white,
      0 0 2px white;
    z-index: 5;
  }
  :global(.critical) {
    text-shadow:
      0 0 3px red,
      0 0 3px red,
      0 0 3px red,
      0 0 3px red,
      0 0 3px red,
      0 0 3px red,
      0 0 3px red;
  }
  :global(.penetrate) {
    font-family: penetrate;
  }
  :global(.indirect) {
    color: #ddd;
  }

  @keyframes battleDamage {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    30% {
      opacity: 1;
      transform: scale(1.4);
    }
    40% {
      transform: scale(1);
    }
    90% {
      opacity: 1;
    }
    99% {
      z-index: 5;
    }
    100% {
      opacity: 0;
      z-index: -1;
    }
  }
  @keyframes battleHeal {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    20% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: translateY(0px);
    }
    99% {
      z-index: 5;
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
      z-index: -1;
    }
  }
  @keyframes dead {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    100% {
      backdrop-filter: saturate(0) blur(4px);
    }
  }
  @keyframes result {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }

    80% {
      opacity: 1;
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }
  @keyframes used {
    0% {
      -webkit-mask-position: 0 0;
      mask-position: 0 0;
    }

    100% {
      -webkit-mask-position: 100% 0;
      mask-position: 100% 0;
    }
  }
  @keyframes consumable-reset {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
