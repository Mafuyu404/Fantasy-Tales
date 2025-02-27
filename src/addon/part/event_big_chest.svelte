<script>
  import data from "../../data/data";
  import { Admin } from "../../store";

  export let info;

  if (!info.cache.count) info.cache.count = 0;
</script>

<div class="content">
  <txt>一次投币25，25%概率打开宝箱。</txt>
  <txt>已投{info.cache.count * 25}</txt>
  <br />
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      if ($Admin.data.coin >= 25) {
        info.cache.count++;
        $Admin.data.coin -= 25;
        let r1 = Math.random();
        let r2 = Math.random();
        if (r1 > 0.75) {
          // 成就
          if (info.cache.count < 3) {
            $Admin.achievement("ac027");
          }
          window.msg({ content: "宝箱打开了" });
          if (r2 < 0.5) $Admin.event.getEquipment();
          else if (r2 < 0.7) $Admin.event.getCollection("green");
          else $Admin.event.getCollection("red");
          $Admin.event.finish();
        } else window.msg({ content: "没什么动静" });
      }
      else {
        window.msg({ content: "硬币不足！" });
      }
    }}>投币</txt
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
