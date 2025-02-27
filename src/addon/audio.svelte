<script>
  import { onMount, beforeUpdate } from "svelte";
  import { data, page, Admin } from "../store";

  let src = "/music/index.mp3";
  let music;
  let sounds = [];

  onMount(function () {
    music = document.getElementById("music");
    music.volume = 0.4;

    page.subscribe(bgmController);

    $Admin.sound = soundController.add;
    $Admin.music = music;
  });

  const soundController = {
    add: function (key) {
      sounds = [...sounds, key];
      setTimeout((_) => {
        for (let e of document.getElementsByTagName("audio")) {
          if (e.id != "music") e.volume = 0.5;
        }
      });
    },
  };

  function bgmController(p) {
    if (p == "Explore") src = "/music/explore.mp3";
    else if (p == "Battle")
      src = `/music/battle${Math.random().toFixed(0)}.mp3`;
    else if (p == "Index") src = "";
    else src = "/music/index.mp3";
    setTimeout((_) => (sounds = []), 500);
  }
</script>

<div class="audio">
  <audio id="music" {src} autoplay loop></audio>
  {#each sounds as s, i (i)}
    <audio src="/sound/{s}.mp3" autoplay></audio>
  {/each}
</div>
