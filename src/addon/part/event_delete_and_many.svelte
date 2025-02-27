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
  else info.cache.product = summonProduct();
  if (!info.cache.gray) info.cache.gray = [false, false];

  onMount(function () {
    element.forEach((e, i) => {
      let type = ["blue", "green"][i];
      let info = {
        name: "接受",
        detail: `不会再有机会获得[${Collection[product[type][0]].name}]，但获得[${Collection[product[type][1]].name}]*${type == "blue" ? 5 : 3}。
* [ ${Collection[product[type][0]].name} ] :
${Collection[product[type][0]].detail}
* [ ${Collection[product[type][1]].name} ] :
${Collection[product[type][1]].detail}`,
      };
      $Explain(e).color(type).with(info);
      e.onclick = (_) => (selected = i);
    });
  });

  function summonProduct() {
    let res = {};
    ["blue", "green"].forEach(
      (type) =>
        (res[type] = Object.keys(Collection)
          .filter((c) => Collection[c].type == type)
          .rd()
          .splice(0, 2)),
    );
    product = res;
    return res;
  }
  function purchase(i) {
    let type = ["blue", "green"][i];
    if (!info.cache.gray[i]) {
      product = product;
      let amount = type == "blue" ? 5 : 3;
      product[type][1].increaseOf($Admin.data.collection);
      $Admin.data.collection[product[type][1]] += amount - 1;
      delete $Admin.data.collection[product[type][0]];
      $Admin.data.blackList.push(product[type][0]);
      msg({ content: `获得[${Collection[product[type][1]].name}]*${amount}` });
      info.cache.gray[i] = true;
    }
  }
</script>

<div class="content">
  <txt>{info.detail}</txt>
  {#if typeof selected == "number"}
    <txt class="purchase" on:click={(_) => purchase(selected)}>接受</txt>
  {/if}
  <div class="products">
    {#each ["blue", "green"] as type, i (i)}
      <div
        class="product {selected == i && 'selected'}"
        style="background-color:var(--{info.cache.gray[i] ? 'gray' : type});"
        bind:this={element[i]}
      >
        <div><icon class="icon-{product[type][0]}" /><txt>×</txt></div>
        <div>
          <icon class="icon-{product[type][1]}" /><txt
            >{type == "blue" ? 5 : 3}</txt
          >
        </div>
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
    justify-content: center;
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
  .product div {
    flex-direction: row;
    align-items: center;
    margin: 10px;
  }
  .product icon {
    font-size: 60px;
  }
  .product txt {
    font-size: 40px;
    font-family: title;
    width: 40px;
    text-align: center;
  }
  .product:active {
    transform: scale(0.9);
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
