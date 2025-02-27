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
      let res = $Admin.event.loseHealth(25, true);
      if (res) {
        let r = Math.random();
        $Admin.event.getCollection(r > 0.75 ? "red" : "green");
        $Admin.event.finish();
        window.msg({ content: "感谢您对爱心事业的贡献" });
      } else window.msg({ content: "亲，攒点血再来献吧！" });
    }}>献血(生命-25%)</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      $Admin.event.finish();
    }}>下次一定</txt
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
