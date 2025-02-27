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
      $Admin.data.first_boss = "shiki";
      $Admin.event.finish();
    }}>四季映姬</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      $Admin.data.first_boss = "mokou";
      $Admin.event.finish();
    }}>藤原妹红</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      $Admin.data.first_boss = "kanako";
      $Admin.event.finish();
    }}>八坂神奈子</txt
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
