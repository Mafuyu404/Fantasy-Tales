<script>
  import { Admin, Explain, archive } from "../../store";
  import { onMount, beforeUpdate } from "svelte";
  import Card from "../card.svelte";
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

  if (info.cache.product) product = info.cache.product;
  else info.cache.product = summonProduct();

  onMount(function () {
    element.forEach((e, i) => {
      e.onclick = (_) => {
        selected = i;
        $Admin.sound("select");
      };
    });
  });

  function summonProduct() {
    let amount = $Admin.data.sugar + 2;
    if (Data.keys().basecard.length == data.keys().basecard.length) amount++;
    let source = Data.keys().basecard.rd().splice(0, Math.min(8, amount));
    let res = source.map((c) => {
      return {
        key: c,
        piece: 300,
        sold: false,
      };
    });
    if (Data.keys().basecard.length != data.keys().basecard.length)
      res.push({
        key: "a001",
        piece: 1000,
        sold: false,
        unlock: true,
      });
    product = $Admin.discount(res);
    return res;
  }
  function purchase(p) {
    if (!p.sold) {
      if ($Admin.data.coin >= p.piece) {
        product = product;
        $Admin.data.coin -= p.piece;
        if (p.unlock) {
          $Admin.event.unlockCard("basecard");
        } else if ($Admin.data.sugar == 20) {
          $Admin.event.getBasecard();
        } else {
          p.key.increaseOf($Admin.data.card);
          msg({ content: `已购买[${Data.basecard[p.key].name}]` });
        }
        p.sold = true;
      } else msg({ content: "硬币不足" });
    }
  }
</script>

<div class="content">
  <txt>{info.detail}目前还有{$Admin.data.coin}硬币。</txt>
  {#if typeof selected == "number"}
    <txt class="purchase" on:click={(_) => purchase(product[selected])}
      >购买(<icon class="icon-coin" />{product[selected].piece})</txt
    >
  {/if}
  <div class="products">
    {#each product as p, i (i)}
      <div bind:this={element[i]} class="product {selected == i && 'selected'}">
        {#if i == product.length - 1}
          <Card
            key={p.key}
            cover={p.sold
              ? {
                  name: "空",
                  detail: "已售罄",
                }
              : {
                  name: "妖魔书",
                  detail: "解锁随机新通式",
                }}
          />
        {:else}
          <Card
            key={p.key}
            cover={p.sold && {
              name: "空",
              detail: "已售罄",
            }}
          />
        {/if}
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
  .purchase icon {
    font-size: 24px;
  }
</style>
