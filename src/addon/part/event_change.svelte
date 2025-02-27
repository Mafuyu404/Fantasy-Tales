<script>
  import { Admin } from "../../store";

  export let info;

  if (!info.cache.count) info.cache.count = 3;
</script>

<div class="content">
  <txt>将一个东西转化成随机的东西，收藏品有可能会品质浮动，最多跨一级。</txt>
  <txt>剩余次数:&ensp;{info.cache.count}</txt>
  <br />
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      if (info.cache.count > 0) {
        let res = $Admin.event.change("card");
        if (res) {
          if (info.cache.count == 1) $Admin.event.finish();
          else info.cache.count--;
        }
      }
    }}>转化一张卡牌</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      if (info.cache.count > 0) {
        let res = $Admin.event.change("collection");
        if (res) {
          if (info.cache.count == 1) $Admin.event.finish();
          else info.cache.count--;
        }
      }
    }}>转化一个收藏品</txt
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
