<script>
  import { Admin, Explain } from "../../store";
  import { onMount, beforeUpdate } from "svelte";
  import Collection from "../../data/collection.json";
  import Equipment from "../../data/equipment.js";
  import Souvenir from "../../data/souvenir.json";
  import Spellcard from "../../data/spellcard.js";
  import Consumable from "../../data/consumable.json";
  import Basecard from "../../data/basecard.js";
  export let info;

  let product;
  let selected;
  const element = [];

  if (info.cache.product) product = info.cache.product;
  else {
    info.cache.product = summonProduct();
    product = info.cache.product;
  }

  onMount(function () {
    element.forEach((e, i) => {
      let info = {
        forget: {
          name: "忘却",
          detail: "忘却指定的一张牌。",
        },
        heal: {
          name: "休憩",
          detail: "回复10生命值。",
        },
      };
      $Explain(e).color(product[i].color).with(info[product[i].key]);
      e.onclick = (_) => {
        selected = i;
        $Admin.sound("select");
      };
    });
  });

  function summonProduct() {
    let res = [
      {
        key: "forget",
        piece: 0,
        color: "red",
      },
      {
        key: "forget",
        piece: 300,
        color: "red",
      },
      {
        key: "forget",
        piece: 500,
        color: "red",
      },
      {
        key: "heal",
        piece: 150,
        color: "green",
      },
      {
        key: "heal",
        piece: 150,
        color: "green",
      },
      {
        key: "heal",
        piece: 150,
        color: "green",
      },
    ];
    product = $Admin.discount(res);
    return res;
  }
  function purchase(p) {
    if (p.color != "gray") {
      if ($Admin.data.coin >= p.piece) {
        product = product;
        $Admin.data.coin -= p.piece;
        if (p.color == "red") {
          $Admin.event.forgetCard();
          msg({ content: `忘却一张牌` });
        } else {
          $Admin.event.heal(10);
          msg({ content: `回复10生命值` });
        }
        p.color = "gray";
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
        style="background-color:var(--{p.color})"
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
    cursor: pointer;
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
