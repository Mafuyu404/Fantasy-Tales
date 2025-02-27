<script>
  import { Admin, setting, Explain, archive } from "../store";
  import Data from "../data/data";

  let selected;
  let show = false;

  $Admin.achievement = achievement;

  function achievement(key) {
    if (!$archive.unlocked.achievement.includes(key)) {
      if (!$archive.unlocked.achievement) $archive.unlocked.achievement = [];
      $archive.unlocked.achievement.push(key);
      // $Admin.data.achievement.push(key);
      show = true;
      selected = key;
      setTimeout(function () {
        show = false;
        selected = null;
      }, 4000);
    }
  }
</script>

{#if show}
  <div class="achievement">
    <div class="achievement_body">
      <icon
        style="background-color:var(--{Data.split()[
          Data.achievement[selected].icon
        ].type})"
        class="icon-{Data.achievement[selected].icon}"
      ></icon>
      <div>
        <txt class="name">{Data.achievement[selected].name}</txt>
        <txt class="detail">{Data.achievement[selected].detail}</txt>
      </div>
    </div>
  </div>
{/if}

<style>
  .achievement {
    z-index: 12;
    filter: drop-shadow(0 0 4px #777);
    margin: 5px;
    animation: achievement 4s forwards;
    position: absolute;
    top: 10px;
    --blue: rgb(103, 186, 255);
    --purple: #c84df0;
    --green: #60d560;
    --red: #e55c5c;
    --gold: #ffe661;
    --gray: rgb(128, 128, 128);
  }
  .achievement_body {
    flex-direction: row;
    width: 320px;
    height: 70px;
    background-color: white;
    font-family: remark;
    clip-path: polygon(20px 0, 320px 0, 320px 50px, 300px 70px, 0 70px, 0 20px);
  }
  .achievement icon {
    width: 70px;
    height: 70px;
    font-size: 48px;
    line-height: 70px;
    text-align: center;
    color: white;
    --shadow: rgba(119, 119, 119, 0.5);
    text-shadow:
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow),
      0 0 3px var(--shadow);
    flex-shrink: 0;
    margin-right: 8px;
  }
  .achievement .name {
    color: #666;
    font-size: 18px;
    margin-top: 5px;
  }
  .achievement .detail {
    color: #888;
    font-size: 14px;
  }

  @keyframes achievement {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }

    8% {
      opacity: 1;
      transform: scale(1.2);
    }

    10% {
      transform: scale(1);
    }
    90% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.6);
      opacity: 0;
    }
  }
</style>
