<script>
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { data, setting, Explain } from "../store";
  import role from "../data/role.json";
  import collection from "../data/collection.json";
  import equipment from "../data/equipment.js";
  import souvenir from "../data/souvenir.json";
  import spellcard from "../data/spellcard.js";

  let type;
  let sort;
  const chance = {
    easy: {
      name: "轻松",
      detail:
        "有3次战败时回到战斗前的机会。机会消耗时，回复生命值并获得一件普通收藏品。",
      type: "blue",
      amount: 3,
    },
    normal: {
      name: "平实",
      detail:
        "有2次战败时回到战斗前的机会。机会消耗时，回复生命值并获得一件稀有收藏品。",
      type: "green",
      amount: 2,
    },
    hard: {
      name: "紧张",
      detail:
        "有1次战败时回到战斗前的机会。机会消耗时，回复生命值并获得一件传奇收藏品。",
      type: "red",
      amount: 1,
    },
  };
  const other = {
    equipment,
    souvenir,
    collection,
    spellcard,
    chance,
    sugar: {},
    role,
  };
  export const selector = (t, s, f) => {
    if (t) {
      type = t;
      if (f) Selected = f;
      if (type == "equipment") sort = "gold";
      else if (type == "souvenir") sort = "purple";
      else sort = s;
    } else {
      type = null;
      setTimeout((_) => (selected = false), 300);
    }
  };
  export let selected = false;
  let Selected = (_) => null;

  let sugarSelect = 0;
  let sugars = [0, 1, 2, 3, 4].map((i) => sugarR(i));
  let explain;

  $: set = !type
    ? []
    : type == "collection"
      ? Object.keys(collection)
          .filter((c) => collection[c].type == sort)
          .rd()
          .splice(-$data.sugar)
      : Object.keys(other[type]).rd().splice(-$data.sugar);

  onMount((_) => (explain = $Explain));

  function select(t, value) {
    explain.hide();
    type = null;
    selected = true;
    Selected();
    if (t == "sugar") $data.sugar = value;
    else if (["role", "chance"].includes(t)) $data[t] = value;
    else if (["equipment", "souvenir"].includes(t)) $data[t] = value;
    else value in $data[t] ? $data[t][value]++ : ($data[t][value] = 1);
  }
  function sugarR(i) {
    return `left:${i * 50 + r() * 20 + 20}px;top:${
      r() * 70
    }px;transform:rotate(${360 * r()}deg);`;
  }
  function r() {
    return Math.random();
  }
</script>

<div class="selections">
  {#if type == "sugar"}
    <div class="sugar" out:fade={{ duration: 150 }}>
      {#each [0, 1, 2, 3, 4] as i (i)}
        <icon
          class="icon-sugar"
          style="{sugars[i]}{i <= sugarSelect &&
            'filter:drop-shadow(0 0 4px #777)'}"
          on:mouseenter={(_) => (sugarSelect = i)}
          on:click={(_) => select("sugar", i + 1)}
        ></icon>
      {/each}
    </div>
  {/if}
  {#if type == "chance"}
    <div class="chance">
      {#each ["easy", "normal", "hard"] as c}
        <div
          out:scale={{ duration: 200 }}
          on:mouseenter={(e) => explain.show(e)}
          on:mousemove={(e) => explain.move(e, chance[c], chance[c].type)}
          on:mouseleave={(_) => explain.hide()}
          on:click={(_) => select(type, chance[c])}
        >
          <txt>{chance[c].name}</txt>
          <icon class="icon-select"></icon>
        </div>
      {/each}
    </div>
  {/if}
  {#if type == "role"}
    <div class="role" out:fade={{ duration: 150 }}>
      {#each Object.keys(role).rd().splice(-$data.sugar) as r}
        <div
          style="background-image:var(--{r})"
          on:click={(_) => select("role", r)}
        >
          <img src="/img/role/{$setting.resource}/{r}.webp" />
          <div>
            <txt class="name">{role[r].name}</txt>
            <txt class="detail">{role[r].detail}</txt>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  {#if ["collection", "equipment", "souvenir"].includes(type)}
    <div class="collection">
      <img
        in:scale={{ duration: 200 }}
        src="/img/{['spring', 'summer', 'autumn', 'winter'].rd()[0]}.webp"
      />
      {#each set as c}
        <div>
          <div
            out:scale={{ duration: 200 }}
            style="background-color:var(--{sort});filter:saturate({0.5 +
              r()}) hue-rotate({sort == 'gold'
              ? r() * 20 - 10
              : r() * 40 - 20}deg);"
            on:mouseenter={(e) => explain.show(e)}
            on:mousemove={(e) => explain.move(e, other[type][c], sort)}
            on:mouseleave={(_) => explain.hide()}
            on:click={(_) => select(type, c)}
          >
            <div>
              <icon class="icon-{c}"></icon>
            </div>
          </div>
        </div>
      {/each}
      <img
        in:scale={{ duration: 200 }}
        src="/img/{['spring', 'summer', 'autumn', 'winter'].rd()[0]}.webp"
      />
    </div>
  {/if}
</div>

<style>
  .sugar {
    width: 300px;
    height: 200px;
    /* background-color: #4e342e; */
    background-image: url("/img/coffee.webp");
    background-size: 150px;
    background-position: center bottom;
    background-repeat: no-repeat;
    border-radius: 16px;
    position: relative;
    animation: output 0.4s forwards;
  }
  .sugar icon {
    font-size: 30px;
    position: absolute;
    cursor: pointer;
    transition: 0.2s;
    filter: drop-shadow(0 0 4px #ccc);
    color: whitesmoke;
  }

  .role {
    flex-direction: row;
  }
  .role > div {
    overflow: hidden;
    width: 80px;
    height: 80px;
    border-radius: 50px;
    margin: 5px;
    transition: 0.3s;
    background-color: white;
    flex-wrap: wrap;
    justify-content: center;
    --reimu: linear-gradient(90deg, rgb(233 113 113), white);
    --shion: linear-gradient(90deg, rgb(111, 111, 203), white);
    --youmu: linear-gradient(90deg, #4f8086, white);
    --marisa: linear-gradient(90deg, rgb(255, 233, 110), white);
    --aya: linear-gradient(
      90deg,
      rgb(221 82 61),
      rgb(228 214 158),
      rgb(252 236 211)
    );
    animation: output 0.4s;
  }
  .role > div:hover {
    width: 200px;
  }
  .role > div > div {
    width: 100px;
    margin-right: 15px;
    margin-left: 5px;
    text-shadow:
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff;
  }
  .role img {
    border-radius: 50%;
    border: 6px solid white;
    height: 80px;
    width: 80px;
    box-sizing: border-box;
    background-color: #ddd;
  }
  .role .name {
    font-family: normal;
    font-size: 18px;
    font-weight: bold;
    color: #666;
  }
  .role .detail {
    font-family: seto;
    font-size: 14px;
    line-height: 14px;
    color: #888;
  }

  .collection {
    flex-direction: row;
  }
  .collection > div {
    width: 60px;
    height: 120px;
    margin: 5px;
    align-items: center;
    transition: 0.2s;
    animation: output 0.4s;
  }
  .collection > div > div {
    width: 120px;
    height: 120px;
    align-items: center;
    box-sizing: border-box;
    --blue: rgb(146, 173, 255);
    --green: rgb(146, 255, 162);
    --red: rgb(255, 146, 146);
    --gold: rgb(239, 231, 119);
    --purple: rgb(224, 146, 255);
    cursor: pointer;
  }
  .collection > div:hover {
    filter: brightness(1.1);
    transform: scale(1.1);
  }
  .collection > div:nth-child(even) > div {
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    padding-top: 6px;
  }
  .collection > div:nth-child(odd) > div {
    clip-path: polygon(0 100%, 100% 100%, 50% 0);
    padding-top: 53px;
  }
  .collection > div > div > div {
    width: 60px;
    height: 60px;
    border: 4px solid white;
    border-radius: 50%;
    box-sizing: border-box;
    backdrop-filter: saturate(0.7);
    background-color: rgba(217, 217, 217, 0.3);
  }
  .collection icon {
    font-size: 36px;
    margin: auto;
    color: white;
  }
  .collection > img {
    width: 50px;
    height: 50px;
    animation: rotate 4s infinite linear;
    margin: auto;
    margin-bottom: 20px;
  }

  .chance {
    flex-direction: row;
  }
  .chance > div {
    position: relative;
    height: 100px;
    width: 100px;
    padding: 10px;
    margin: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    animation: output 0.4s;
    clip-path: circle(44%);
  }
  .chance icon {
    position: absolute;
    opacity: 0;
    font-size: 119px;
    transition: 0.2s;
    color: #777;
  }
  .chance txt {
    line-height: 100px;
    font-size: 32px;
    font-family: seto;
    font-weight: bold;
    color: #555;
  }
  .chance > div:hover icon {
    opacity: 1;
  }

  @keyframes output {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }

    80% {
      opacity: 1;
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
