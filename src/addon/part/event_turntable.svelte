<script>
  import { Admin } from "../../store";

  export let info;
  if (!info.cache.cost) info.cache.cost = 100;

  let rotate = 0;

  const position = [
    {
      x: 50,
      y: 0,
    },
    {
      x: 35.4,
      y: -35.4,
    },
    {
      x: 0,
      y: -50,
    },
    {
      x: -35.4,
      y: -35.4,
    },
    {
      x: -50,
      y: 0,
    },
    {
      x: -35.4,
      y: 35.4,
    },
    {
      x: 0,
      y: 50,
    },
    {
      x: 35.4,
      y: 35.4,
    },
  ];
  const rewards = [
    {
      name: "谢谢惠顾",
      handle: _void,
      style: "width: 120px;",
    },
    {
      name: "谢谢惠顾",
      handle: _void,
      style: "transform: rotate(-45deg);width: 120px;",
    },
    {
      name: "蓝色收藏品",
      handle: (_) => $Admin.event.getCollection("blue"),
      style: "writing-mode: vertical-lr;",
    },
    {
      name: "获得符卡",
      handle: $Admin.event.getSpellcard,
      style: "transform: rotate(45deg);width: 120px;",
    },
    {
      name: "获得装备",
      handle: $Admin.event.getEquipment,
      style: "width: 120px;",
    },
    {
      name: "蓝色收藏品",
      handle: (_) => $Admin.event.getCollection("blue"),
      style: "transform: rotate(-45deg);width: 120px;",
    },
    {
      name: "绿色收藏品",
      handle: (_) => $Admin.event.getCollection("green"),
      style: "writing-mode: vertical-lr;",
    },
    {
      name: "谢谢惠顾",
      handle: _void,
      style: "transform: rotate(45deg);width: 120px;",
    },
  ];

  function go() {
    if ($Admin.data.coin >= info.cache.cost) {
      $Admin.data.coin -= info.cache.cost;
      info.cache.cost = retain(info.cache.cost * 1.4, 0);
      rotate += 720 + Math.floor(Math.random() * 8) * 45;
      let index = 7 - ((rotate - 180) % 360) / 45;
      setTimeout(rewards[index].handle, 1600);
    } else msg({ content: "硬币不足" });
  }
</script>

<div class="content">
  <txt>{info.detail}目前还有{$Admin.data.coin}硬币。</txt>
  <div class="turntable">
    {#each rewards as r, i (i)}
      <div class="reward">
        <txt
          style="left:{150 + position[i].x * 2.3 - 25}px;top:{150 +
            position[i].y * 2.3 -
            16}px;{r.style}">{r.name}</txt
        >
      </div>
    {/each}
    <div class="btn" on:click={go}>
      <div class="cursor" style="transform:rotate({rotate}deg)"></div>
      <txt class="go">{info.cache.cost}</txt>
    </div>
  </div>
</div>

<style>
  .content {
    z-index: 1;
    width: 600px;
    height: 500px;
    margin: auto;
    font-size: 20px;
    line-height: 30px;
  }
  txt {
    position: relative;
    top: 2px;
    margin-left: 5px;
  }

  .turntable {
    width: 300px;
    height: 300px;
    position: relative;
    margin-left: 140px;
  }
  .reward {
    width: 120px;
    height: 120px;
    position: absolute;
  }
  .reward > txt {
    line-height: 32px;
    font-size: 24px;
    margin: auto;
    text-align: justify;
    text-align-last: justify;
  }
  .btn {
    width: 90px;
    height: 90px;
    position: absolute;
    border: 5px solid #666;
    background-color: white;
    border-radius: 50%;
    left: 141px;
    top: 149px;
    align-items: center;
    justify-content: center;
    transform: scale(0.8);
    cursor: pointer;
  }
  .btn .cursor {
    position: absolute;
    width: 90px;
    height: 90px;
    background-color: #666;
    clip-path: polygon(0 0, 45px 0, 0 45px);
    transition: 1.5s;
  }
  .btn .go {
    margin: 0;
    font-size: 28px;
    width: 80px;
    text-align: center;
  }
</style>
