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
      $Admin.event.getSpellcard(true);
      $Admin.event.finish();
    }}>祈求进取</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      $Admin.event.getCollection("green", true);
      $Admin.event.finish();
    }}>祈求祝福</txt
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
  }
  .selection:hover {
    font-size: 60px;
  }
</style>
