<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { data, page, setting, Explain, Admin } from "../store";
  import collection from "../data/collection.json";
  import equipment from "../data/equipment.js";
  import souvenir from "../data/souvenir.json";
  import consumable from "../data/consumable.json";
  import role from "../data/role.json";
  import growth from "../data/growth";
  import Card from "../addon/card.svelte";
  import annotation from "../data/annotation.json";
  import Data from "../data/data";
  import keypress from "../data/keypress";

  export const menu = menuHandle;
  let enable = false;
  let index = "spellcards";
  let state;
  const element_state = [];
  const element_collection = [];
  const element_consumable = [];
  const element_rule = [];
  const element_container = {};
  let element_coin;
  let element_equipment;
  let element_souvenir;
  let element_additional_souvenir;
  let element_role;

  $Admin.menu = menuHandle;

  onMount(function () {
    keypress.bind("esc", menuHandle);
    let list = ["spellcards", "collection", "annotation"];
    keypress.bind("q", function () {
      if (list.indexOf(index) == 0) index = list[list.length - 1];
      else index = list[list.indexOf(index) - 1];
    });
    keypress.bind("e", function () {
      if (list.indexOf(index) == list.length - 1) index = list[0];
      else index = list[list.indexOf(index) + 1];
    });
  });
  beforeUpdate(function () {
    if ($data) {
      element_state.forEach((e, i) =>
        $Explain(e)
          .color(state[i].type == "chance" ? $data.chance.type : "blue")
          .with(state[i]),
      );
      element_consumable.forEach((e, i) =>
        $Explain(e)
          .color(consumable[Object.keys($data.consumable)[i]].type)
          .with(consumable[Object.keys($data.consumable)[i]]),
      );
      if (typeof $Explain == "function") {
        $Explain(element_coin).color("gold").with({
          name: "硬币",
          detail: "对，这是钱。",
        });
        $Explain(element_role).with({
          name: role[$data.role].name,
          detail: role[$data.role].talent,
        });
        $Explain(element_equipment)
          .color("gold")
          .with(equipment[$data.equipment]);
        $Explain(element_souvenir)
          .color("purple")
          .with(souvenir[$data.souvenir]);
        $Explain(element_additional_souvenir)
          .color("purple")
          .with(souvenir[$data.additional_souvenir]);
      }
    }
  });
  afterUpdate(function () {
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
    element_collection.forEach((e, i) => {
      if (collection[Object.keys($data.collection)[i]])
        $Explain(e)
          .color(collection[Object.keys($data.collection)[i]].type)
          .with(collection[Object.keys($data.collection)[i]]);
    });
    element_rule.forEach((e, i) => {
      $Explain(e).with({
        name: Data.rule[$Admin.data.rule[i]].name,
        detail: Data.rule[$Admin.data.rule[i]].effect,
      });
    });
  });

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

  function stateHandle() {
    let State = deepCopy(growth.role[$data.role]);
    if ($Admin.data.rule.includes("rule_magnify")) State.health /= 2;
    return [
      {
        type: "maxHealth",
        name: "生命上限",
        detail:
          "显而易见，生命值不会超过这个数。\n战斗中生命上限可能会有变化，但下一场战斗开始后就会恢复默认值。",
        data: State.health,
      },
      {
        type: "attack",
        name: "阶层",
        detail: "打败BOSS进入下一阶层，总共有3个阶层。",
        data: $data.stage,
      },
      {
        type: "speed",
        name: "速度",
        detail:
          "决定了回合中行动的自由度，速度快，能做的事也就会更多。\n抽牌数=基础抽牌数+(速度-敌人平均速度)，小数点后面部分就是多抽一张的概率。\n手牌上限=抽牌数+速度四舍五入。",
        data: State.speed,
      },
      {
        type: "power",
        name: "灵力",
        detail:
          "牌左上角的数字就是其灵力消耗。灵力每回合初都会回复至上限。\n额外灵力：等同于灵力，优先消耗，上限等同于牌库总牌数。",
        data: State.power,
      },
      {
        type: "health",
        name: "生命值",
        detail: "必须不让它归零才行。",
        data: $data.health,
      },
      {
        type: "sugar",
        name: "糖",
        detail: "面临选择时可用选项的数量。",
        data: $data.sugar,
      },
      {
        type: "left_card",
        name: "牌库数量",
        detail: "等级越高越强大。",
        data: Object.values($data.card).sum(),
      },
      {
        type: "chance",
        name: "残机",
        detail: `剩余${$data.chance.amount}次战败时回到战斗前的机会。\n机会消耗时，环境等级-3。`,
        data: $data.chance.amount,
      },
    ];
  }
  function menuHandle(e) {
    e && e.preventDefault();
    if ($page == "Index") return;
    else if ($Admin.guide.skip());
    else if (["Afflatus", "Foreword", "Archive"].includes($page))
      $page = "Index";
    else {
      state = stateHandle();
      enable = !enable;
      setTimeout((_) => $Admin.guide.add("menu"));
    }
  }
  function shanghaiClick() {
    let text;
    let coin =
      $Admin.data.coin * 0.5 +
      (Object.values($Admin.data.card).sum() +
        Object.values($Admin.data.collection).sum()) *
        20;
    if (coin > 20000) text = "人傻钱多";
    else if (coin > 10000) text = "腰缠万贯";
    else if (coin > 5000) text = "锦衣玉食";
    else if (coin > 2000) text = "稍有盈余";
    else if (coin > 1000) text = "粗茶淡饭";
    else if (coin > 500) text = "家徒四壁";
    else text = "安贫乐道";
    msg({ content: `您的财产评级: ${text}` });
  }
</script>

{#if enable}
  <div
    class="body {$data.role}"
    in:fade={{ duration: 250 }}
    out:fade={{ duration: 250 }}
  >
    {#if enable}
      <div class="blank" on:click={menuHandle}></div>
      <div
        class="main menu"
        in:scale={{ duration: 250 }}
        out:scale={{ duration: 250 }}
      >
        <div class="left">
          <txt>(=￣ ρ￣=) ..zzZZ</txt>
          <div class="state">
            {#each state as s, i (i)}
              <div bind:this={element_state[i]}>
                <icon
                  style="left:{150 + position[i].x * 1.5 - 16}px;top:{150 +
                    position[i].y * 1.5 -
                    16}px;"
                  class="icon-{s.type}"
                ></icon>
                <txt
                  style="left:{150 + position[i].x * 2.3 - 25}px;top:{150 +
                    position[i].y * 2.3 -
                    16}px;">{s.data}</txt
                >
              </div>
            {/each}
            <img
              src="/img/role/{$setting.resource}/{$data.role}.webp"
              bind:this={element_role}
            />
          </div>
          <div class="tip" style="--width:180px" bind:this={element_coin}>
            <icon class="coin icon-coin"></icon>
            <txt>{$data.coin}</txt>
          </div>
          <div
            class="tip"
            style="--width:200px;margin-top:10px;"
            on:click={$Admin.guide.reset}
          >
            <txt>重置新手引导</txt>
          </div>
          <div
            class="tip action"
            style="--width:250px"
            on:click={(_) => {
              $Admin.event.rewardClose();
              enable = false;
              $page = "Index";
            }}
          >
            保存并回到标题界面
          </div>
        </div>
        <div class="right">
          <div class="item">
            <div class="index">
              <txt
                class={index == "spellcards" && "selected"}
                on:click={(_) => {
                  index = "spellcards";
                  $Admin.sound("paper");
                }}>牌库</txt
              >
              <txt
                class={index == "collection" && "selected"}
                on:click={(_) => {
                  index = "collection";
                  $Admin.sound("paper");
                }}>收藏品</txt
              >
              <!-- <txt
                class={index == "consumable" && "selected"}
                on:click={(_) => (index = "consumable")}>消耗品</txt
              > -->
              <txt
                class={index == "annotation" && "selected"}
                on:click={(_) => {
                  index = "annotation";
                  $Admin.sound("paper");
                }}>笔记</txt
              >
            </div>
            {#if $Admin.data.rule.length == 0}
              <div class="bookmark" />
            {/if}
            <div class="bg" />
            {#if index == "collection"}
              <div
                class="collection container"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
                bind:this={element_container.collection}
              >
                {#each Object.keys($data.collection) as c, i (i)}
                  <div
                    bind:this={element_collection[i]}
                    style="background-color:var(--{collection[c].type})"
                  >
                    <icon class="icon-{c}"></icon>
                    {#if Object.values($data.collection)[i] > 1}
                      <txt>{Object.values($data.collection)[i]}</txt>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
            {#if index == "spellcards"}
              <div
                class="spellcards container"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
                bind:this={element_container.spellcards}
              >
                {#each Object.unCount($data.card) as c, i (i)}
                  <Card key={c} />
                {/each}
              </div>
            {/if}
            {#if index == "consumable"}
              <div
                class="collection container"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
                bind:this={element_container.consumable}
              >
                {#each Object.keys($data.consumable) as c, i (i)}
                  <div bind:this={element_consumable[i]}>
                    <icon class="icon-{c}"></icon>
                    {#if Object.values($data.consumable)[i] > 1}
                      <txt>{Object.values($data.consumable)[i]}</txt>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
            {#if index == "annotation"}
              <div
                class="annotation container"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
                bind:this={element_container.annotation}
              >
                <table class="table">
                  <thead>
                    <tr>
                      <th>乘算速查</th>
                      <th>^3</th>
                      <th>^5</th>
                      <th>^10</th>
                      <th>^15</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>x95%</td>
                      <td>86%</td>
                      <td>77%</td>
                      <td>60%</td>
                      <td>46%</td>
                    </tr>
                    <tr>
                      <td>x90%</td>
                      <td>73%</td>
                      <td>60%</td>
                      <td>35%</td>
                      <td>20%</td>
                    </tr>
                    <tr>
                      <td>x85%</td>
                      <td>61%</td>
                      <td>44%</td>
                      <td>20%</td>
                      <td>9%</td>
                    </tr>
                    <tr>
                      <td>x80%</td>
                      <td>51%</td>
                      <td>33%</td>
                      <td>11%</td>
                      <td>4%</td>
                    </tr>
                  </tbody>
                </table>
                <txt class="detail"></txt>
                {#each Object.keys(annotation) as a, i (i)}
                  <txt class="name">{annotation[a].name}</txt>
                  <txt class="detail">{annotation[a].detail}</txt>
                {/each}
              </div>
            {/if}
          </div>
          <div class="rule">
            {#each $Admin.data.rule as rule, i (i)}
              <icon class="icon-{rule}" bind:this={element_rule[i]}></icon>
            {/each}
          </div>
          <div class="other">
            {#if $data.equipment}
              <div class="equipment" bind:this={element_equipment}>
                <icon class="icon-{$data.equipment}"></icon>
                <txt>装备</txt>
              </div>
            {/if}
            {#if $data.souvenir}
              <div class="souvenir" bind:this={element_souvenir}>
                <icon class="icon-{$data.souvenir}"></icon>
                <txt>纪念品</txt>
              </div>
            {/if}
            {#if $data.additional_souvenir && $data.equipment == "messenger"}
              <div class="souvenir" bind:this={element_additional_souvenir}>
                <icon class="icon-{$data.additional_souvenir}"></icon>
                <txt>纪念品Ⅱ</txt>
              </div>
            {/if}
          </div>
        </div>
        <img
          class="shanghai"
          src="/img/{$page == 'Battle' ? 'doll_attack' : 'doll_normal'}.webp"
          on:mouseenter={(_) => $Admin.sound("select")}
          on:click={shanghaiClick}
        />
      </div>
    {/if}
  </div>
{/if}

<style>
  .shanghai {
    position: absolute;
    left: 240px;
    bottom: 80px;
    width: 90px;
    cursor: pointer;
  }
  .shanghai:hover {
    animation: shanghai 0.25s forwards;
  }
  @keyframes shanghai {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .blank {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .rule {
    flex-direction: row;
    align-content: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    width: 128px;
    height: 100px;
    color: white;
    font-size: 28px;
    position: absolute;
    bottom: 0;
    right: 290px;
    text-shadow:
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192;
  }
  .rule icon {
    margin: 2px;
    cursor: pointer;
  }

  icon {
    color: white;
  }

  .body {
    position: absolute;
    z-index: 11;
    opacity: 1;
    backdrop-filter: blur(16px) saturate(150%) brightness(1.2);
    transition: 0.4s;
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

  .annotation {
    flex-wrap: nowrap;
    position: absolute;
    left: 0;
    top: 18px;
    height: 340px;
    width: 416px;
    align-content: flex-start;
    padding: 12px;
  }
  .annotation .name {
    font-size: 20px;
    margin: 15px 0px;
    color: #555;
    font-family: title;
  }
  .annotation .detail {
    font-size: 16px;
    padding-bottom: 10px;
    color: #666;
    font-family: remark;
    white-space: pre-wrap;
  }
  .annotation .detail:not(:last-child) {
    border-bottom: 1px solid #666;
  }
  .table * {
    text-align: center;
  }

  .main {
    flex-direction: row;
    align-items: center;
    border-radius: 12px;
    background-color: rgb(236 125 125);
    background-image: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    box-shadow:
      0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
      0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
    height: 470px;
    width: 735px;
    position: relative;
  }

  .left {
    align-items: center;
    width: 300px;
    height: 470px;
    position: relative;
    overflow: hidden;
  }
  .right {
    align-items: flex-end;
    justify-content: space-between;
    margin-left: 5px;
    margin-right: 10px;
    height: 100%;
    position: relative;
  }

  .left > txt {
    width: 250px;
    line-height: 40px;
    font-size: 16px;
    transform: rotate(-35deg);
    background-color: white;
    position: absolute;
    left: -70px;
    top: 25px;
    text-align: center;
    filter: drop-shadow(0 0 4px #888);
    color: #666;
  }
  .state {
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 300px;
    position: relative;
  }
  .state > div > icon {
    font-size: 32px;
    position: absolute;
  }
  .state > div > txt {
    line-height: 32px;
    font-size: 18px;
    font-family: title;
    color: white;
    text-shadow:
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192,
      0 0 3px #8d7192;
    position: absolute;
    text-align: center;
    width: 50px;
    text-align: center;
  }
  .state > img {
    width: 90px;
    border-radius: 50%;
    border: 5px solid white;
    background-color: #bbb;
  }
  .tip {
    position: relative;
    top: -5px;
    flex-direction: row;
    height: 45px;
    width: var(--width);
    align-items: center;
    justify-content: center;
    color: #888;
    font-family: remark;
    font-size: 20px;
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
  }
  .tip:hover {
    filter: drop-shadow(0 0 6px #777);
  }
  .coin {
    font-size: 28px;
    color: #b896be;
    margin-right: 5px;
  }

  .item {
    height: 360px;
    width: 420px;
    position: relative;
  }
  .item > div:not(.annotation) {
    flex-direction: row;
  }
  .index {
    position: absolute;
    top: -20px;
    left: 20px;
  }
  .index > txt {
    width: 80px;
    line-height: 40px;
    margin: 5px;
    background-image: radial-gradient(
      circle at 0 0,
      transparent 0,
      transparent 15px,
      #fff 15px
    );
    font-size: 20px;
    color: #888;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    font-family: normal;
    transition: 0.2s;
    font-weight: bold;
  }
  .index > txt.selected {
    transform: translateY(-7px);
    z-index: 1;
  }
  .index > txt:hover {
    transform: translateY(-7px);
  }
  .bg,
  .collection,
  .spellcards,
  .consumable {
    position: absolute;
    left: 0;
    top: 18px;
    height: 340px;
    width: 416px;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 12px;
    --blue: rgb(103, 186, 255);
    --purple: #c84df0;
    --green: #60d560;
    --red: #e55c5c;
    --gold: #ffe661;
    --shadow: #77777768;
  }
  .bg {
    filter: drop-shadow(0 0 6px #666);
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='rgb(255, 220, 220)' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 30%;
  }
  .bookmark {
    width: 30px;
    height: 100px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%);
    background-color: #b96161;
    position: absolute;
    bottom: -60px;
    left: 30px;
    transition: 0.3s;
    cursor: pointer;
  }
  .bookmark:hover {
    bottom: -75px;
  }
  .bookmark:active {
    bottom: -90px;
    transition: 0.2s;
  }
  .spellcards icon {
    font-size: 80px;
    margin: auto;
  }
  .collection icon {
    margin: auto;
    font-size: 36px;
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
  }
  .collection > div {
    width: 48px;
    height: 48px;
    margin: 4px;
    background-color: rgb(183 88 88 / 70%);
    background-color: #b896be;
    border-radius: 50%;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: 0.2s;
  }
  .collection txt {
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
  .collection > div:hover {
    transform: scale(1.1);
  }
  .other {
    flex-direction: row;
    height: 100px;
    margin-right: 30px;
  }
  .equipment,
  .souvenir {
    width: 80px;
    height: 100px;
    margin: 5px;
    align-items: center;
    background-color: #b896be;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 40px 40px 0 0;
    filter: drop-shadow(0 0 4px #888);
    cursor: pointer;
  }
  .equipment > icon,
  .souvenir > icon {
    font-size: 50px;
  }
  .equipment > txt,
  .souvenir > txt {
    margin-top: 5px;
    text-align: center;
    color: white;
    font-family: normal;
    width: 72px;
  }
  .action {
    margin-top: 10px;
  }
</style>
