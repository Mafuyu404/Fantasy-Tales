<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { Admin, setting, Explain, archive } from "../store";
  import Data from "../data/data";
  import Card from "../addon/card.svelte";
  import growth from "../data/growth";
  import unlock from "../data/unlock";
  import sector from "../data/sector";

  let type = "collection";
  let color = "blue";
  let show = false;
  let selected;
  let source = [];
  let worth = 100;
  let special;
  let cache = {};
  let data = {};
  const element = [];
  let element_container;

  beforeUpdate(function () {
    element.forEach((e, i) => {
      if (e && source[i]) {
        e.onclick = (_) => {
          selected = selected == i ? null : i;
          $Admin.sound("select");
        };
        let _color =
          type == "collection" ? data.collection[source[i]].type : color;
        if (
          type != "spellcard" &&
          type != "basecard" &&
          type != "forget" &&
          type != "card"
        ) {
          let info = deepCopy(data[type][source[i]]);
          if (type == "collection") {
            let amount = 0;
            if (source[i] in $Admin.data.collection)
              amount = $Admin.data.collection[source[i]];
            if (!info.detail.includes(`* [`))
              info.detail += `\n* [ 已有: ${amount} ]`;
          }
          $Explain(e).color(_color).with(info);
        }
      }
    });
  });
  afterUpdate((_) => {
    if (element_container)
      element_container.ontouchstart = function (event) {
        let originX = event.touches[0].pageX;
        let scrollTop = element_container.scrollTop;
        element_container.ontouchmove = function (e) {
          let x = e.touches[0].pageX;
          element_container.scrollTop = scrollTop + x - originX;
        };
      };
  });

  $Admin.event.getCollection = loadCollection;
  $Admin.event.getEquipment = loadEquipment;
  $Admin.event.getSouvenir = loadSouvenir;
  $Admin.event.getSpellcard = loadSpellcard;
  $Admin.event.getBasecard = loadBasecard;
  $Admin.event.heal = heal;
  $Admin.event.loseHealth = loseHealth;
  $Admin.event.forgetCard = forgetCard;
  $Admin.event.copy = copy;
  $Admin.event.change = change;
  $Admin.event.sellCollection = sellCollection;
  $Admin.event.getCoin = getCoin;
  $Admin.event.rewardClose = close;
  $Admin.event.unlockCard = unlockCard;
  $Admin.event.unlockRule = unlockRule;
  $Admin.event.getItem = getItem;

  const specialHandle = {
    change: function () {
      let res;
      source[selected].decreaseOf($Admin.data[type]);
      if (type == "card")
        res = data
          .keys()
          .card.filter((c) =>
            ["base", $Admin.data.role].includes(data.card[c].role),
          )
          .rd()[0];
      if (type == "collection") {
        let _color = data.collection[source[selected]].type;
        let r = Math.random();
        if (r > 0.7)
          _color = {
            blue: "green",
            green: Math.random() > 0.5 ? "red" : "blue",
            red: "green",
          }[_color];
        res = data
          .keys()
          .collection.filter((c) => Data.collection[c].type == _color);
        res = res.rd()[0];
      }
      setTimeout(_ => getItem(Data.index(res), res), 500);
      // res.increaseOf($Admin.data[type]);
      //msg({ content: `获得[${data[type][res].name}]` });
    },
    sellCollection: function () {
      source[selected].decreaseOf($Admin.data.collection);
      let sold = cache.sellCollection;
      sold.push(source[selected]);
      let res = {
        blue: 100,
        green: 300,
        red: 750,
      }[data.collection[source[selected]].type];
      $Admin.event.getCoin(res);
    },
  };

  function blackListApply() {
    let _data = deepCopy(Data);
    let unlocked = unlock.get($archive);
    for (let i in _data) {
      for (let k in _data[i]) {
        if (i in unlocked && !unlocked[i].includes(k)) {
          delete _data[i][k];
        }
        if ($Admin.data.blackList.includes(k)) {
          delete _data[i][k];
        }
      }
    }
    data = _data;
  }
  function getCoin(amount) {
    $Admin.data.coin += amount;
    msg({ content: `获得${amount}硬币` });
    $Admin.data["coin_reward_total"] += amount;
    $Admin.sound("coin");
  }
  function getItem(_type, key) {
    blackListApply();
    type = _type;
    source = [key];
    show = true;
    worth = -1;
    setTimeout(_ => selected = 0, 400)
  }
  function loadCollection(_color, fromAll) {
    blackListApply();
    type = "collection";
    source = Object.keys(data.collection)
      .filter((c) => data.collection[c].type == _color)
      .rd();
    if (!fromAll) source = source.splice(0, $Admin.data.sugar);
    else source = source.splice(0, 10);
    show = true;
    if (_color == "blue") worth = 100;
    if (_color == "green") worth = 300;
    if (_color == "red") worth = 750;
    setTimeout((_) => $Admin.guide.add("get_collection"));
  }
  function loadEquipment(fromAll) {
    blackListApply();
    type = "equipment";
    color = "gold";
    source = Object.keys(data.equipment).rd().splice(0, $Admin.data.sugar);
    show = true;
    worth = 250;
    setTimeout((_) => $Admin.guide.add("get_equipment"));
  }
  function loadSouvenir(fromAll) {
    blackListApply();
    type = "souvenir";
    color = "purple";
    source = Object.keys(data.souvenir).rd().splice(0, $Admin.data.sugar);
    show = true;
    worth = 200;
    sector.getSouvenir($Admin);
    setTimeout((_) => $Admin.guide.add("get_souvenir"));
  }
  function loadSpellcard(fromAll) {
    blackListApply();
    type = "spellcard";
    source = Object.keys(data.spellcard)
      .filter((s) => data.spellcard[s].role == $Admin.data.role)
      .rd()
      .splice(0, fromAll ? 10 : $Admin.data.sugar);
    show = true;
    worth = 250;
  }
  function loadBasecard(fromAll) {
    blackListApply();
    type = "basecard";
    source = Object.keys(data.basecard).rd().splice(0, $Admin.data.sugar);
    show = true;
    worth = 200;
  }
  function forgetCard(fromAll) {
    type = "forget";
    source = Object.unCount($Admin.data.card);
    show = true;
    worth = 0;
  }
  function heal(value, isPercent) {
    let health = growth.role[$Admin.data.role].health;
    if ($Admin.data.rule.includes("rule_magnify")) health /= 2;
    let Health = $Admin.data.health;
    let h;
    if (isPercent) {
      h = Math.min(health - Health, (health * value) / 100);
    } else h = Math.min(health - Health, value);
    $Admin.data.health += h;
  }
  function loseHealth(value, isPercent) {
    let health = growth.role[$Admin.data.role].health;
    if ($Admin.data.rule.includes("rule_magnify")) health /= 2;
    let Health = $Admin.data.health;
    let lose = value;
    if (isPercent) lose = (health * value) / 100;
    if (lose > Health) {
      return false;
    } else {
      $Admin.data.health -= lose;
      return true;
    }
  }
  function copy(_type) {
    blackListApply();
    if (Object.keys($Admin.data[_type]).length > 0) {
      type = _type;
      source = Object.keys($Admin.data[type]);
      show = true;
      worth = 100;
      return true;
    } else {
      msg({ content: "你还没有这玩意儿" });
      return false;
    }
  }
  function change(_type) {
    blackListApply();
    if (Object.keys($Admin.data[_type]).length > 0) {
      type = _type;
      special = "change";
      source = Object.keys($Admin.data[type]);
      show = true;
      worth = 20;
      return true;
    } else {
      msg({ content: "你还没有这玩意儿" });
      return false;
    }
  }
  function sellCollection(sold) {
    blackListApply();
    type = "collection";
    special = "sellCollection";
    cache.sellCollection = sold;
    source = Object.keys($Admin.data.collection).filter(
      (c) => !sold.includes(c),
    );
    show = true;
    worth = 0;
  }
  function confirm() {
    $Admin.sound("btn");
    let _type = type;
    if (selected != null) {
      if (type == "forget") {
        let _card = {};
        Object.assign(_card, Data.spellcard);
        Object.assign(_card, Data.basecard);
        msg({ content: `忘却[${_card[source[selected]].name}]` });
        source[selected].decreaseOf($Admin.data.card);
      } else if (special) specialHandle[special]();
      else {
        msg({ content: `获得[${data[type][source[selected]].name}]` });
        if (type != "equipment" && type != "souvenir") {
          if (type == "spellcard" || type == "basecard") _type = "card";
          source[selected].increaseOf($Admin.data[_type]);
        } else if ($Admin.data.equipment == "messenger" && type == "souvenir") {
          if ($Admin.data.souvenir)
            $Admin.data.additional_souvenir = source[selected];
          else $Admin.data.souvenir = source[selected];
        } else $Admin.data[type] = source[selected];
      }
      close();
      $Admin.sound("reward");
    } else msg({ content: "请选择一个" });
  }
  function skip() {
    $Admin.sound("btn");
    worth != 0 && $Admin.event.getCoin(worth);
    close();
  }
  function close() {
    show = false;
    color = null;
    selected = null;
    source = [];
    special = null;
  }
  function unlockCard(type) {
    let source;
    if (type == "spellcard")
      source = Data.keys()[type].filter(
        (s) => Data[type][s].lock && Data[type][s].role == $Admin.data.role,
      );
    else source = Data.keys()[type].filter((s) => Data[type][s].lock);
    if (!$archive.unlocked[type]) $archive.unlocked[type] = [];
    let key = source
      .filter((k) => !$archive.unlocked[type].includes(k))
      .rd()[0];
    if (key && !$archive.unlocked[type].includes(key)) {
      msg({
        content: `已解锁卡牌[${Data[type][key].name}]，可在灵感中查看。`,
      });
      if (type == "spellcard") {
        if (!$Admin.cache["unlockedSpellcard"])
          $Admin.cache["unlockedSpellcard"] = [];
        $Admin.cache["unlockedSpellcard"].push(key);
      }
      if (type == "basecard") {
        $archive.unlocked[type].push(key);
        $Admin.upload();
      }
    }
  }
  function unlockRule() {
    let key = Data.keys()
      .rule.filter((r) => !$archive.unlocked.rule.includes(r))
      .rd()[0];
    if (!key) return;
    msg({ content: `已解锁信物[${Data.rule[key].name}]` });
    $Admin.cache["unlockedRule"] = key;
  }
</script>

{#if show}
  <div class="body" in:fade={{ duration: 250 }} out:fade={{ duration: 250 }}>
    <div class="selections reward container" bind:this={element_container}>
      {#each source as k, i (i)}
        <div
          class="box {type} {selected == i && 'selected'}"
          bind:this={element[i]}
        >
          {#if type != "spellcard" && type != "basecard" && type != "forget" && type != "card"}
            <div
              class="item"
              style="background-color:var(--{type == 'collection'
                ? data[type][k].type
                : color});"
              in:scale={{ duration: 250 }}
              out:scale={{ duration: 250 }}
            >
              <icon class="icon-{k}" />
              <txt>{data[type][k].name}</txt>
            </div>
          {:else}
            <Card key={k} />
          {/if}
        </div>
      {/each}
    </div>
    <div class="btns">
      <div class="btn" on:click={confirm}>确定</div>
      {#if worth >= 0}
        <div class="btn" on:click={skip}>
          {#if worth > 0}
            跳过并获得{worth}<icon class="icon-coin"></icon>
          {:else}
            跳过
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .body {
    position: absolute;
    z-index: 9;
    backdrop-filter: blur(16px) saturate(150%) brightness(1.2);
    transition: 0.4s;
    --blue: rgb(103, 186, 255);
    --purple: #c84df0;
    --green: #60d560;
    --red: #e55c5c;
    --gold: #ffe661;
    --gray: rgb(128, 128, 128);
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
  .selections {
    max-width: 930px;
    max-height: 440px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 25px;
  }
  .box {
    margin: 15px;
    transition: 0.3s;
  }
  .box.spellcard,
  .box.basecard {
    zoom: 1.1;
  }
  .item {
    width: 140px;
    height: 190px;
    --shadow: #777;
    color: white;
    align-items: center;
    border-radius: 8px;
    border: 4px solid #fff;
    filter: drop-shadow(0 0 4px #555);
    transition: 0.3s;
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
  }
  .item icon {
    font-size: 90px;
    margin: 16px;
  }
  .item txt {
    font-size: 20px;
    font-family: title;
    width: 100px;
    text-align: center;
    line-height: 24px;
  }

  .btns {
    margin: 10px;
  }
  .btn {
    flex-direction: row;
    justify-content: center;
    line-height: 30px;
    font-size: 28px;
    font-family: normal;
    text-shadow:
      0 0 2px #777,
      0 0 2px #777,
      0 0 2px #777,
      0 0 2px #777,
      0 0 2px #777,
      0 0 2px #777,
      0 0 2px #777;
    color: white;
    cursor: pointer;
    transition: 0.2s;
    opacity: 0.6;
    margin: 10px;
  }
  .btn icon {
    font-size: 30px;
    filter: drop-shadow(0 0 3px #555);
    transition: 0.2s;
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

  .selected {
    transform: scale(1.2);
    filter: drop-shadow(0 0 16px rgba(119, 119, 119, 0.5));
  }
</style>
