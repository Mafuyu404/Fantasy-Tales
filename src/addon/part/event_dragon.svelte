<script>
  import { Admin, explore } from "../../store";

  export let info;
  info;
</script>

<div class="content">
  <txt>双倍的强敌，双倍的高级奖励。</txt>
  <txt>双倍的BOSS，双倍的终极奖励。</txt>
  <br />
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      $explore.dragon++;
      window.msg({ content: "获得了龙神的注视" })
      $Admin.event.finish();
    }}>叉腰大笑</txt
  >
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
