<script>
  import { fade, scale } from "svelte/transition";
  import { page, setting, explore } from "../store";
  import enermy from "../data/enermy.json";

  let amount = $explore.enermy.length;
  const Explore = deepCopy($explore);
  amount > 6 && Explore.enermy.splice(6);
  let target = Explore.enermy.map((_) => false);

  function battle() {
    let t = target.reduce((a, c) => a + Number(c), 0);
    if (t == 0) msg({ content: "至少选择一个敌人" });
    else if (t > Explore.enermyLimit)
      msg({ content: "你最多只能选择四个敌人" });
    else {
      $page = "Battle";
      $explore.target = target;
    }
  }
</script>

<div
  class="body explore"
  style="background-image:url('/img/scene/shrine.webp')"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
>
  <div class="explore-events">
    <txt>机遇</txt>
  </div>
  <div class="explore-enermys">
    <txt class="title">敌人({amount})</txt>
    {#each Explore.enermy as e, i (i)}
      <div
        class={`enermy ${target[i] && "enermy_selected"}`}
        on:click={(_) => (target[i] = !target[i])}
      >
        <img src={`/img/enermy/${enermy[e].type}/${e}/icon.webp`} />
        <div class="enermy-info">
          <txt><span>lv.{Explore.lv}</span>{enermy[e].name}</txt>
          <txt>{enermy[e].detail}</txt>
        </div>
        <div class={`enermy-type enermy_${enermy[e].type}`} />
      </div>
    {/each}
    <txt class="btn" on:click={battle}>战斗</txt>
  </div>
</div>

<style>
  .btn {
    color: white;
    text-shadow: 0 0 3px #666, 0 0 3px #666, 0 0 3px #666, 0 0 3px #666,
      0 0 3px #666, 0 0 3px #666, 0 0 3px #666;
    font-family: title;
    font-size: 28px;
    cursor: pointer;
    transition: 0.2s;
    line-height: 36px;
  }
  .btn:hover {
    transform: scale(1.1);
  }
  .btn:active {
    text-shadow: 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff,
      0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff;
  }

  .explore {
    flex-direction: row;
  }
  .explore > div {
    width: 280px;
    height: 560px;
    padding: 0px 20px;
  }
  .title {
    width: 280px;
    text-align: center;
    display: block;
    color: white;
    font-size: 20px;
    text-shadow: 0 0 2px #666, 0 0 2px #666, 0 0 2px #666, 0 0 2px #666,
      0 0 2px #666, 0 0 2px #666, 0 0 2px #666;
    height: 40px;
  }
  .explore-enermys {
    align-items: center;
  }

  .enermy {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    width: 280px;
    height: 70px;
    border-radius: 10px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
    transition: 0.3s;
    cursor: pointer;
  }
  .enermy:hover {
    background: rgba(255, 255, 255, 0.9);
  }
  .enermy > img {
    margin-left: 6px;
    border-radius: 50%;
    height: 60px;
  }
  .enermy-info {
    display: grid;
    align-content: space-evenly;
    height: 60px;
  }
  .enermy-info > txt:nth-child(1) {
    font-size: 18px;
    color: #790e00;
    font-family: normal;
    font-weight: bold;
  }
  .enermy-info > txt:nth-child(2) {
    font-size: 14px;
    color: #666;
    width: 170px;
    font-family: remark;
  }

  .enermy-type {
    width: 24px;
    height: 80px;
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .enermy span {
    color: white;
    text-shadow: 0 0 2px #666, 0 0 2px #666, 0 0 2px #666, 0 0 2px #666,
      0 0 2px #666, 0 0 2px #666, 0 0 2px #666;
    height: 40px;
    font-size: 16px;
    margin-right: 5px;
  }
  .enermy_selected {
    box-shadow: 0 0 6px 4px #ff4c4c;
    background: rgba(255, 255, 255, 0.9);
  }
  .enermy_normal {
    background-color: #cdcdcd;
  }
  .enermy_elite {
    background-color: rgb(227 182 212);
  }
  .enermy_boss {
    background-color: #ffec7d;
  }
</style>
