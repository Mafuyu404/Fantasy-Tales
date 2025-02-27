<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { Explain, archive, Admin } from "../store";
  import buff from "../data/buff";
  import collection from "../data/collection.json";
  import equipment from "../data/equipment.js";
  import souvenir from "../data/souvenir.json";
  import spellcard from "../data/spellcard.js";
  import consumable from "../data/consumable.json";
  import basecard from "../data/basecard.js";
  import role from "../data/role.json";
  import story from "../data/story.json";
  import Card from "../addon/card.svelte";
  import growth from "../data/growth";
  import Data from "../data/data";
  import unlock from "../data/unlock";

  let index = "role";
  let selected = null;
  let selected_role = "reimu";
  const enermy_option = {
    type: "zagu",
    difficulty: "easy",
    lv: 1,
    display: {
      type: {
        zagu: "杂鱼",
        elite: "强敌",
        boss: "BOSS",
      },
      difficulty: {
        easy: "轻松",
        normal: "平实",
        hard: "紧张",
      },
    },
  };
  const info = {
    buff,
    collection,
    equipment,
    souvenir,
    spellcard,
    role,
    consumable,
    basecard,
  };
  const unlocked = unlock.get($archive);
  const element_collection = [];
  const element_equipment = [];
  const element_souvenir = [];
  const element_consumable = [];
  const element_role = [];
  const element_container = {};
  const element_enermy = [];
  let element_lv;

  onMount((_) => {});
  beforeUpdate((_) => {
    element_collection.forEach((e, i) => {
      let key = Data.keys().collection[i];
      let info;
      if (unlocked.collection.includes(key)) info = Data.collection[key];
      else info = unlock_remark(key);
      $Explain(e).color(Data.collection[key].type).with(info);
      if (e)
        e.onclick = function () {
          if (unlocked.collection.includes(key)) selected = key;
        };
    });
    element_equipment.forEach((e, i) => {
      let key = Data.keys().equipment[i];
      let info;
      if (unlocked.equipment.includes(key)) info = Data.equipment[key];
      else info = unlock_remark(key);
      $Explain(e).color("gold").with(info);
      if (e)
        e.onclick = function () {
          if (unlocked.equipment.includes(key)) selected = key;
        };
    });
    element_souvenir.forEach((e, i) => {
      let key = Data.keys().souvenir[i];
      let info;
      if (unlocked.souvenir.includes(key)) info = Data.souvenir[key];
      else info = unlock_remark(key);
      $Explain(e).color("purple").with(info);
      if (e)
        e.onclick = function () {
          if (unlocked.souvenir.includes(key)) selected = key;
        };
    });
    element_consumable.forEach((e, i) => {
      let key = Object.keys(buff)[i];
      $Explain(e).with(buff[key]);
    });
    element_role.forEach((e, i) => {
      let key = Object.keys(role)[i];
      let info = deepCopy(role[key]);
      if (!$archive.unlocked.role.includes(key))
        info.detail = `解锁条件：${info.unlock}`;
      $Explain(e).with(info);
      if (e)
        e.onclick = (_) => {
          if ($archive.unlocked.role.includes(key)) selected_role = key;
        };
    });
  });
  afterUpdate((_) => {
    for (let element in element_container) {
      if (element_container[element])
        element_container[element].ontouchstart = function (event) {
          let originX = event.touches[0].pageX;
          let scrollTop = element_container[element].scrollTop;
          element_container[element].ontouchmove = function (e) {
            let x = e.touches[0].pageX;
            element_container[element].scrollTop = scrollTop + x - originX;
          };
        };
    }
    element_enermy.forEach((e, i) => {
      let key = Data.keys().enermy.filter(
        (ee) => Data.enermy[ee].type == enermy_option.type,
      )[i];
      Data.enermy[key] &&
        $Explain(e).color(Data.enermy[key].color).with(Data.enermy[key]);
    });
    if (element_lv) {
      if (!$Admin.mobile)
        element_lv.onmousedown = function (event) {
          let offset = enermy_option.lv;
          let x = event.x;
          let y = event.y;
          window.onmousemove = function (e) {
            let lv = Math.floor(offset + (e.x - x) / 2);
            if (lv <= 99 && lv >= 0) {
              enermy_option.lv = lv + 1;
              element_lv.style.left = `${offset * 2 + e.x - x}px`;
            }
          };
          window.onmouseup = function () {
            window.onmousemove = null;
          };
        };
      else
        element_lv.ontouchstart = function (event) {
          let offset = enermy_option.lv;
          let y = event.touches[0].pageY;
          window.ontouchmove = function (e) {
            let lv = Math.floor(
              offset + (e.touches[0].pageY - y) / 2 / $Admin.mobile,
            );
            if (lv <= 99 && lv >= 0) {
              enermy_option.lv = lv + 1;
              element_lv.style.left = `${offset * 2 + (e.touches[0].pageY - y) / $Admin.mobile}px`;
            }
          };
          window.ontouchend = function () {
            window.ontouchmove = null;
          };
        };
    }
  });

  function Index(i) {
    selected = null;
    index = i;
    enermy_option.lv = 1;
    $Admin.sound("paper");
  }
  function difficulty(e, key) {
    if (key == "easy") window.exploreLevelScale = 1;
    if (key == "normal") window.exploreLevelScale = 1.5;
    if (key == "hard") window.exploreLevelScale = 2;
    let state = Data.enermy[e].growth(enermy_option.lv);
    return {
      health: window.retain(state.health, 1),
      speed: window.retain(state.speed, 1),
    };
  }
  function unlock_remark(key) {
    let source = Data.split();
    return {
      name: source[key].name,
      detail: `解锁需达成成就\n[${Data.achievement[source[key].unlock].name}] :\n${Data.achievement[source[key].unlock].detail}`,
    };
  }
</script>

<div class="body" in:fade={{ duration: 250 }} out:fade={{ duration: 250 }}>
  <div class="index">
    <txt class={index == "role" && "selected"} on:click={(_) => Index("role")}
      >角色</txt
    >
    <txt
      class={index == "collection" && "selected"}
      on:click={(_) => Index("collection")}>收藏品</txt
    >
    <txt
      class={index == "equipment" && "selected"}
      on:click={(_) => Index("equipment")}>装备</txt
    >
    <txt
      class={index == "souvenir" && "selected"}
      on:click={(_) => Index("souvenir")}>纪念品</txt
    >
    <txt
      class={index == "basecard" && "selected"}
      on:click={(_) => Index("basecard")}>通式</txt
    >
    <txt
      class={index == "enermy" && "selected"}
      on:click={(_) => Index("enermy")}>敌人</txt
    >
  </div>
  <div class="main">
    {#if index == "collection"}
      <div
        class="collections container list"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#each Data.keys().collection as c, i (i)}
          <div
            class={selected == c && "selected"}
            style="background-color:var(--{unlocked.collection.includes(c)
              ? Data.collection[c].type
              : 'gray'});"
            bind:this={element_collection[i]}
          >
            <icon class="icon-{unlocked.collection.includes(c) ? c : 'logo'}"
            ></icon>
          </div>
        {/each}
      </div>
    {/if}
    {#if index == "souvenir"}
      <div
        class="souvenirs container list"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#each Data.keys().souvenir as s, i (i)}
          <div
            class={selected == s && "selected"}
            style="background-color:var(--{unlocked.souvenir.includes(s)
              ? 'purple'
              : 'gray'});"
            bind:this={element_souvenir[i]}
          >
            <icon class="icon-{unlocked.souvenir.includes(s) ? s : 'logo'}"
            ></icon>
          </div>
        {/each}
      </div>
    {/if}
    {#if index == "equipment"}
      <div
        class="equipments container list"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#each Data.keys().equipment as s, i (i)}
          <div
            class={selected == s && "selected"}
            style="background-color:var(--{unlocked.equipment.includes(s)
              ? 'gold'
              : 'gray'});"
            bind:this={element_equipment[i]}
          >
            <icon class="icon-{unlocked.equipment.includes(s) ? s : 'logo'}"
            ></icon>
          </div>
        {/each}
      </div>
    {/if}
    {#if index == "buff"}
      <div
        class="consumables container list"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#each Object.keys(buff) as s, i (i)}
          <div
            class={selected == s && "selected"}
            on:click={(_) => (selected = s)}
            style="background-color:var(--{buff[s].color});"
            bind:this={element_consumable[i]}
          >
            <icon class="icon-{s}"></icon>
          </div>
        {/each}
      </div>
    {/if}
    {#if index == "role"}
      <div
        class="role"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
      >
        <div class="role_list">
          {#each Data.keys().role.filter((r) => !Data.role[r].unable) as r, i (i)}
            <img
              src="/img/role/dairi/{r}.webp"
              class={!$archive.unlocked.role.includes(r) && "locked"}
              bind:this={element_role[i]}
            />
          {/each}
        </div>
        <div class="left">
          <div class="photo">
            <img src="/img/role/dairi/{selected_role}.webp" />
          </div>
          <div class="name">{role[selected_role].name}</div>
          <div class="state">
            <txt>生命上限:&ensp;{growth.role[selected_role].health}</txt>
            <txt>灵力上限:&ensp;{growth.role[selected_role].power}</txt>
            <txt>基础速度:&ensp;{growth.role[selected_role].speed}</txt>
          </div>
          <txt class="title">天赋</txt>
          <div class="talent">{role[selected_role].talent}</div>
        </div>
        <div class="right">
          <txt class="title"
            >符卡 ({unlocked.spellcard.filter(
              (k) => Data.spellcard[k].role == selected_role,
            ).length}/{Object.keys(spellcard).filter(
              (s) => spellcard[s].role == selected_role,
            ).length})</txt
          >
          <div
            class="spellcard container"
            bind:this={element_container.spellcard}
          >
            <div>
              {#each Data.keys().spellcard.filter((s) => spellcard[s].role == selected_role) as s, i (i)}
                <Card
                  key={s}
                  interim={spellcard[s].interim}
                  cover={!unlocked.spellcard.includes(s) && {
                    name: "未知",
                    detail: `击败任意BOSS\n可获取随机新卡牌`,
                  }}
                />
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}
    {#if index == "basecard"}
      <div class="basecard container" bind:this={element_container.basecard}>
        {#each Data.keys().basecard as b, i (i)}
          <div>
            <Card
              key={b}
              action={(_) => null}
              cover={!unlocked.basecard.includes(b) && {
                name: "未知",
                detail: `在铃奈庵购买妖魔书\n可获取随机新卡牌`,
              }}
            />
          </div>
        {/each}
      </div>
    {/if}
    {#if index == "enermy"}
      <div
        class="enermy"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
      >
        <div class="filter">
          {#each Object.keys(enermy_option.display) as option, i (i)}
            {#each Object.keys(enermy_option.display[option]) as key, i (i)}
              <txt
                on:click={(_) => {
                  enermy_option[option] = key;
                }}
                >{enermy_option.display[option][key]}{enermy_option[option] ==
                key
                  ? "☑"
                  : "☐"}</txt
              >
            {/each}
          {/each}
          <div class="filter_lv">
            <txt>等级</txt>
            <div>
              <div class="lv_btn" bind:this={element_lv}>
                {enermy_option.lv}
              </div>
            </div>
          </div>
        </div>
        <div class="enermy_list container" bind:this={element_container.enermy}>
          {#each Data.keys().enermy.filter((e) => Data.enermy[e].type == enermy_option.type) as e, i (i)}
            <div>
              <div class="portrait" bind:this={element_enermy[i]}>
                <img src="/img/enermy/{enermy_option.type}/{e}/portrait.webp" />
              </div>
              <div class="info">
                <txt>生命: {difficulty(e, enermy_option.difficulty).health}</txt
                >
                <txt>速度: {difficulty(e, enermy_option.difficulty).speed}</txt>
                <br />
                <txt>{Data.enermy[e].intro}</txt>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if selected && index != "consumable"}
      <div
        class="nexus"
        in:scale={{ duration: 200 }}
        out:scale={{ duration: 200 }}
      >
        <div class="speaker"></div>
        <div class="screen">
          <div class="phone-infos">
            <span>11:39</span>
            <span class="battery"></span>
            <span class="gsm">
              <b class="signal1"></b>
              <b class="signal2"></b>
              <b class="signal3"></b>
              <b class="signal4"></b>
            </span>
          </div>
          <div class="phone-tab-contents">
            <div class="tab phone current">
              <div
                class="detail container"
                bind:this={element_container.detail}
              >
                <icon class="icon-{selected}"></icon>
                <txt class="name">{info[index][selected].name}</txt>
                <txt class="effect">{info[index][selected].detail}</txt>
                <txt class="story">{story[index][selected]}</txt>
              </div>
            </div>
          </div>
          <div class="main-btns">
            <li><a><i class="icon back">{"<"}</i></a></li>
            <li><a><i class="icon home"></i></a></li>
            <li><a><i class="icon windows"></i></a></li>
          </div>
        </div>
      </div>
    {/if}
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

  .enermy {
    position: absolute;
    left: 0;
    top: 0;
  }
  .filter {
    flex-direction: row;
    font-family: write;
    font-size: 28px;
    color: #555;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    width: 900px;
  }
  .filter_lv {
    flex-direction: row;
    align-items: center;
  }
  .filter_lv > div {
    width: 200px;
    height: 10px;
    position: relative;
    justify-content: center;
    border-radius: 5px;
    background-color: #ccc;
    margin-left: 24px;
  }
  .lv_btn {
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #555;
    background-color: #f5f9f4;
    text-align: center;
    line-height: 36px;
    font-size: 24px;
    cursor: pointer;
    transform: translate(-18px);
  }
  .enermy_list {
    flex-direction: row;
    flex-wrap: wrap;
    height: 500px;
  }
  .enermy_list > div {
    width: 300px;
    margin: 10px 0;
    flex-direction: row;
  }
  .portrait {
    width: 150px;
    height: 220px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 10px solid #fff;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='rgb(230, 230, 230)' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 90%;
    filter: drop-shadow(0 0 4px #777);
  }
  .portrait img {
    height: 200px;
  }
  .enermy_list .info {
    font-family: write;
    font-size: 24px;
    color: #555;
    width: 140px;
    margin: 5px;
  }

  .role {
    width: 900px;
    height: 560px;
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    color: #555;
    flex-direction: row;
  }
  .role_list {
    justify-content: center;
    height: 100%;
  }
  .role_list img {
    width: 60px;
    border-radius: 50%;
    background: #aaa;
    border: 4px solid #fff;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.25);
    margin: 5px;
    transition: 0.2s;
    cursor: pointer;
  }
  .locked {
    filter: grayscale(1);
  }
  .role_list img:not(.locked):hover {
    transform: scale(1.2);
  }
  .left {
    width: 270px;
    align-items: center;
    margin: 10px;
    padding: 10px;
    font-family: write;
  }
  .photo {
    height: 120px;
    width: 120px;
    background-color: white;
    filter: drop-shadow(0 0 4px #777);
    transform: rotate(4deg);
    flex-shrink: 0;
  }
  .photo img {
    margin: auto;
    height: 100px;
    width: 100px;
    background: #aaa;
  }
  .left .name {
    font-size: 48px;
    margin: 5px;
  }
  .left .state {
    font-size: 32px;
  }
  .talent {
    font-size: 24px;
    line-height: 25px;
    white-space: pre-wrap;
    backdrop-filter: blur(5px);
    padding: 4px;
  }
  .right {
    width: 540px;
    padding: 10px;
    font-family: write;
  }
  .title {
    font-size: 36px;
    margin: 5px;
  }
  .spellcard div {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .index {
    width: 900px;
    flex-direction: row;
    border-bottom: 2px solid #777;
  }
  .index > txt {
    margin: auto;
    font-size: 40px;
    position: relative;
    height: 90px;
    width: 270px;
    line-height: 100px;
    text-align: center;
    color: #555;
    cursor: pointer;
    font-family: write;
  }
  .index > txt.selected,
  .index > txt:hover {
    border-color: white;
    transform: scale(1.1);
  }
  .index > txt.selected::before,
  .index > txt:hover::before {
    content: "";
    height: 110px;
    width: 265px;
    position: absolute;
    left: 0;
    border-radius: 100%;
    border: 4px solid #555;
    border-right: none;
    border-top: none;
    clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
    transform: rotate(-6deg) translate(-54px, -17px) scale(0.5);
  }
  .index > txt.selected::after,
  .index > txt:hover::after {
    content: "";
    height: 88px;
    width: 282px;
    position: absolute;
    left: 0;
    border-radius: 100%;
    border: 4px solid #555;
    border-right: none;
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
    transform: rotate(-3deg) translate(-59px, -2px) scale(0.5);
  }

  .main {
    margin-top: 5px;
    height: 560px;
    width: 900px;
    flex-direction: row;
    position: relative;
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

  .basecard,
  .list {
    flex-direction: row;
    flex-wrap: wrap;
    width: 600px;
    height: 560px;
    align-content: flex-start;
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
  }
  .basecard {
    width: 900px;
    justify-content: center;
  }
  .basecard > div {
    margin: 0px 1px;
  }

  .main > .list > div {
    margin: 5px;
    background-color: rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    cursor: pointer;
    transition: 0.2s;
  }
  .main > div > div.selected,
  .main > .list > div:hover {
    border-color: white;
    transform: scale(1.1);
  }

  icon {
    color: white;
    margin: auto;
  }
  .list > div {
    filter: drop-shadow(0 0 3px #555);
    --shadow: rgba(119, 119, 119, 0.5);
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
  }
  .consumables > div,
  .collections > div {
    width: 50px;
    height: 50px;
    border: 3px solid white;
    border-radius: 8px;
    font-size: 34px;
  }
  .equipments > div,
  .souvenirs > div {
    width: 90px;
    height: 90px;
    border: 4px solid white;
    border-radius: 14px;
    font-size: 61px;
  }

  .detail {
    width: 100%;
    height: 560px;
    align-items: center;
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
  }
  .detail > icon {
    height: 120px;
    font-size: 100px;
    padding: 10px 20px;
    margin: 0;
    border-bottom: 2px solid #a5a5a5;
  }
  .detail > .name {
    font-size: 24px;
    color: white;
    margin: 10px;
    font-family: title;
  }
  .detail > .effect {
    width: 240px;
    text-align: center;
    font-size: 16px;
    color: white;
    font-family: remark;
  }
  .detail > .story {
    font-family: normal;
    width: 240px;
    padding: 20px 10px;
    font-size: 16px;
    color: #dedede;
    white-space: pre-wrap;
  }
  .nexus {
    position: absolute;
    right: -15px;
    top: -35px;
    margin: 10px auto;
    width: 314px;
    height: 600px;
    border-radius: 80px / 40px;
    border-top: 3px solid #222;
    background: #6d6d6b;
    transform: scale(0.9);
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
  }
  .phone-infos {
    width: 100%;
    height: 17px;
    background: #303030;
    flex-direction: row-reverse;
    align-items: center;
  }
  .phone-infos span {
    color: #4196b7;
    font-size: 11px;
    margin: 2px 3px;
  }
  .phone-infos .battery {
    width: 8px;
    height: 10px;
    background: #4196b7;
    margin-top: 2px;
    position: relative;
    margin-top: 4px;
  }
  .phone-infos .battery:before {
    width: 4px;
    height: 2px;
    position: absolute;
    left: 2px;
    top: -2px;
    background: #4196b7;
    content: "";
  }
  .phone-infos .gsm {
    position: relative;
    height: 12px;
    margin-right: 10px;
  }
  .phone-infos .gsm b {
    position: absolute;
    bottom: 0;
  }
  .phone-infos .gsm b:before {
    position: absolute;
    content: "";
    top: -3px;
    width: 0;
    height: 0;
    border-bottom: 3px solid #4196b7;
    border-left: 3px solid transparent;
  }
  .phone-infos .gsm .signal1 {
    width: 3px;
    height: 0px;
    background: #4196b7;
    left: -8px;
  }
  .phone-infos .gsm .signal2 {
    width: 3px;
    height: 3px;
    background: #4196b7;
    left: -4px;
  }
  .phone-infos .gsm .signal3 {
    width: 3px;
    height: 7px;
    background: #4196b7;
  }
  .phone-infos .gsm .signal4 {
    width: 3px;
    height: 11px;
    background: #808184;
    left: 4px;
  }
  .phone-infos .gsm .signal4:before {
    border-bottom: 3px solid #808184;
    border-left: 3px solid transparent;
  }

  .phone-tab-contents {
    width: 100%;
    height: 420px;
    position: relative;
    overflow: hidden;
  }
  .phone-tab-contents .tab {
    width: 100%;
    height: 420px;
    position: absolute;
    background: #3f3f3f;
    position: absolute;
    -webkit-transition: all 0.25s ease-in;
    -moz-transition: all 0.25s ease-in;
    -o-transition: all 0.25s ease-in;
    transition: all 0.25s ease-in;
  }
  .phone-tab-contents .tab.phone {
    left: 0;
    background: #3f3f3f
      url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAKElEQVQIW2NkQAOO07anMSKLgQT2Z3nOggvCBECKwILIAmBBdAGQIABJuxH63EphJgAAAABJRU5ErkJggg==)
      repeat;
  }

  .main-btns {
    width: 100%;
    height: 34px;
    background: #303030;
    flex-direction: row;
  }
  .main-btns li {
    list-style: none;
  }
  .main-btns li a {
    width: 30px;
    display: block;
    width: 94px;
    height: 34px;
    text-align: center;
  }
  /* 	Icon Group 	*/
  .icon {
    display: inline-block;
    font-style: normal;
    position: relative;
  }
  .icon.home {
    width: 25px;
    height: 8px;
    border: 2px solid #bbbbbb;
    border-top: 0;
    margin-top: 15px;
  }
  .icon.home:after {
    width: 2px;
    height: 17px;
    background: #bbbbbb;
    position: absolute;
    top: -12px;
    left: 5px;
    content: "";
    -webkit-transform: rotate(70deg);
    -moz-transform: rotate(70deg);
    -o-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  .icon.home:before {
    width: 2px;
    height: 17px;
    background: #bbbbbb;
    position: absolute;
    top: -12px;
    right: 5px;
    content: "";
    -webkit-transform: rotate(110deg);
    -moz-transform: rotate(110deg);
    -o-transform: rotate(110deg);
    transform: rotate(110deg);
  }

  .icon.windows {
    width: 20px;
    height: 8px;
    border: 2px solid #bbbbbb;
    margin-top: 13px;
  }
  .icon.windows:after {
    width: 2px;
    height: 14px;
    background: #bbbbbb;
    position: absolute;
    content: "";
    right: -6px;
    top: -6px;
  }
  .icon.windows:before {
    width: 22px;
    height: 2px;
    background: #bbbbbb;
    position: absolute;
    content: "";
    right: -4px;
    top: -6px;
  }

  .icon.back {
    width: 20px;
    height: 2px;
    background: #bbb;
    color: #bbb;
    font-size: 18px;
    line-height: 0px;
    text-indent: -16px;
    font-family: sans-serif;
    margin-top: 12px;
    transform: translateX(-4px);
  }
  .icon.back:before {
    width: 8px;
    height: 11px;
    background: #303030;
    position: absolute;
    content: "";
    left: 6px;
    z-index: 10;
    top: 2px;
  }
  .icon.back:after {
    width: 20px;
    height: 7px;
    border: 2px solid #bbb;
    position: absolute;
    content: "";
    border-radius: 10px;
    transform: translateX(-3px);
  }
</style>
