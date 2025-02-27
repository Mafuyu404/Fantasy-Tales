<script>
  import { Admin, explore } from "../../store";

  export let info;
</script>

<div class="content">
  <txt>{info.detail}</txt>
  <br />
  {#if $Admin.data.stage == 2}
    <br />
    <br />
    <txt
      class="selection"
      on:click={(_) => {
        let scene;
        if ($explore.trip.length == 4)
          scene = ["town", "field"].filter(
            (s) => !$explore.trip.includes(s),
          )[0];
        else scene = ["town", "field"].rd()[0];
        $Admin.event.nextStage(scene);
      }}>走也</txt
    >
  {/if}
  {#if $Admin.data.stage != 2}
    <br />
    <br />
    <txt
      class="selection"
      on:click={(_) => {
        $Admin.data.stage = 1;
        $Admin.event.nextStage("forest");
      }}>前往魔法森林</txt
    >
    <br />
    <br />
    <txt
      class="selection"
      on:click={(_) => {
        $Admin.data.stage = 1;
        $Admin.event.nextStage("bridge");
      }}>前往安神桥</txt
    >
    {#if $Admin.data.stage == 3}
      <br />
      <br />
      <txt
        class="selection"
        on:click={(_) => {
          $Admin.event.finalBoss();
          window.msg({ content: "到达艮之境" });
        }}>前往<span style="background-color:#555">外面世界</span></txt
      >
    {/if}
  {/if}
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
  .selection {
    font-size: 50px;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
  .selection:hover {
    font-size: 60px;
  }
</style>
