<script>
  import { onMount, afterUpdate } from "svelte";
  import role from "../data/role.json";
  import { fade, scale } from "svelte/transition";
  import { data, page, explore, archive, Admin, Explain } from "../store";
  import Data from "../data/data";

  let option = {
    role: "reimu",
    difficulty: "normal",
    sugar: 3,
    enable_rule: false,
    rule: [],
  };
  let difficulty = {
    easy: {
      name: "轻松",
      detail:
        "环境升级时难度增加速度：0.5\n有6次重生的机会。",
      type: "blue",
      amount: 6,
      coin: 3,
      handle: (_) => (window.exploreLevelScale = 0.5),
    },
    normal: {
      name: "平实",
      detail:
        "环境升级时难度增加速度：1\n有4次重生的机会。",
      type: "green",
      amount: 4,
      coin: 2,
      handle: (_) => (window.exploreLevelScale = 1),
    },
    hard: {
      name: "紧张",
      detail:
        "环境升级时难度增加速度：1.5\n有2次重生的机会。",
      type: "red",
      amount: 2,
      coin: 1,
      handle: (_) => (window.exploreLevelScale = 1.5),
    },
  };
  const element_difficulty = [];
  const element_rule = [];

  onMount(function () {
    element_difficulty.forEach((e, i) => {
      let key = Object.keys(difficulty)[i];
      $Explain(e).color(difficulty[key].type).with(difficulty[key]);
    });
  });
  afterUpdate(function () {
    element_rule.forEach((e, i) => {
      let rule = Data.keys().rule[i];
      $Explain(e).with(Data.rule[rule]);
    });
  });

  function launch() {
    difficulty[option.difficulty].handle();
    if (option.rule.length == Data.keys().rule.length) option.role = "renko";
    $data = {
      difficulty: option.difficulty,
      collection: {},
      equipment: false,
      consumable: {},
      card: {},
      souvenir: false,
      role: option.role,
      sugar: option.sugar,
      consumableLimit: 3,
      chance: difficulty[option.difficulty],
      coin: (4 - difficulty[option.difficulty].coin) * 300,
      scene: "shrine",
      stage: 1,
      blackList: [],
      statistics: [],
      coin_reward_total: 0,
      rule: option.rule,
      achievement: [],
    };
    if (option.rule.includes("rule_compass")) $data.sugar = 20;
    $data.card = deepCopy(Data.role[option.role].origin);
    Data.keys()
      .basecard.rd()
      .splice(0, 3)
      .forEach((s) => s.increaseOf($data.card));
    $explore = {
      enermy: ["yukari0"],
      eventSummoned: false,
      enermyLimit: 4,
      lv: 1,
      trip: [],
      target: [true],
    };
    // $explore.boss = data.keys().enermy
    //   .filter((e) => Data.enermy[e].type == "boss")
    //   .rd();
    $page = "Battle";
    $Admin.guide.add("init");
    $Admin.save();
    setTimeout(_ => $explore.lv = -1, 1000);
  }
</script>

<div class="body" in:fade={{ duration: 250 }} out:fade={{ duration: 250 }}>
  <div class="notebook">
    <div class="left">
      <div class="page-inner" contenteditable={!option.enable_rule}>
        {#if option.enable_rule}
          <div>
            {#each Data.keys().rule as rule, i (i)}
              {#if $archive.unlocked.rule.includes(rule)}
                <div
                  class="rule"
                  on:click={function () {
                    if (option.rule.includes(rule))
                      option.rule = option.rule.filter((r) => r != rule);
                    else option.rule = [...option.rule, rule];
                  }}
                >
                  <icon bind:this={element_rule[i]} class="icon-{rule}"></icon>
                  <div>
                    <txt
                      >{option.rule.includes(rule) ? "☑" : "☐"}{Data.rule[rule]
                        .name}</txt
                    >
                    <txt>{Data.rule[rule].effect}</txt>
                  </div>
                </div>
              {:else}
                <div class="rule">
                  <icon bind:this={element_rule[i]} class="icon-{rule}"></icon>
                  <div>
                    <txt>{Data.rule[rule].name}</txt>
                    <txt>获得方式: <span style="font-family:nomal;font-size:20px;">鎼哄甫姊呰帀鐨勬洸鍒拡</span></txt>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {:else}
          序言 (无关紧要)
          最近老是做梦，梅莉也是，仔细想想是上次从神社回来开始的，要解释成灵异现象吗？
          不过梦里的那些体验倒也蛮新奇的，被怂恿后就决定写成一本小说了，名字还没想好，以后再决定吧，本着“小说的开端肯定是序言吧！”的想法，这篇序言就开始写了，写写停停，因为没想到事由简单一句话就带过了，后面都不会凑了。
          梅莉陪我商量了很多，人物啊，对话啊，场景啊，她的表达能力可真好，梦里很多东西我都只是有画面而不知道如何描述。哈，这小说都没有主题呢，我的初心应该只是“记录”，不要纠结好了。
          不知不觉写了好多，已经快写完了，在写结局之前我问了一下梅莉最喜欢的情景，以此决定结局走向，她意外地喜欢云之海。
          都要写完了，结果序言也没添几句，后记的性质好像和序言差不多，但是可以尽情剧透。
          先这样吧。
        {/if}
      </div>
    </div>
    <div class="right">
      <div class="page-inner">
        <div class="role">
          主要人物<br />
          {#each Data.keys().role.filter((r) => !Data.role[r].unable) as r}
            <txt
              class="role-selection {!$archive.unlocked.role.includes(r) &&
                'locked'}"
              on:click={(_) => {
                if ($archive.unlocked.role.includes(r)) option.role = r;
                else window.msg({ content: "该角色尚未解锁" });
              }}>{role[r].name}<br /></txt
            >
          {/each}
          <br />
        </div>
        <div class="avatar">
          <img src="/img/role/dairi/{option.role}.webp" />
        </div>
        <div class="role-props">
          <br />{role[option.role].name}<br />
          上手难度：<br />{role[option.role].difficulty}<br /><br />
          <div class="role-detail">
            {role[option.role].detail}
          </div>
        </div>
        <div class="divided_line">+-+-+-+-+&ensp;割线分&ensp;+-+-+-+-+</div>
        <br />
        <div>
          <div class="difficulty">
            <br /><txt>风格</txt><br />
            <div class="selection">
              {#each Object.keys(difficulty) as d, i (i)}
                <txt
                  on:click={(_) => (option.difficulty = d)}
                  bind:this={element_difficulty[i]}
                  >{difficulty[d].name}&ensp;{option.difficulty == d
                    ? "☑"
                    : "☐"}</txt
                >
              {/each}
            </div>
          </div>
          <div class="sugar">
            <div>
              <txt>选项数量：&ensp;</txt>
              <txt
                on:click={(_) => (option.sugar = Math.max(option.sugar - 1, 1))}
                >-</txt
              >
              <txt style="text-align:center;width:40px;">{option.sugar}</txt>
              <txt
                on:click={(_) => (option.sugar = Math.min(option.sugar + 1, 5))}
                >+</txt
              >
            </div>
          </div>
          <div class="enable_rule">
            <br />
            <txt
              style="cursor:pointer"
              on:click={function () {
                option.enable_rule = !option.enable_rule;
              }}
              >信物：&ensp;<span>{option.enable_rule ? "开" : "关"}</span></txt
            >
          </div>
        </div>
        <div class="launch" on:click={launch}>就这样吧！</div>
      </div>
    </div>
  </div>
</div>

<style>
  .rule {
    flex-direction: row;
    cursor: pointer;
  }
  .rule icon {
    font-size: 40px;
    height: 60px;
    line-height: 60px;
    width: 60px;
    display: block;
  }

  .enable_rule,
  .sugar {
    position: absolute;
    left: 245px;
  }
  .sugar div {
    flex-direction: row;
  }
  .launch {
    margin: auto;
    font-size: 60px;
    position: relative;
    height: 100px;
    width: 270px;
    line-height: 100px;
    text-align: center;
    transform: rotate(-2deg);
  }
  .launch:hover {
    transform: rotate(-2deg) scale(1.15);
  }
  .launch::before {
    content: "";
    height: 110px;
    width: 265px;
    position: absolute;
    border-radius: 100%;
    border: 4px solid #555;
    border-right: none;
    border-top: none;
    clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
    transform: rotate(-6deg) translateY(-10px);
  }
  .launch::after {
    content: "";
    height: 88px;
    width: 282px;
    position: absolute;
    border-radius: 100%;
    border: 4px solid #555;
    border-right: none;
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
    transform: rotate(-3deg) translateY(7px);
  }
  .difficulty > txt {
    position: relative;
    left: 40px;
    width: 100px;
    transform: scale(1.5);
  }
  .difficulty .selection {
    position: absolute;
    left: 110px;
    text-align: right;
    cursor: pointer;
  }
  .divided_line {
    text-align: center;
  }
  .role-detail {
    position: relative;
    left: -140px;
    width: 290px;
  }
  .role-props {
    position: absolute;
    left: 285px;
  }
  .avatar {
    height: 120px;
    width: 120px;
    background-color: white;
    position: absolute;
    filter: drop-shadow(0 0 4px #777);
    left: 145px;
    top: 15px;
    transform: rotate(4deg);
  }
  .avatar img {
    margin: auto;
    height: 100px;
    width: 100px;
    background: #aaa;
  }
  .body {
    background-image: url("/img/lotr_stamp_bg.svg");
    background-repeat: repeat;
    background-size: 200px;
  }
  /** Notebook Base **/
  .notebook {
    position: relative;
    width: 960px;
    height: 640px;
    margin: auto;
    background-color: #444;
    background-image: -webkit-repeating-radial-gradient(
      center center,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5) 2px,
      transparent 2px,
      transparent 100%
    );
    background-image: repeating-radial-gradient(
      center center,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5) 2px,
      transparent 2px,
      transparent 100%
    );
    background-size: 4px 4px;

    border-radius: 15px;
    box-shadow:
      inset 2px 2px 2px rgba(255, 255, 255, 0.2),
      2px 2px 3px rgba(0, 0, 0, 0.2);
  }
  .left {
    position: absolute;
    left: 10px;
    right: 50%;
    top: 10px;
    bottom: 10px;
    background: rgb(250 249 221);
    border-radius: 10px 0 0 10px;
    box-shadow:
      inset -10px 0 30px -10px rgba(0, 0, 0, 0.3),
      -2px 2px 1px rgba(0, 0, 0, 0.8);
  }
  .right {
    position: absolute;
    left: 50%;
    right: 10px;
    top: 10px;
    bottom: 10px;

    background: rgb(250 249 221);

    border-radius: 0 10px 10px 0;
    box-shadow:
      inset 10px 0 30px -10px rgba(0, 0, 0, 0.3),
      2px 2px 1px rgba(0, 0, 0, 0.8);
  }
  .page-inner {
    position: absolute;
    top: 30px;
    bottom: 20px;
    left: 15px;
    right: 15px;
    outline: none;
    overflow: hidden;
    background: linear-gradient(
      to bottom,
      transparent,
      transparent 29px,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.2) 1px
    );
    background-size: 100% 30px;
    box-shadow:
      0 -1px 0 rgba(0, 0, 0, 0.2),
      0 -5px 0 rgb(247, 246, 212),
      0 -6px 0 rgba(0, 0, 0, 0.4);

    font: 28px/30px write;
    color: #555;
    white-space: pre-wrap;
  }
  .right .page-inner {
    white-space: unset;
  }

  .role-selection {
    max-width: 120px;
    text-align: left;
    margin-left: 15px;
    cursor: pointer;
  }
  .role-selection:not(.locked):hover {
    transform: scale(1.2);
  }
  .role-selection:active {
    transform: scale(1);
  }
  .role-selection.locked {
    color: #999;
  }
</style>
