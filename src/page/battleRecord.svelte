<script>
  import { explore } from "../store";
  import enermySpellcard from "../data/enermySpellcard.json";
  import enermy from "../data/enermy.json";

  let Record = [];
  let clear = false;
  export const record = {
    add: (r) => (Record = [...Record, r]),
    clear: (_) => {
      clear = true;
      setTimeout((_) => {
        Record = [];
        clear = false;
      }, 500);
    },
  };

  const Explore = deepCopy($explore);
  const Enermy = Explore.target
    .map((t, i) => t && Explore.enermy[i])
    .filter((e) => e);
</script>

<div class="record {clear && 'clear'}">
  {#each Record as r, i (i)}
    <div
      class={Enermy[r.enermy]}
      style={clear &&
        `animation-delay:${
          (0.5 / (Record.length - 1)) * (Record.length - 1 - i)
        }s`}
    >
      <div>
        <txt class="title">{enermySpellcard[r.spellcard].detail}</txt>
        <txt class="detail">{enermySpellcard[r.spellcard].name}</txt>
      </div>
      <img
        src={`/img/enermy/${enermy[Enermy[r.enermy]].type}/${
          Enermy[r.enermy]
        }/icon.webp`}
      />
      <txt>{i + 1}</txt>
    </div>
  {/each}
</div>

<style>
  .record {
    flex-direction: row-reverse;
    align-items: center;
    height: 64px;
  }

  .record > div {
    position: relative;
    align-items: center;
    margin: 3px;
    animation: new 0.4s forwards;
    transition: 0.2s;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 4px solid white;
    color: var(--content);
    z-index: 1;
  }

  .clear > div {
    animation: clear 0.2s forwards;
  }

  .record img {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: #ddd;
    opacity: 1;
    border-radius: 100%;
    margin: auto;
    transition: 0.2s;
  }

  .record > div > txt {
    position: absolute;
    right: 0px;
    bottom: 0px;
    color: white;
    text-shadow: 0 0 3px #666, 0 0 3px #666, 0 0 3px #666, 0 0 3px #666,
      0 0 3px #666, 0 0 3px #666, 0 0 3px #666;
    transition: 0.2s;
  }

  .record > div:hover > txt {
    opacity: 0;
  }

  .record > div:hover {
    width: 120px;
    height: 120px;
    border-radius: 16px;
    border: 4px solid var(--content);
    background-color: var(--bg);
    align-items: center;
    justify-content: space-between;
  }

  .record > div:hover > img {
    width: 120px;
    height: 120px;
    opacity: 0;
    border-radius: 12px;
  }

  .record > div:hover > div {
    transform: scale(1);
    opacity: 1;
  }

  .record > div > div {
    align-items: center;
    justify-content: space-between;
    opacity: 0;
    width: 120px;
    height: 120px;
    transform: scale(0.5);
    transition: 0.2s;
  }

  .record .title {
    font-size: 14px;
    text-align: center;
    height: 92px;
    display: flex;
    align-items: center;
    font-family: remark;
    width: 85%;
  }

  .record .detail {
    font-size: 18px;
    font-weight: bold;
    border-top: 2px solid var(--content);
    line-height: 28px;
    width: 85%;
    text-align: center;
    font-family: normal;
  }

  @keyframes new {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }

    60% {
      opacity: 1;
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes clear {
    100% {
      transform: rotateX(90deg);
    }
  }

  .record .lilywhite {
    --bg: white;
    --content: rgb(255 103 102);
  }

  .record .cirno {
    --bg: rgb(125 138 193);
    --content: rgb(235 241 245);
  }
</style>
