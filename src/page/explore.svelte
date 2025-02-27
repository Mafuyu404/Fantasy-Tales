<script>
  import { onMount, beforeUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { data, page, explore, Admin, Explain } from "../store";
  import event from "../data/event.json";
  import eventContent from "../addon/event";
  import enermy from "../data/enermy";
  import growth from "../data/growth";
  import Data from "../data/data";

  $Admin.data = $data;
  if (!$explore.eventSummoned) install();
  let animate = true;
  let paper;
  let event_id;
  let element_scene;
  const element_scene_enermy = {};
  let element_event_list;
  let element_explore;

  $Admin.event.summonZagu = summonZagu;
  $Admin.event.summonElite = summonElite;
  $Admin.event.summonBoss = summonBoss;
  $Admin.event.finish = eventFinish;
  $Admin.event.stageClear = (_) => insertEvent("xijian");
  $Admin.event.nextStage = nextStage;
  $Admin.event.finalBoss = finalBoss;
  $Admin.event.insert = insertEvent;
  $Admin.discount = discount;

  onMount(function () {
    paper.style.top = `${document.body.clientHeight}px`;
    paper.style.transition = "0.3s";
    if (!$explore.eventSummoned) {
      $explore.eventSummoned = true;
    }
    $Admin.upload();
    element_explore.onclick = $Admin.save;
  });
  beforeUpdate(function () {
    if (typeof $Explain == "function") {
      $Explain(element_scene).with(Data.scene[$Admin.data.scene]);
      for (let e in element_scene_enermy)
        $Explain(element_scene_enermy[e]).color(Data.enermy[e].color).with({
          name: Data.enermy[e].name,
          detail: Data.enermy[e].intro,
        });
    }
  });

  function install() {
    $explore.enermy = [];
    $explore.offsetY = [0, 0, 0];
    $explore.cursor = [1, 1, 1];
    $explore.dragon = 0;
    $explore.target = [...Array(11).keys()].map((_) => false);
    $explore.event = summonEvent().map((k, i) => {
      return {
        key: k,
        cache: {},
        id: i,
        style: random(),
        detail: event[k].detail,
        type: event[k].type,
      };
    });
    $explore.eventLeft = deepCopy($explore.event);
    $explore.eventList = [0, 1, 2].map((_) => $explore.eventLeft.splice(0, 5));
    $explore.trip.push($Admin.data.scene);
    delete $explore.zagu;
    delete $explore.elite;
    setTimeout(function () {
      $Admin.guide.add("event");
      $Admin.guide.add("valid_event");
    });
  }
  function discount(product) {
    let base = 1;
    if ("carnyx" in $Admin.data.collection) {
      let amount = $Admin.data.collection["carnyx"];
      base *= Math.pow(0.95, amount);
    }
    if ($Admin.data.role == "marisa") {
      base *= 0.9;
    }
    product.forEach((p) => (p.piece = retain(base * p.piece, 0)));
    return product;
  }
  function summonEvent() {
    const eventForm = [
      {
        random: {
          reward: 3,
          selection: 5,
          special: 3,
          shop: 2,
        },
        static: {
          zagu: 6,
          elite: 3,
          itemshop: 1,
          school: 1,
          canteen: 1,
          chest: 5,
          muxiazi: 4,
          bookshop: 1,
          dragon: 1,
          zixuan: 1,
          diaochuang: 1,
          big_chest: 1,
          turntable: 1,
        },
      },
      {
        random: {
          reward: 5,
          selection: 4,
          special: 3,
          shop: 2,
        },
        static: {
          zagu: 6,
          elite: 4,
          itemshop: 1,
          school: 1,
          canteen: 1,
          chest: 4,
          muxiazi: 3,
          dragon: 1,
          zixuan: 1,
          diaochuang: 1,
          yakumo: 1,
          turntable: 1,
        },
      },
      {
        random: {
          reward: 4,
          selection: 4,
          special: 4,
          shop: 2,
        },
        static: {
          zagu: 4,
          elite: 4,
          itemshop: 1,
          school: 1,
          canteen: 1,
          chest: 3,
          muxiazi: 3,
          bookshop: 1,
          dragon: 1,
          zixuan: 1,
          diaochuang: 1,
          turntable: 1,
        },
      },
    ];
    if ($Admin.data.difficulty == "easy") {
      eventForm.forEach((info) => {
        info.zagu--;
        info.elite--;
      });
    }
    if ($Admin.data.difficulty == "hard") {
      eventForm.forEach((info) => {
        info.zagu++;
        info.elite++;
      });
    }
    let res = [];
    let stage = $Admin.data.stage - 1;
    let _event = Object.keys(event).map((key) => {
      return {
        key: key,
        type: event[key].type,
      };
    });
    for (let type in eventForm[stage].random) {
      let l = _event.filter((e) => e.type == type).rd();
      l.splice(0, eventForm[stage].random[type]).map((i) => res.push(i.key));
    }
    for (let key in eventForm[stage].static) {
      [...Array(eventForm[stage].static[key]).keys()].forEach((_) =>
        res.push(key),
      );
    }
    res.rd();
    if ($Admin.data.stage == 1 && !$Admin.data.rule.includes("rule_corkscrew"))
      res.splice(1, 0, "select_boss");
    res.splice(1, 0, "zixuan");
    return res;
  }
  function random() {
    const r = Math.random;
    let rotate = 12 * r() - 6;
    rotate = (Math.abs(rotate) + 3) * (rotate / Math.abs(rotate));
    let x = 20 * r() - 10;
    let y = 20 * r() - 10;
    return `transform:rotate(${rotate}deg)translate(${x}px,${y}px);`;
  }
  function eventHandle(id) {
    if ($explore.event[id].cache.finish)
      msg({ content: "事件已完成，点击 × 关闭" });
    else {
      $Admin.sound("paper");
      if ($Admin.mobile) paper.style.top = `60px`;
      else paper.style.top = `${document.body.clientHeight - 640}px`;
      event_id = id;
    }
  }
  function foldEvent() {
    paper.style.top = `${document.body.clientHeight}px`;
    event_id = false;
    $Admin.sound("paper");
  }
  function eventFinish() {
    $explore.event[event_id].cache.finish = true;
    let _index;
    $explore.eventList.forEach((l, i) => {
      l.forEach((e) => {
        if (e.id == event_id) _index = i;
      });
    });
    if (
      $explore.event[event_id] &&
      ($explore.event[event_id].type == "enermy" ||
        $explore.event[event_id].type == "rule")
    )
      closeEvent(_index);
    foldEvent();
  }
  function eventInfo(key) {
    let info = deepCopy(event[key]);
    if (info.type == "selection") {
      info.name = "未知事件";
      info.detail = "什么都没有，但又隐隐约约感觉到有什么要发生。";
    }
    return info;
  }
  function closeEvent(index) {
    $Admin.sound("close");
    $explore.event[
      $explore.eventList[index][$explore.cursor[index]].id
    ].closed = true;
    let leftEventCount =
      $explore.event.length - $explore.event.filter((e) => e.closed).length;
    if (
      leftEventCount == 9 &&
      !$explore.event.map((e) => e.key).includes("boss")
    ) {
      insertEvent("boss");
    }
    $explore.enermy.length > 0 && $explore.lv++;
    let other = [0, 1, 2].filter((i) => i != index);
    $explore.offsetY[index] -= 1;
    other.forEach((i) => {
      if ($explore.eventLeft.length == 0 && $explore.cursor[i] == 1);
      else if ($explore.cursor[i] == 1) $explore.offsetY[i] += 1;
    });
    setTimeout((_) => {
      animate = false;
      if ($explore.eventLeft.length > 0) {
        $explore.eventList[index].push($explore.eventLeft.rd().shift());
      } else {
        if ($explore.cursor[other[1]] != 0) {
          $explore.eventList[index].push($explore.eventList[other[1]].shift());
          $explore.cursor[other[1]] = 0;
          $explore.offsetY[other[1]] += 1;
        }
        if ($explore.cursor[other[0]] != 0) {
          $explore.eventList[index].push($explore.eventList[other[0]].shift());
          $explore.cursor[other[0]] = 0;
          $explore.offsetY[other[0]] += 1;
        }
      }
      $explore.eventList[index].splice($explore.cursor[index], 1);
      $explore.eventList = $explore.eventList;
      other.forEach((i) => {
        if ($explore.eventLeft.length > 0) {
          $explore.eventList[i] = [
            $explore.eventLeft.rd().shift(),
            ...$explore.eventList[i],
          ];
          $explore.offsetY[i] -= 1;
        } else {
          $explore.cursor[i] = 0;
        }
      });
      $explore.offsetY[index] += 1;
      setTimeout((_) => {
        animate = true;
        $Admin.post(
          "/user/upload",
          { explore: $explore, data: $data },
          (res) => {
            if (res.msg != "OK") console.log("同步失败");
          },
        );
      }, 100);
    }, 400);
  }
  function battle() {
    let amount = $explore.enermy.filter((_, i) => $explore.target[i]).length;
    if (amount < 1) {
      msg({ content: "至少选中一个敌人" });
    } else if (amount > $explore.enermyLimit) {
      msg({ content: `最多只能选中${$explore.enermyLimit}个敌人` });
    } else {
      $Admin.sound("btn");
      $Admin.upload();
      $page = "Battle";
    }
  }
  function summonZagu() {
    let res = [];
    let amount = growth.amount($explore.lv);
    [...Array(amount).keys()].forEach((_) => {
      let _enermy = Data.scene[$Admin.data.scene].zagu.rd()[0];
      if ($Admin.data.rule.includes("rule_corkscrew"))
        _enermy = Data.keys()
          .enermy.filter((e) => Data.enermy[e].type == "zagu")
          .rd()[0];
      if ($explore.zagu) _enermy = $explore.zagu;
      else if ($Admin.data.rule.includes("rule_corkscrew"))
        $explore.zagu = _enermy;
      res.push(_enermy);
    });
    $explore.enermy = [...$explore.enermy, ...res];
    $Admin.guide.add("enermy_list");
  }
  function summonElite() {
    let res = [];
    let amount = $explore.dragon + 1;
    [...Array(amount).keys()].forEach((_) => {
      let _enermy = Data.scene[$Admin.data.scene].elite.rd()[0];
      if ($Admin.data.rule.includes("rule_corkscrew"))
        _enermy = Data.keys()
          .enermy.filter((e) => Data.enermy[e].type == "elite")
          .rd()[0];
      if ($explore.elite) _enermy = $explore.elite;
      else if ($Admin.data.rule.includes("rule_corkscrew"))
        $explore.elite = _enermy;
      res.push(_enermy);
    });
    $explore.enermy = [...$explore.enermy, ...res];
    $Admin.guide.add("enermy_list");
  }
  function summonBoss() {
    let res = [];
    let boss;
    let amount = $explore.dragon + 1;
    if ($Admin.data.stage == 1) boss = $Admin.data.first_boss;
    else boss = $explore.boss;
    if ($Admin.data.rule.includes("rule_corkscrew"))
      boss = Data.keys()
        .enermy.filter(
          (e) => Data.enermy[e].type == "boss" && !Data.enermy[e].unsummonable,
        )
        .rd()[0];
    [...Array(amount).keys()].forEach((_) => res.push(boss));
    $explore.enermy = [...$explore.enermy, ...res];
  }
  function nextStage(scene) {
    $Admin.event.heal(100, true);
    foldEvent();
    if ($Admin.data.stage < 3) {
      $Admin.data.scene = scene;
      $Admin.data.stage++;
      $explore.lv += 10;
      $explore.boss = Data.scene[$Admin.data.scene].boss
        .filter((b) => b != $Admin.data.first_boss)
        .rd()[0];
      install();
      msg({ content: `到达${Data.scene[$Admin.data.scene].name}` });
    } else {
      $page = "Epilog";
    }
  }
  function insertEvent(key) {
    let gate = {
      key: key,
      cache: {},
      id: $explore.event.length,
      style: random(),
      detail: event[key].detail,
      type: event[key].type,
    };
    let max = Math.max(...$explore.eventList.map((l) => l.length));
    let index = $explore.eventList
      .map((_, i) => i)
      .filter((i) => $explore.eventList[i].length == max)[0];
    $explore.eventList[index].push(gate);
    $explore.event.push(gate);
  }
  function finalBoss() {
    foldEvent();
    $Admin.data.scene = "xijian";
    $Admin.data.stage++;
    $explore.lv += 3;
    $explore.enermy.push("yukari");
  }
</script>

<div
  class="body"
  style="--bg:url(/img/scene/r{[...Array(9).keys()].rd()[0]}.jpg)"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
  bind:this={element_explore}
>
  <div class="event-list" bind:this={element_event_list}>
    {#each ["l", "m", "r"] as o, i (i)}
      <div
        class="list-{o}"
        style="bottom:{($explore.offsetY[i] - 1) * 210}px;{animate &&
          'transition: 0.4s'};"
      >
        {#each $explore.eventList[i] as e, ii (ii)}
          <div
            class="event {ii == $explore.cursor[i] && 'cursor'} {ii +
              $explore.offsetY[i] >
              0 &&
              ii + $explore.offsetY[i] < 4 &&
              'show'}"
            style="{animate && 'transition: 0.3s'};"
            index={ii}
          >
            <div
              class="event-body"
              style="--color:var(--{event[e.key].type});{e.style}"
            >
              <txt
                class="title"
                on:click={(_) => ii == $explore.cursor[i] && eventHandle(e.id)}
                >{eventInfo(e.key).name}</txt
              >
              <txt
                class="detail"
                on:click={(_) => ii == $explore.cursor[i] && eventHandle(e.id)}
                >{eventInfo(e.key).detail}</txt
              >
              {#if !event[e.key].unbreakable}
                <div class="event-close">
                  <div>x</div>
                  <div class="range" on:click={(_) => closeEvent(i)}></div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="right">
    <div class="notebook">
      <div class="title">
        <txt>遇敌({$explore.enermy.length})</txt>
        <txt class="battle" on:click={battle}>开战！</txt>
      </div>
      {#each $explore.enermy as e, i (i)}
        {#if i < 11}
          <txt
            class="enermy"
            on:click={(_) => {
              $explore.target[i] = !$explore.target[i];
              $Admin.sound("select");
            }}
            >{$explore.target[i] ? "☑" : "☐"} lv.{$explore.lv}
            {enermy[e].name}</txt
          >
        {/if}
      {/each}
    </div>
    <div class="nexus" on:click={$Admin.menu}>
      <div class="speaker"></div>
      <div class="screen">
        <img
          class="scene_bg"
          bind:this={element_scene}
          src="/img/scene/{$Admin.data.scene}.webp"
        />
        {#each Object.keys($explore.enermy.count()).reverse() as e, i (i)}
          <img
            class="scene_enermy"
            src="/img/enermy/{Data.enermy[e].type}/{e}/portrait.webp"
            style="top:{240 - 340 * window.r()}px;"
            bind:this={element_scene_enermy[e]}
          />
        {/each}
      </div>
    </div>
  </div>
  <div
    class="paper_close"
    on:click={foldEvent}
    style="z-index:{typeof event_id == 'number' ? 1 : -1}"
  ></div>
  <div class="paper" bind:this={paper}>
    <div class="event_fold" on:click={foldEvent}>×</div>
    {#if typeof event_id == "number" && $explore.event[event_id]}
      <img
        src="/img/avatar/{event[$explore.event[event_id].key].avatar}.webp"
      />
      <div class="title">{event[$explore.event[event_id].key].name}</div>
      <svelte:component
        this={eventContent[$explore.event[event_id].key]}
        info={$explore.event[event_id]}
      />
    {/if}
  </div>
  <div class="data" on:click={$Admin.menu}>
    <div class="coin">
      <icon class="icon-coin"></icon>
      <txt>{$Admin.data.coin}</txt>
    </div>
    <div class="item">
      <icon class="icon-left_card"></icon>
      <txt>{Object.values($Admin.data.card).sum()}</txt>
      <icon class="icon-consumables"></icon>
      <txt>{Object.values($Admin.data.collection).sum()}</txt>
    </div>
    <div
      class="avatar"
      style="--percent:{70 -
        ($Admin.data.health / growth.role[$Admin.data.role].health) * 70}px;"
    >
      <img src="/img/role/dairi/{$Admin.data.role}.webp" />
    </div>
  </div>
</div>

<style>
  .body {
    background-image: var(--bg);
    --enermy: rgb(255, 202, 202);
    --selection: rgb(199, 255, 199);
    --shop: rgb(223, 223, 255);
    --rule: rgb(255, 214, 255);
    --reward: rgb(255, 255, 196);
    --game: rgb(255, 228, 177);
    --special: rgb(255 224 240);
    flex-direction: row;
    justify-content: center;
    overflow: hidden;
  }

  .data {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 16px;
    color: #666;
    filter: drop-shadow(0 0 4px #666);
    cursor: pointer;
    text-shadow:
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff;
  }
  .data .avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    overflow: hidden;
  }
  .data .avatar::before {
    content: "";
    position: absolute;
    background-color: red;
    width: 100%;
    height: var(--percent);
  }
  .data .avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #bbb;
    position: absolute;
    left: 5px;
    top: 5px;
  }
  .data .item,
  .data .coin {
    height: 25px;
    position: absolute;
    left: 35px;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
  }
  .data .item {
    width: 180px;
    background-color: #ddddf7;
    border-radius: 0 25px 0 0;
  }
  .data .coin {
    width: 140px;
    top: 25px;
    background-color: #f9d6d6;
    border-radius: 0 0 25px 0;
  }
  .data icon {
    font-size: 20px;
    color: #ac7fb4;
    margin-right: 2px;
    margin-left: 20px;
  }

  .paper_close {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .event_fold {
    position: absolute;
    font-size: 80px;
    top: 0;
    right: 20px;
    z-index: 1;
    font-family: "write";
  }
  .event_fold:hover {
    transform: scale(1.2);
  }
  .paper {
    font-family: "remark";
    color: #555;
    width: 800px;
    height: 640px;
    background: linear-gradient(to bottom, white 29px, #00b0d7 1px);
    margin: auto;
    background-size: 100% 30px;
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 16px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(20px);
    z-index: 1;
  }
  .paper::before {
    content: "";
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 100px;
    height: 100%;
    width: 1px;
    background-color: #db4034;
  }
  .paper::after {
    content: "";
    height: 120px;
    width: 100%;
    background: white;
    position: absolute;
  }
  .paper > .title {
    z-index: 1;
    font-size: 40px;
    margin-top: 100px;
    margin-left: 120px;
  }
  .paper > img {
    width: 90px;
    position: absolute;
    top: 48px;
    left: 0;
    z-index: 1;
    border-radius: 50%;
    border: 4px solid #999;
    margin: 5px;
  }

  .right {
    height: 580px;
    position: relative;
  }
  .notebook {
    position: relative;
    width: 304px;
    height: 400px;
    background-color: #ffffcc;
    box-shadow: 10px 13px 10px 4px rgba(0, 0, 0, 0.2);
    background-image: repeating-linear-gradient(
      #ffab00 0px,
      #ffab00 1px,
      transparent 1px,
      transparent 30px
    );
    background-position: 0 10px;
    background-repeat: repeat-y, no-repeat;
    margin-left: 50px;
    color: #555;
  }
  .notebook:before {
    position: absolute;
    content: "";
    top: 13px;
    left: 8px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    z-index: 1;
    box-shadow:
      inset 0 0 0 10px #ccc,
      30px 0 0 #ccc,
      60px 0 0 #ccc,
      90px 0 0 #ccc,
      120px 0 0 #ccc,
      150px 0 0 #ccc,
      180px 0 0 #ccc,
      210px 0 0 #ccc,
      240px 0 0 #ccc,
      270px 0 0 #ccc;
  }
  .notebook::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 60px;
    background-color: #ffffcc;
  }
  .notebook > .title {
    z-index: 1;
    font-family: "write";
    font-size: 40px;
    margin: 0px 10px;
    margin-top: 30px;
    flex-direction: row;
    justify-content: space-between;
  }
  .notebook > .enermy {
    font-family: "write";
    font-size: 30px;
    line-height: 30px;
    margin-left: 10px;
    cursor: pointer;
  }
  .battle:hover {
    transform: scale(1.2);
    cursor: pointer;
  }

  .event-list {
    flex-direction: row;
    height: 630px;
  }
  .event-list > div {
    flex-direction: column-reverse;
    position: relative;
    width: 210px;
  }
  .event {
    filter: drop-shadow(0 0 6px #666);
    cursor: not-allowed;
    opacity: 0;
  }
  .event-body {
    --other: rgb(200, 229, 255);
    width: 180px;
    height: 180px;
    background-color: var(--color);
    margin: 15px;
    color: #555;
    font-family: write;
    box-sizing: border-box;
    padding: 10px 12px;
    clip-path: none;
  }
  .event .title {
    font-size: 32px;
  }
  .event .detail {
    font-size: 24px;
    height: 100%;
  }
  .event-close {
    position: absolute;
    top: 0;
    right: 0;
    filter: drop-shadow(0px 0px 6px #888);
    font-size: 40px;
    display: none;
    cursor: pointer;
  }
  .event-close > div {
    background-color: var(--color);
    width: 40px;
    height: 40px;
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    box-sizing: border-box;
    padding-left: 4px;
    padding-top: 4px;
  }
  .event-close .range {
    position: absolute;
    width: 80px;
    height: 60px;
    left: -15px;
    top: -10px;
    background-color: transparent;
  }
  .cursor {
    cursor: pointer;
  }
  .cursor:hover {
    transform: scale(1.1);
  }
  .cursor .event-body {
    clip-path: polygon(0 0, 140px 0, 100% 40px, 100% 100%, 0 100%);
  }
  .cursor .event-close {
    display: flex;
  }
  .show {
    opacity: 1;
  }

  .nexus {
    position: absolute;
    bottom: -230px;
    left: 45px;
    margin: 10px auto;
    width: 314px;
    height: 600px;
    border-radius: 80px / 40px;
    border-top: 3px solid #222;
    background: #6d6d6b;
    transform: scale(0.5) rotate(90deg);
    background: linear-gradient(
      to right,
      #6d6d6b 0%,
      #3b3b3c 1%,
      #979797 3%,
      #686868 4%,
      #2e2e2e 100%
    );
  }
  .nexus * {
    margin: 0;
    padding: 0;
  }
  .speaker {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 65px;
    height: 5px;
    background: #333;
    left: 50%;
    margin-left: -33px;
    border-radius: 0 0 6px 6px;
    border: 1px solid #474747;
    border-top: 0;
    box-shadow: inset 0 0 1px black;
  }
  .screen {
    position: absolute;
    left: 17px;
    top: 64px;
    width: 282px;
    height: 467px;
    background: white;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .scene_bg {
    height: 282px;
    transform: rotate(-90deg);
  }
  .scene_enermy {
    position: absolute;
    height: 320px;
    transform: rotate(-90deg);
    right: -50px;
    top: 240px;
  }
</style>
