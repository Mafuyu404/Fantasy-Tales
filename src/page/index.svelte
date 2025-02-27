<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { page, archive, explore, data, Explain, Admin } from "../store";
  import words from "../data/words.json";
  import unlock from "../data/unlock";

  onMount(function () {});
  afterUpdate(function () {});

  let pressed = false;
  let userform = false;
  let loading = false;
  let element_input;

  let txt1 = random();
  let txt2 = random();
  let txt3 = random();
  let txt4 = random();
  let txt5 = random();
  let txt6 = random();
  let txt7 = random();
  let txt8 = random();
  let txt9 = random();
  let txt0 = random();
  setTimeout((_) => setInterval((_) => (txt1 = random()), 2000), 200 * 0);
  setTimeout((_) => setInterval((_) => (txt2 = random()), 2000), 200 * 1);
  setTimeout((_) => setInterval((_) => (txt3 = random()), 2000), 200 * 2);
  setTimeout((_) => setInterval((_) => (txt4 = random()), 2000), 200 * 3);
  setTimeout((_) => setInterval((_) => (txt5 = random()), 2000), 200 * 4);
  setTimeout((_) => setInterval((_) => (txt6 = random()), 2000), 200 * 5);
  setTimeout((_) => setInterval((_) => (txt7 = random()), 2000), 200 * 6);
  setTimeout((_) => setInterval((_) => (txt8 = random()), 2000), 200 * 7);
  setTimeout((_) => setInterval((_) => (txt9 = random()), 2000), 200 * 8);
  setTimeout((_) => setInterval((_) => (txt0 = random()), 2000), 200 * 9);

  function random() {
    return {
      x: `${-40 - 160 * r()}px`,
      y: `${80 - 160 * r()}px`,
      word: words[Math.floor(r() * words.length)],
    };
  }
  function r() {
    return Math.random();
  }
  function enter() {
    $Admin.sound("btn");
    if (localStorage.getItem("user") == null) {
      userform = true;
    } else {
      pressed = true;
      if ($Admin.user) unlock.from($archive);
    }
  }
  function submit() {
    loading = true;
    $Admin.login(element_input.value, function () {
      userform = false;
      pressed = true;
      if ($Admin.user) unlock.from($archive);
    });
  }
  function resume() {
    $data = JSON.parse(localStorage.getItem("data"));
    $explore = JSON.parse(localStorage.getItem("explore"));
    if ($explore.enermy[0] == "yukari0") {
      $page = "Battle";
    }
    else $page = "Explore";
    $Admin.sound("btn");
  }

  $data = JSON.parse(localStorage.getItem("data"));
  $explore = JSON.parse(localStorage.getItem("explore"));
</script>

<div
  class="body"
  on:click|once={enter}
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
>
  <txt class="title">幻想异闻录</txt>
  <div class="content">
    {#if !pressed}
      <div class="words" out:fade={{ duration: 200 }}>
        {#each [txt1, txt2, txt3, txt4, txt5, txt6, txt7, txt8, txt9, txt0] as p, i (i)}
          <txt
            style="left:{p.x};top:{p.y};font-size:{26 -
              r() * 8}px;animation-delay:{i * 0.2}s"
          >
            {p.word}
          </txt>
        {/each}
      </div>
    {:else}
      <div class="menu" in:fade={{ duration: 200 }}>
        {#if localStorage.getItem("explore") && localStorage.getItem("explore").length > 10}
          <txt on:click={resume}>继续</txt>
        {/if}
        <txt on:click={(_) => {
          $Admin.sound("btn");
          $page = "Foreword";
        }}>开始</txt>
        <txt on:click={(_) => {
          $Admin.sound("btn");
          $page = "Afflatus";
          }}>灵感</txt>
        <txt on:click={(_) => {
          $Admin.sound("btn");
          $page = "Archive";
          }}>记录</txt>
        <!-- <txt>设定</txt>
      <txt>离去</txt> -->
      </div>
    {/if}
  </div>
  {#if userform}
    <div
      class="userform"
      in:fade={{ duration: 250 }}
      out:fade={{ duration: 250 }}
    >
      <div class="form">
        <txt>你的名字是?</txt>
        <input type="text" bind:this={element_input} />
        {#if loading}
          <img class="loading" src="/img/loading.gif">
          {:else}
          <txt class="btn" on:click={submit}>确定</txt>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .loading {
    height: 50px;
    mix-blend-mode: darken;
  }
  .userform {
    width: 100%;
    height: 100%;
    backdrop-filter: brightness(1.4) contrast(1.4) blur(8px);
    position: absolute;
  }
  .form {
    margin: auto;
    background-color: #e9e9e9;
    color: #ad4234;
    font-family: remark;
    font-size: 24px;
    border-radius: 12px;
    box-shadow:
      0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
      0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
    height: 240px;
    width: 400px;
    align-items: center;
    justify-content: center;
  }
  .form input {
    color: #ad4234;
    background: transparent;
    border: 0;
    border-bottom: 2.5px solid #ad4234;
    font-size: 22px;
    padding: 0.5rem 0.9rem;
    margin: 20px 0;
    width: 200px;
    text-align: center;
    font-family: none;
  }
  .form input:focus {
    outline: none;
  }
  .btn {
    height: 50px;
    line-height: 45px;
    color: white;
    background-color: rgb(233, 113, 113);
    border: 4px solid rgb(233, 113, 113);
    border-radius: 8px;
    box-shadow:
      0 4px 8px 0 rgba(0, 0, 0, 0.2),
      0 3px 10px 0 rgba(0, 0, 0, 0.19);
    font-size: 20px;
    letter-spacing: 0.2rem;
    padding: 0rem 1.5rem;
    transition: all 0.3s;
    cursor: pointer;
  }

  .btn:hover {
    background-color: transparent;
    color: rgb(233, 113, 113);
    box-shadow: none;
  }
  .btn:active {
    transform: scale(0.9);
  }

  .menu {
    font-size: 30px;
    color: white;
    font-family: normal;
    line-height: 50px;
    text-shadow:
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888,
      0 0 2px #888;
  }
  .menu > txt {
    cursor: pointer;
    transition: 0.2s;
    opacity: 0.6;
  }
  .menu > txt:hover {
    transform: scale(1.2);
    opacity: 1;
  }
  .menu > txt:active {
    text-shadow:
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff;
  }

  .body {
    align-items: center;
    justify-content: center;
    background-image: url("/img/scene/index.webp");
  }
  .content {
    width: 100%;
    height: 200px;
    align-items: center;
    justify-content: center;
  }

  txt.title {
    font-size: 150px;
    line-height: 200px;
    font-family: penetrate;
    color: #555;
    text-shadow:
      0 0 6px white,
      0 0 6px white,
      0 0 6px white,
      0 0 6px white,
      0 0 6px white,
      0 0 6px white,
      0 0 6px white;
  }

  .words {
    top: 50%;
    height: 100%;
    position: relative;
    align-items: center;
    justify-content: center;
    font-family: title;
  }
  .words txt {
    opacity: 0;
    color: white;
    font-size: 24px;
    position: absolute;
    width: 240px;
    text-align: center;
    animation: word 2s infinite;
    text-shadow:
      0 0 1px #666,
      0 0 1px #666,
      0 0 1px #666,
      0 0 1px #666,
      0 0 1px #666,
      0 0 1px #666,
      0 0 1px #666;
  }

  @keyframes word {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
  @keyframes press {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
</style>
