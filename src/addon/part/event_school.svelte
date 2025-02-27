<script>
  import { Admin, Explain, archive } from "../../store";
  import { onMount, beforeUpdate } from "svelte";
  import Card from "../card.svelte";
  import data from "../../data/data";
  import unlock from "../../data/unlock";

  export let info;

  let product;
  let count = 2;
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

  if (info.cache.product) product = info.cache.product;
  else info.cache.product = summonProduct();
  if (typeof info.cache.count == "number") count = info.cache.count;

  onMount(function () {
    element.forEach((e, i) => {
      e.onclick = (_) => {
        selected = i;
        $Admin.sound("select");
      };
    });
  });

  function summonProduct() {
    let source = Data.keys().spellcard
      .filter((s) => Data.spellcard[s].role == $Admin.data.role)
      .rd()
      .splice(0, Math.min(8, $Admin.data.sugar + 3));
    let res = source.map((c) => {
      return {
        key: c,
        sold: false,
      };
    });
    product = $Admin.discount(res);
    return res;
  }
  function purchase(p) {
    if (!p.sold) {
      if (count != 0) {
        product = product;
        if ($Admin.data.sugar == 20) {
          $Admin.event.getSpellcard();
        } else {
          p.key.increaseOf($Admin.data.card);
          msg({ content: `已学习[${Data.spellcard[p.key].name}]` });
        }
        p.sold = true;
        count--;
        info.cache.count = count;
      } else msg({ content: "时间精力不足！" });
    }
  }
</script>

<div class="content">
  <txt>{info.detail}</txt>
  <txt>大概还能学习&ensp;{count}&ensp;种符卡。</txt>
  {#if typeof selected == "number"}
    <txt class="purchase" on:click={(_) => purchase(product[selected])}
      >学习</txt
    >
  {/if}
  <div class="products">
    {#each product as p, i (i)}
      <div bind:this={element[i]} class="product {selected == i && 'selected'}">
        <Card
          key={p.key}
          cover={p.sold && {
            name: "空",
            detail: "已学习",
          }}
        />
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
  }
  txt {
    font-size: 20px;
    line-height: 30px;
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
    cursor: pointer;
    margin: 0px 10px;
    transition: 0.2s;
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
