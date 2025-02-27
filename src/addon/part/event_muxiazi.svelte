<script>
  import { Admin } from "../../store";

  export let info;

</script>

<div class="content">
  <txt>{info.detail}</txt>
  <br />
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      let r = Math.random();
      if (r > 0.6) {
        $Admin.event.getSpellcard();
        window.msg({content:"获得符卡"});
      }
      else {
        $Admin.event.getBasecard();
        window.msg({content:"获得通式"});
      }
      $Admin.event.finish();
    }}>打开</txt
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
