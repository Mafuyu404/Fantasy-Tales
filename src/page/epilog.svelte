<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { Explain, archive, Admin, setting, explore, page } from "../store";

  const statistics = finalStatistics();
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

  function finalStatistics() {
    let battle_data = $Admin.data.statistics;
    if ($Admin.data.chance.amount < 0) battle_data.pop();
    let res = {};
    for (let i in battle_data[0]) {
      let key = i.split("_");
      key.shift();
      res[key.join("_")] = battle_data.map((d) => d[i]).sum();
    }
    res.max_damage = Math.max(...battle_data.map((d) => d.battle_max_damage));
    res.max_hurt = Math.max(...battle_data.map((d) => d.battle_max_hurt));
    res.coin_reward_total = $Admin.data.coin_reward_total;
    res.battle_count = battle_data.length;
    res.max_lv = $explore.lv;
    res.collection_reward_total = Object.unCount($Admin.data.collection).length;
    record(res);
    return res;
  }
  function back() {
    $explore = {};
    localStorage.removeItem("explore");
    $page = "Index";
  }
  function record(battle_data) {
    let res = {
      battle_data: battle_data,
      player_data: deepCopy($Admin.data),
      time: getNowDate(),
      id: retain(Math.random() * 100000, 0),
      color: [
        "red",
        "green",
        "blue",
        "purple",
        "gold",
        "orange",
        "pink",
      ].rd()[0],
    };
    res.name = `${$Admin.data.chance.amount < 0 ? "惨败" : "通关"}档案-${res.id}`;
    $archive.record.push(res);
    $archive = $archive;
    localStorage.setItem("archive", JSON.stringify($archive));
  }
  function getNowDate() {
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取当前年
    var mon = myDate.getMonth() + 1; //获取当前月
    var date = myDate.getDate(); //获取当前日
    var hours = myDate.getHours(); //获取当前小时
    var minutes = myDate.getMinutes(); //获取当前分钟
    var seconds = myDate.getSeconds(); //获取当前秒
    var now =
      year +
      "-" +
      mon +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return now;
  }
</script>

<div
  class="body epilog"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
>
  <div class="left">
    <txt class="title">{$Admin.data.chance.amount < 0 ? "惨败" : "通关"}</txt>
    <img
      src="/img/role/{$setting.resource}/{$Admin.data.chance.amount < 0
        ? 'dead'
        : 'win'}/{$Admin.data.role}.webp"
    />
  </div>
  <div class="right">
    <div class="statistics">
      {#each Object.keys(remark) as s, i (i)}
        <div>
          <txt>{remark[s]}</txt>
          <txt>{window.retain(statistics[s], 0)}</txt>
        </div>
      {/each}
    </div>
    <div class="btn" on:click={back}>回到标题界面</div>
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
  }
  .epilog {
    flex-direction: row;
  }
  .left,
  .right {
    align-items: center;
    margin: 20px;
  }
  .right > * {
    margin: 10px;
  }

  .left img {
    height: 400px;
  }
  .title {
    text-align: center;
    color: white;
    font-size: 64px;
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

  .statistics > div {
    flex-direction: row;
    justify-content: space-between;
    font-family: write;
    font-size: 30px;
    width: 300px;
  }

  .btn {
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
  .btn:hover {
    transform: scale(1.1);
    opacity: 1;
  }
  .btn:active {
    text-shadow:
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff;
  }
</style>
