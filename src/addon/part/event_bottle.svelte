<script>
  import { Admin } from "../../store";

  export let info;

  const selections = [
    {
      detail: "踢开",
      handle: [
        {
          content: "瓶子爆炸了，烟雾中出现了许多身影。",
          return: "summonElite(1)",
        },
        {
          content: "什么都没有发生",
          return: "null(null)",
        },
      ],
      weight: [1, 1],
    },
    {
      detail: "捡起",
      handle: [
        {
          content: "瓶子吸走了你10生命值，消失了。",
          return: "health(-10)",
        },
        {
          content: "光芒散去，瓶子里是一件收藏品。",
          return: "collection(white)",
        },
      ],
      weight: [4, 6],
    },
  ];
</script>

<div class="content">
  <txt>{info.detail}</txt>
  <br />
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      if (Math.random() < 0.5) {
        window.msg(selections[0].handle[0]);
        $Admin.event.summonZagu();
      } else {
        window.msg(selections[0].handle[1]);
      }
      $Admin.event.finish();
    }}>踢开</txt
  >
  <br />
  <br />
  <txt
    class="selection"
    on:click={(_) => {
      if (Math.random() < 0.4) {
        window.msg(selections[1].handle[0]);
        $Admin.data.health = Math.max(1, $Admin.data.health - 10);
      } else {
        window.msg(selections[1].handle[1]);
        $Admin.event.getCollection("green");
      }
      $Admin.event.finish();
    }}>捡起</txt
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
    width: 120px;
    text-align: center;
    cursor: pointer;
  }
  .selection:hover {
    transform: scale(1.2);
  }
</style>
