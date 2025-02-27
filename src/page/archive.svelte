<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import {
    Explain,
    archive,
    Admin,
    setting,
    explore,
    page,
    data,
  } from "../store";
  import Card from "../addon/card.svelte";
  import Data from "../data/data";
  import unlock from "../data/unlock";
  import achievement from "../data/achievement";

  const remark = {
    damage_total: "造成伤害总量",
    damage_frequency: "造成伤害总次数",
    max_damage: "造成的最高伤害",
    hurt_total: "受到伤害总量",
    hurt_frequency: "受到伤害总次数",
    max_hurt: "受到的最高伤害",
    cost_total: "消耗灵力总数",
    punch_count: "打出手牌总数",
    battle_count: "战斗总次数",
    round_total: "回合总数",
    defeat_total: "击败敌人总数",
    max_lv: "敌人最高等级",
    coin_reward_total: "获得硬币总数",
    collection_reward_total: "获得收藏品总数",
  };
  const element_tip = [];
  let element_paper;
  let element_record_name;
  let selected_record;
  let record_index = "statistics";
  let record_source = "user";
  const element_item = [];
  let item_key = [];
  const element_container = {};
  const item = {};
  Object.assign(item, Data.collection);
  Object.assign(item, Data.equipment);
  Object.assign(item, Data.souvenir);
  Object.assign(item, Data.rule);
  let records;
  let loading;
  const unlocked = unlock.get($archive);

  userArchive();

  onMount(function () {
    sessionStorage.removeItem("win_record");
    element_paper.style.top = `${document.body.clientHeight}px`;
    element_paper.style.transition = "0.3s";
  });
  afterUpdate((_) => {
    element_tip.forEach((e, i) => {
      if (e) e.onmousedown = (_) => seleteRecord(i);
      if (e) e.ontouchstart = (_) => seleteRecord(i);
    });
    for (let element in element_container) {
      if (element_container[element]) {
        element_container[element].ontouchstart = function (event) {
          let originX = event.touches[0].pageX;
          let scrollTop = element_container[element].scrollTop;
          element_container[element].ontouchmove = function (e) {
            let x = e.touches[0].pageX;
            element_container[element].scrollTop = scrollTop + x - originX;
          };
        };
        element_item.forEach((e, i) => {
          if (item_key[i]) {
            let info = deepCopy(item[item_key[i]]);
            if (Data.keys().rule.includes(item_key[i]))
              info.detail = info.effect;
            item_key[i] && $Explain(e).color(item[item_key[i]].type).with(info);
          }
        });
      }
    }
  });

  function foldPaper() {
    $Admin.sound("paper");
    element_paper.style.top = `${document.body.clientHeight}px`;
    selected_record = null;
  }
  function seleteRecord(i) {
    $Admin.sound("paper");
    element_paper.style.top = `${document.body.clientHeight - 640}px`;
    if ($Admin.mobile)
      element_paper.style.top = `${document.body.clientWidth / $Admin.mobile - 640}px`;
    selected_record = records.length - i - 1;
    let player_data = records[selected_record].player_data;
    item_key = Object.keys(player_data.collection);
    player_data.equipment && item_key.push(player_data.equipment);
    player_data.souvenir && item_key.push(player_data.souvenir);
    player_data.rule && item_key.push(...player_data.rule);
  }
  function getCommunityArchive() {
    record_index = "statistics";
    record_source = "community";
    let local = sessionStorage.getItem("win_record");
    if (local != null) {
      records = JSON.parse(local);
    } else {
      loading = true;
      records = [];
      $Admin.post("/community/win_record", {}, (res) => {
        record_source = "community";
        loading = false;
        res = res.map((r) => {
          r._time = new Date(r.time).getTime();
          return r;
        });
        res = res.sort(sortBy("_time", 1));
        records = res;
        sessionStorage.setItem("win_record", JSON.stringify(res));
      });
    }
  }
  function userArchive() {
    record_index = "statistics";
    record_source = "user";
    records = $archive.record.map((r) => {
      r.user = $Admin.user;
      return r;
    });
  }
  function sortBy(attr, rev) {
    //attr：根据该属性排序；rev：升序1或降序-1，不填则默认为1
    if (rev == undefined) {
      rev = 1;
    } else {
      rev ? 1 : -1;
    }
    return function (a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    };
  }
  function rename() {
    if (
      element_record_name.value.length < 7 &&
      element_record_name.value.length > 0
    ) {
      let name = $archive.record[selected_record].name.split("-");
      $archive.record[selected_record].name =
        `${name[0]}-${element_record_name.value}`;
      loading = true;
      setTimeout((_) => {
        loading = false;
        userArchive();
      }, 1000);
    } else msg({ content: "太长或太短" });
  }
  function deleteRecord() {
    $archive.record.splice(selected_record, 1);
    $Admin.upload();
    foldPaper();
    userArchive();
    msg({ content: "已删除" });
  }
  function trial() {
    $data = records[selected_record].player_data;
    $data.trial = true;
    $explore = {
      enermy: ["yukari"],
      lv: records[selected_record].battle_data.max_lv,
      target: [true],
    };
    $page = "Battle";
  }
</script>

<div
  class="body archive"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
>
  <div
    class="paper_close"
    on:click={foldPaper}
    style="display:{typeof selected_record == 'number' ? 'block' : 'none'}"
  ></div>
  <div class="paper" bind:this={element_paper}>
    <div class="event_fold" on:click={foldPaper}>×</div>
    {#if typeof selected_record == "number"}
      <div class="title">
        <txt>{records[selected_record].name}</txt>
        <span>&ensp;选项个数: {records[selected_record].player_data.sugar}</span
        >
      </div>
      <div class="record_body">
        <div class="record_index">
          <txt
            class={record_index == "statistics" && "selected"}
            on:click={(_) => (record_index = "statistics")}>统计</txt
          >
          <txt
            class={record_index == "card" && "selected"}
            on:click={(_) => (record_index = "card")}>牌库</txt
          >
          <txt
            class={record_index == "item" && "selected"}
            on:click={(_) => (record_index = "item")}>物品</txt
          >
          <br />
          <txt
            class={record_index == "trial" && "selected"}
            on:click={(_) => (record_index = "trial")}>试用</txt
          >
          {#if record_source == "user"}
            <txt
              class={record_index == "rename" && "selected"}
              on:click={(_) => (record_index = "rename")}>命名</txt
            >
            <txt
              class={record_index == "delete" && "selected"}
              on:click={(_) => (record_index = "delete")}>删除</txt
            >
          {/if}
        </div>
        {#if record_index == "statistics"}
          <div class="statistics">
            {#each Object.keys(remark) as s, i (i)}
              <div>
                <txt>{remark[s]}</txt>
                <txt
                  >{window.retain(
                    records[selected_record].battle_data[s],
                    0,
                  )}</txt
                >
              </div>
            {/each}
          </div>
        {/if}
        {#if record_index == "card"}
          <div class="card container" bind:this={element_container.card}>
            {#each Object.unCount(records[selected_record].player_data.card) as c, i (i)}
              <Card key={c} />
            {/each}
          </div>
        {/if}
        {#if record_index == "item"}
          <div class="item container" bind:this={element_container.item}>
            {#each item_key as c, i (i)}
              <div
                bind:this={element_item[i]}
                style="background-color:var(--{item[c].type})"
              >
                <icon class="icon-{c}"></icon>
                {#if records[selected_record].player_data.collection[c] > 1}
                  <txt>{records[selected_record].player_data.collection[c]}</txt
                  >
                {/if}
              </div>
            {/each}
          </div>
        {/if}
        {#if record_index == "rename"}
          <div class="rename">
            <txt>为这个档案取个名字，最多六个字。</txt>
            <txt
              >{">"}<input
                type="text"
                bind:this={element_record_name}
              />{"<"}</txt
            >
            <br />
            {#if loading}
              <img class="loading" src="/img/loading.gif" />
            {:else}
              <txt class="btn" on:click={rename}>确定</txt>
            {/if}
          </div>
        {/if}
        {#if record_index == "delete"}
          <div class="delete">
            <txt>删除了就永远回不来了，真的。</txt>
            <br />
            <txt class="btn" on:click={deleteRecord}>确认删除</txt>
          </div>
        {/if}
        {#if record_index == "trial"}
          <div class="trial">
            <txt>可以使用该档案的最终数据与最终BOSS战斗。</txt>
            <txt>试用过程中并不会解锁角色的符卡。</txt>
            <br />
            <div class="btn" on:click={trial}>开始</div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="left">
    <div class="record_source">
      <txt class={record_source == "user" && "selected"} on:click={userArchive}
        >我的档案</txt
      >
      <txt
        class={record_source == "community" && "selected"}
        on:click={getCommunityArchive}>社区档案</txt
      >
    </div>
    <div class="records container" bind:this={element_container.record}>
      {#if records.length == 0}
        {#if loading}
          <img class="loading" src="/img/loading.gif" />
          <txt
            style="font-size:30px;font-family:remark;color:#555;text-align:center;"
            >获取中</txt
          >
        {:else}
          <txt style="font-size:30px;font-family:remark;color:#555;"
            >尚无游玩记录</txt
          >
        {/if}
      {/if}
      {#each window.deepCopy(records).reverse() as record, i (i)}
        <div class="tip" bind:this={element_tip[i]}>
          <img src="/img/role/dairi/{record.player_data.role}.webp" />
          <div>
            <txt>{record.name}</txt>
            <txt class="time"
              >{record.player_data.chance.name} • {record.user}</txt
            >
            <txt class="time">{record.time}</txt>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="right">
    <txt class="achievements_head"
      >成就 ({unlocked.achievement.length}/{Data.keys().achievement
        .length})</txt
    >
    <div class="achievements container">
      {#each Data.keys($archive).achievement as a, i (i)}
        <div class="achievement">
          <div class="achievement_body">
            <icon
              style="background-color:var(--{unlocked.achievement.includes(a)
                ? Data.split()[Data.achievement[a].icon].type
                : 'gray'})"
              class="icon-{unlocked.achievement.includes(a)
                ? Data.achievement[a].icon
                : 'logo'}"
            ></icon>
            <div>
              <txt class="name">{Data.achievement[a].name}</txt>
              <txt class="detail">{Data.achievement[a].detail}</txt>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .body {
    --bg: #ccc;
    background-color: #f5f9f4;
    background-size:
      25px 25px,
      25px 25px;
    background-image: linear-gradient(90deg, var(--bg) 1px, transparent 2px),
      linear-gradient(0, var(--bg) 1px, transparent 2px);
    --blue: rgb(103, 186, 255);
    --purple: #c84df0;
    --green: #60d560;
    --red: #e55c5c;
    --gold: #ffe661;
    --gray: rgb(128, 128, 128);
  }
  .archive {
    flex-direction: row;
  }
  .container {
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .container::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  input {
    font-size: 18px;
    line-height: 30px;
    font-family: remark;
    width: 108px;
    border: none;
    background-color: transparent;
    padding: 0;
    text-align: center;
  }
  input:focus {
    outline: none;
  }
  .left,
  .right {
    align-items: center;
    margin: 10px;
    width: 370px;
  }

  .rename,
  .delete,
  .trial {
    font-size: 18px;
    line-height: 30px;
  }

  .achievements {
    padding: 10px 20px;
    height: 560px;
  }
  .achievement {
    filter: drop-shadow(0 0 4px #777);
    margin: 5px;
  }
  .achievement_body {
    flex-direction: row;
    width: 320px;
    height: 70px;
    background-color: white;
    font-family: remark;
    clip-path: polygon(20px 0, 320px 0, 320px 50px, 300px 70px, 0 70px, 0 20px);
  }
  .achievement icon {
    width: 70px;
    height: 70px;
    font-size: 48px;
    line-height: 70px;
    text-align: center;
    color: white;
    --shadow: rgba(119, 119, 119, 0.5);
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
    flex-shrink: 0;
    margin-right: 8px;
  }
  .achievement .name {
    color: #666;
    font-size: 18px;
    margin-top: 5px;
  }
  .achievement .detail {
    color: #888;
    font-size: 14px;
  }

  .loading {
    width: 200px;
    mix-blend-mode: darken;
  }

  .record_source {
    flex-direction: row;
  }
  .achievements_head,
  .record_source txt {
    border-bottom: 3px solid transparent;
    font-size: 24px;
    color: #666;
    margin: 12px 0px;
    padding: 5px 20px;
    font-family: title;
    cursor: pointer;
  }
  .record_source .selected {
    border-color: #555;
  }

  .record_body {
    flex-direction: row;
  }
  .record_index {
    width: 140px;
    height: 250px;
    padding-left: 20px;
    font-size: 24px;
    line-height: 30px;
  }
  .record_index > txt {
    cursor: pointer;
  }
  .record_index > txt.selected:after,
  .record_index > txt:hover:after {
    content: " >";
  }

  .statistics > div {
    flex-direction: row;
    justify-content: space-between;
    font-size: 18px;
    line-height: 30px;
    width: 300px;
  }
  .item,
  .card {
    flex-wrap: wrap;
    flex-direction: row;
    align-content: flex-start;
    justify-content: center;
    width: 1045px;
    height: 450px;
    --shadow: #77777768;
  }
  .item icon {
    margin: auto;
    font-size: 36px;
    color: white;
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
  }
  .item > div {
    width: 48px;
    height: 48px;
    margin: 4px;
    border-radius: 50%;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: 0.2s;
    filter: drop-shadow(0 0 3px rgba(136, 136, 136, 0.859));
  }
  .item txt {
    font-size: 16px;
    position: absolute;
    right: -12px;
    bottom: -4px;
    font-family: title;
    color: white;
    text-shadow:
      0 0 3px #888,
      0 0 3px #888,
      0 0 3px #888,
      0 0 3px #888,
      0 0 3px #888,
      0 0 3px #888,
      0 0 3px #888;
    text-align: center;
    width: 32px;
  }
  .item > div:hover {
    transform: scale(1.1);
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
    cursor: pointer;
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
    flex-direction: row;
    align-items: baseline;
  }
  .paper > .title > span {
    font-size: 20px;
  }

  .records {
    padding: 10px 20px;
    height: 560px;
  }
  .tip {
    flex-shrink: 0;
    --width: 320px;
    flex-direction: row;
    height: 76px;
    width: var(--width);
    align-items: center;
    color: #666;
    font-family: remark;
    font-size: 18px;
    box-sizing: border-box;
    background-image: radial-gradient(
        circle at 1px 8px,
        transparent 6px,
        white 6px,
        white 0px
      ),
      radial-gradient(
        circle at calc(var(--width) / 2) 8px,
        transparent 6px,
        white 6px,
        white 0px
      );
    background-size: calc(var(--width) / 2) 15px;
    background-position:
      0 0,
      calc(var(--width) / 2) 0;
    background-repeat: no-repeat repeat;
    transition: 0.3s;
    cursor: pointer;
    filter: drop-shadow(0 0 4px #777);
    padding-left: 10px;
    margin: 5px;
  }
  .tip:hover {
    transform: scale(1.1);
  }
  .tip img {
    height: 48px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .tip .time {
    font-size: 14px;
    color: #888;
  }

  .btn {
    font-size: 40px;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
  .btn:hover {
    font-size: 50px;
  }
</style>
