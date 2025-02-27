<script>
  import { onMount, beforeUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { data, page, explore, Admin } from "../store";
  import event from "../data/event.json";
  import eventContent from "../addon/event";
  import enermy from "../data/enermy";
  import domtoimage from 'dom-to-image';

  $Admin.data = $data;
  const form = {
    // random: {
    //   reward: 7,
    //   selection: 4,
    //   special: 3,
    // },
    static: {
      yakumo: 15,
    },
  };
  //const _allEvent = [...Object.keys(event).rd(), ...Object.keys(event).rd()];
  const _allEvent = summonEvent();
  const allEvent = _allEvent.map((k, i) => {
    return {
      key: k,
      cache: {},
      id: i,
      style: random(),
      detail: event[k].detail,
    };
  });
  const events = deepCopy(allEvent);
  let eventList = [0, 1, 2].map((_) => events.rd().splice(0, 5));
  const offsetY = [0, 0, 0];
  const cursor = [1, 1, 1];
  let animate = true;
  let paper;
  let event_id;

  $Admin.event = {
    summonZagu,
    finish: eventFinish,
  };
  $Admin.discount = discount;

  onMount((_) => {
    paper.style.top = `${document.body.clientHeight}px`;
    paper.style.transition = "0.3s";
    window.onclick = (_) => {
      if (paper) paper.style.top = `${document.body.clientHeight}px`;
    };
    paper.onmouseover = (_) => {
      window.onclick = null;
      paper.onmouseleave = (_) => {
        window.onclick = foldEvent;
        paper.onmouseenter = (_) => {
          window.onclick = null;
        };
      };
    };
  });

  function discount(product) {
    let base = 1;
    if ("carnyx" in $Admin.data.collection) {
      let amount = $Admin.data.collection["carnyx"];
      base *= Math.pow(0.95, amount);
    }
    if ($Admin.data.role == "marisa") {
      base *= 0.9;
    }
    product.forEach((p) => (p.piece *= base));
    return product;
  }
  function summonEvent() {
    let res = [];
    let _event = Object.keys(event).map((key) => {
      return {
        key: key,
        type: event[key].type,
      };
    });
    for (let type in form.random) {
      let l = _event.filter((e) => e.type == type).rd();
      l.splice(0, form.random[type]).map((i) => res.push(i.key));
    }
    for (let key in form.static) {
      [...Array(form.static[key]).keys()].forEach((_) => res.push(key));
    }
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
    if (allEvent[id].cache.finish) msg({ content: "事件已完成" });
    else {
      window.onclick = null;
      paper.style.top = `${document.body.clientHeight - 640}px`;
      event_id = id;
    }
  }
  function foldEvent() {
    paper.style.top = `${document.body.clientHeight}px`;
    event_id = false;
  }
  function eventFinish() {
    paper.style.top = `${document.body.clientHeight}px`;
    allEvent[event_id].cache.finish = true;
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
    let other = [0, 1, 2].filter((i) => i != index);
    offsetY[index] -= 1;
    other.forEach((i) => {
      if (events.length == 0 && cursor[i] == 1);
      else if (cursor[i] == 1) offsetY[i] += 1;
    });
    setTimeout((_) => {
      animate = false;
      if (events.length > 0) {
        eventList[index].push(events.rd().shift());
      } else if (cursor[other[1]] != 0) {
        eventList[index].push(eventList[other[1]].shift());
        cursor[1] = 0;
        offsetY[1] += 1;
      } else if (cursor[other[0]] != 0) {
        eventList[index].push(eventList[other[0]].shift());
        cursor[0] = 0;
        offsetY[0] += 1;
      }
      eventList[index] = eventList[index].filter((_, i) => i != 0);
      other.forEach((i) => {
        if (events.length > 0) {
          eventList[i] = [events.rd().shift(), ...eventList[i]];
          offsetY[i] -= 1;
        } else {
          cursor[i] = 0;
        }
      });
      offsetY[index] += 1;
      setTimeout((_) => {
        animate = true;
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
      $page = "Battle";
    }
  }
  function summonZagu(amount) {
    let res = [];
    [...Array(amount).keys()].forEach((_) =>
      res.push(
        Object.keys(enermy)
          .filter((e) => enermy[e].scene.includes($Admin.data.scene))
          .rd()[0],
      ),
    );
    $explore.enermy = [...$explore.enermy, ...res];
  }
  window.cap = _ => domtoimage.toPng(document.getElementById('cover'))
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        console.log(dataUrl)
        document.body.appendChild(img);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
</script>

<div
  class="body"
  style="--bg:url(/img/scene/r{[...Array(9).keys()].rd()[0]}.jpg);display: none;"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
>
  <div class="event-list">
    {#each ["l", "m", "r"] as o, i (i)}
      <div
        class="list-{o}"
        style="bottom:{(offsetY[i] - 1) * 210}px;{animate &&
          'transition: 0.4s'};"
      >
        {#each eventList[i] as e, ii (ii)}
          <div
            class="event {ii == cursor[i] && 'cursor'} {ii + offsetY[i] > 0 &&
              ii + offsetY[i] < 4 &&
              'show'}"
            style="{animate && 'transition: 0.3s'};"
          >
            <div
              class="event-body"
              style="--color:var(--{event[e.key].type});{e.style}"
            >
              <txt
                class="title"
                on:click={(_) => ii == cursor[i] && eventHandle(e.id)}
                >{eventInfo(e.key).name}</txt
              >
              <txt
                class="detail"
                on:click={(_) => ii == cursor[i] && eventHandle(e.id)}
                >{eventInfo(e.key).detail}</txt
              >
              <div class="event-close" on:click={(_) => closeEvent(i)}>
                <div>x</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="notebook">
    <div class="title">
      <txt>遇敌</txt>
      <txt class="battle" on:click={battle}>开战！</txt>
    </div>
    {#each $explore.enermy as e, i (i)}
      <txt
        class="enermy"
        on:click={(_) => ($explore.target[i] = !$explore.target[i])}
        >{$explore.target[i] ? "☑" : "☐"} lv.{$explore.lv}
        {enermy[e].name}</txt
      >
    {/each}
  </div>
  <div class="paper" bind:this={paper}>
    {#if event_id}
      <div class="title">{event[allEvent[event_id].key].name}</div>
      <svelte:component
        this={eventContent[allEvent[event_id].key]}
        info={allEvent[event_id]}
      />
    {/if}
  </div>
</div>
<div class="body">
  <div id="cover" style="position:relative">
    <img src="/img/cover.png">
    <div style="position: absolute; right: 10px; top: 50px; font-size: 200px; font-family: 'book';">
      <txt>红月</txt>
      <txt style="line-height:190px">异闻录</txt>
      <div style="position: absolute;right: 0px;top: 20px;font-size: 50px;width: 200px;height: 200px;overflow: hidden;">
        <img src="/img/moon.png" style="width: 300px; position:absolute;top:-50px;right:-50px;">
        <div style="position: absolute; right: 0; top: 48px; font-family: 'ex'; width: 170px;">
          <txt style="--size: 10px;">白瑞</txt>
          <txt style="--size: 10px;">凉子</txt>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  txt {
    color: white;
    --shadow: #ad4234;
    --size: 20px;
    text-shadow:
      0 0 var(--size) var(--shadow),
      0 0 var(--size) var(--shadow),
      0 0 var(--size) var(--shadow),
      0 0 var(--size) var(--shadow),
      0 0 var(--size) var(--shadow),
      0 0 var(--size) var(--shadow),
      0 0 var(--size) var(--shadow);
  }
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
    cursor: pointer;
  }
  .event .detail {
    font-size: 24px;
    cursor: pointer;
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
  .cursor:hover {
    transform: scale(1.1);
    cursor: normal;
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
</style>
