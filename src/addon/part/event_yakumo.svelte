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
      $Admin.event.heal(100, true);
      $Admin.event.finish();
      window.msg({content:"感觉精神饱满"});
    }}>休息一下</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      $Admin.event.getSouvenir();
      $Admin.event.finish();
    }}>获得纪念品</txt
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
