<script>
  import { Admin, Explain, archive } from "../../store";
  import { onMount, beforeUpdate } from "svelte";
  import data from "../../data/data";
  import unlock from "../../data/unlock";
  export let info;

  let product;
  let selected;
  const element = [];

  let _data = deepCopy(data);
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
  const Data = _data;

  const collection = {};
  ["blue", "green", "red"].map((type) => {
    collection[type] = function () {
      let key = Data.keys()
        .collection.filter(
          (c) =>
            Data.collection[c].type == type &&
            !$Admin.data.blackList.includes(c),
        )
        .rd()[0];
      let piece = {
        blue: 200,
        green: 500,
        red: 1000,
      };
      let left = {
        blue: 4,
        green: 2,
        red: 1,
      };
      return {
        key: key,
        color: type,
        piece: piece[type],
        left: left[type],
      };
    };
  });

  if (info.cache.product) product = info.cache.product;
  else info.cache.product = summonProduct();

  onMount(function () {
    element.forEach((e, i) => {
      let info;
      if (product[i].key in Data.collection) {
        info = deepCopy(Data.collection[product[i].key]);
        let amount = 0;
        if (product[i].key in $Admin.data.collection)
          amount = $Admin.data.collection[product[i].key];
        if (!info.detail.includes(`* [`))
          info.detail += `\n* [ 已有: ${amount} ]`;
      } else info = Data.equipment[product[i].key];
      $Explain(e).color(product[i].color).with(info);
      e.onclick = (_) => {
        selected = i;
        $Admin.sound("select");
      };
    });
  });

  function summonProduct() {
    let res = [];
    let data = {
      red: 1,
      green: 2,
      blue: 3,
    };
    for (let type in data) {
      [...Array(data[type]).keys()].forEach((_) =>
        res.push(collection[type]()),
      );
    }
    if (Math.random() > 0.5) {
      res[0] = {
        key: Data.keys().equipment.rd()[0],
        color: "gold",
        piece: 500,
        left: 1,
      };
    }
    product = $Admin.discount(res);
    return res;
  }
  function purchase(p) {
    if (p.color != "gray") {
      if ($Admin.data.coin >= p.piece) {
        product = product;
        $Admin.data.coin -= p.piece;
        p.left--;
        if (p.color == "gold") {
          if ($Admin.data.sugar == 20) {
            $Admin.event.getEquipment();
          } else {
            $Admin.data.equipment = p.key;
            msg({ content: `已购买[${Data.equipment[p.key].name}]` });
          }
        } else {
          if ($Admin.data.sugar == 20) {
            $Admin.event.getCollection(p.color);
          } else {
            p.key.increaseOf($Admin.data.collection);
            msg({ content: `已购买[${Data.collection[p.key].name}]` });
          }
        }
        if (p.left < 1) p.color = "gray";
        // 成就
        if (product.map((_p) => _p.left).sum() == 0) {
          $Admin.achievement("ac032");
        }
      } else msg({ content: "硬币不足" });
    }
  }
</script>

<div class="content">
  <txt>{info.detail}目前还有{$Admin.data.coin}硬币。</txt>
  {#if typeof selected == "number"}
    <txt class="purchase" on:click={(_) => purchase(product[selected])}
      >购买</txt
    >
  {/if}
  <div class="products">
    {#each product as p, i (i)}
      <div
        class="product {selected == i && 'selected'}"
        style="background-color:var(--{p.color});"
        bind:this={element[i]}
      >
        <icon class="icon-{p.key}" />
        <txt><icon class="icon-coin" />{p.piece}</txt>
      </div>
    {/each}
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
  .products {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 600px;
    margin-top: 10px;
  }
  .product {
    width: 140px;
    height: 180px;
    --blue: rgb(103, 186, 255);
    --purple: #c84df0;
    --green: #60d560;
    --red: #e55c5c;
    --gold: #ffe661;
    --gray: #aaa;
    --shadow: #777;
    color: white;
    align-items: center;
    border-radius: 8px;
    border: 4px solid #fff;
    filter: drop-shadow(0 0 4px #555);
    transition: 0.2s;
    margin: 10px;
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
  }
  .product > icon {
    font-size: 90px;
    margin: 20px;
  }
  .product txt {
    font-size: 24px;
    font-family: title;
    width: 100px;
    text-align: center;
    margin: 0;
  }
  .selected {
    transform: scale(1.15);
  }
  .purchase {
    position: absolute;
    top: 118px;
    font-size: 32px;
    left: 600px;
    cursor: pointer;
  }
  .purchase:active {
    transform: scale(0.9);
  }
</style>
