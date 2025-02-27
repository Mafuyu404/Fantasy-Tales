<script>
  import { beforeUpdate, onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { frameEvent, Admin } from "../store";

  let msgs = [];

  window.msg = Msg;

  onMount(function () {
    $frameEvent.add(
      "msg",
      (_) => (msgs = msgs.filter((m) => new Date().getTime() - m.time < 3000)),
      1,
    );
  });

  function Msg(info) {
    $Admin.sound("msg");
    info.time = new Date().getTime();
    info.key = r();
    msgs.push(info);
    msgs = msgs.filter((m) => info.time - m.time < 3000);
  }

  function r() {
    return Math.random();
  }
</script>

<div class="msg">
  {#each msgs as m, i (m.key)}
    <div
      on:click={(_) => (msgs = msgs.filter((_, index) => i != index))}
      in:scale={{ duration: 300 }}
      out:fade={{ duration: 300 }}
    >
      <img src="/logo.svg" />
      <div style="margin-bottom:4px">
        <txt class="title">{m.title ? m.title : "提示"}</txt>
        <txt class="content">{m.content}</txt>
      </div>
      <div class="tie" />
    </div>
  {/each}
</div>

<style>
  .msg {
    position: absolute;
    top: 0;
    z-index: 13;
  }

  .msg > div {
    position: relative;
    flex-direction: row;
    align-items: center;
    background-color: #e6e3eb;
    background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%239C92AC' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 30%;
    width: 270px;
    border-radius: 12px;
    border: 4px solid white;
    color: #666;
    padding: 2px 5px;
    margin: 5px;
    text-shadow:
      0 0 3px white,
      0 0 3px white,
      0 0 3px white,
      0 0 3px white,
      0 0 3px white,
      0 0 3px white,
      0 0 3px white;
    overflow: hidden;
    animation: msg 2.9s forwards;
    transition: 0.3s;
    filter:drop-shadow(0 0 2px #666)
  }
  .msg > div:hover {
    filter: drop-shadow(0 0 6px #fff);
  }

  img {
    height: 40px;
    margin-right: 5px;
  }

  .title {
    font-size: 22px;
    font-family: normal;
    font-weight: bold;
  }

  .tie {
    width: 0;
    height: 4px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #aaa;
    animation: tie 2.5s forwards linear;
  }

  .content {
    font-size: 18px;
    font-family: remark;
    line-height: 24px;
  }

  @keyframes tie {
    100% {
      width: 280px;
    }
  }

  @keyframes msg {
    86% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      visibility: hidden;
    }
  }
</style>
