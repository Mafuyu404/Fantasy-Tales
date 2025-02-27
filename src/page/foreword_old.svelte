<script>
  import { fade, scale } from "svelte/transition";
  import { page, data, explore } from "../store";
  import Selector from "../addon/selector.svelte";
  import spellcard from "../data/spellcard.json";
  import enermy from "../data/enermy.json";
  import growth from "../data/growth";

  let selected = false;
  let step = 0;
  let pointer = 0;
  let click = true;
  let story = [
    {
      type: "txt",
      value: "宇佐见莲子正对着笔记本电脑沉思。",
    },
    {
      type: "txt",
      value: "“终于要动笔了吗？”梅莉端着咖啡走来。",
    },
    {
      type: "txt",
      value: "“是啊。”莲子伸了个懒腰。",
    },
    {
      type: "txt",
      value: "“要加多少糖呢？”",
    },
    {
      type: "selector",
      value: "sugar",
    },
    {
      type: "txt",
      value: "“怎么还是空白的？”",
    },
    {
      type: "txt",
      value: "“因为还没决定好主基调。”莲子挠挠头。",
    },
    {
      type: "txt",
      value: "“时间多着呢，我会时不时偷窥并叫你重写的。”",
    },
    {
      type: "txt",
      value: "“也是，那就先试试吧。”",
    },
    {
      type: "selector",
      value: "chance",
    },
    {
      type: "txt",
      value: "“幻想交织在静谧的夜空之下——”莲子写道。",
    },
    {
      type: "txt",
      value: "“这句话有什么作用吗？”",
    },
    {
      type: "txt",
      value: "“文、文学的事情，你少管！”",
    },
    {
      type: "txt",
      value: "“少女坐在破旧的神社中。”她接着写，“其名为——”",
    },
    {
      type: "selector",
      value: "role",
    },
  ];
  let selector;

  function next() {
    if (story[step].type == "txt") step++;
    else if (selected) {
      click = false;
      setTimeout((_) => {
        if (step == story.length - 1) start();
        else {
          pointer = step + 1;
          step += 1;
          selector();
          selected = false;
          click = true;
          setTimeout((_) => next(), 200);
        }
      }, 1000);
    } else selector(story[step].value, "red");
  }

  next();

  function start() {
    const add = {
      enermy: (type) =>
        $explore.enermy.push(enermy.sort[$data.scene][type].rd()[0]),
    };
    add.enermy("normal");
    let amount = growth.amount($explore.lv);
    for (let i = 0; i < amount + 10; i++) add.enermy("normal");
    $data.spellcards[$data.role] = 4;
    spellcardAdd();
    spellcardAdd();
    $page = "Explore";
  }

  function spellcardAdd() {
    let name = Object.keys(spellcard).filter(s => spellcard[s].role == $data.role).rd()[0];
    if ($data.spellcards[name]) $data.spellcards[name]++;
    else $data.spellcards[name] = 1;
  }
</script>

<div
  class="body"
  in:fade={{ duration: 250 }}
  out:fade={{ duration: 250 }}
  on:click={(_) => click && next()}
>
  <div class="notebook">
    <div class="display">
      <div class="window">
        <div class="title">
          <txt>Notepad</txt>
          <div class="buttons">
            <div href="#" class="minimize" />
            <div href="#" class="resize" />
            <div href="#" class="close" />
          </div>
        </div>
        <div class="textarea">
          <div class="talk">
            {#each story.slice(pointer, step) as s, i}
              <txt
                class={i + pointer == step - 1 && "reading"}
                style="--length:{s.value.getByteLen() / 2 -
                  1};width:{s.value.getByteLen() - 2}ch;--time:{i + pointer ==
                step - 1
                  ? 0.2 * (s.value.getByteLen() / 2 - 1)
                  : 0}s">{s.value}</txt
              >
            {/each}
          </div>
          <Selector bind:selector bind:selected />
        </div>
      </div>
    </div>
    <div class="bottom" />
  </div>
</div>

<style>
  .body {
    background-color: #dfdbe5;
    background-image: url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 0h35v35H0V0zm5 5h25v25H5V5zm5 5h15v15H10V10zm5 5h5v5h-5v-5zM40 5h25v25H40V5zm5 5h15v15H45V10zm5 5h5v5h-5v-5zM70 35H35v35h35V35zm-5 5H40v25h25V40zm-5 5H45v15h15V45zm-5 5h-5v5h5v-5zM30 40H5v25h25V40zm-5 5H10v15h15V45zm-5 5h-5v5h5v-5z'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 400px;
  }
  .talk {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  .talk > txt {
    margin: 5px;
    font-size: 20px;
    font-family: normal;
    white-space: nowrap;
    overflow: hidden;
    animation: typing var(--time) steps(var(--length), end),
      cursor-blink 0.3s step-end infinite alternate;
  }
  .reading {
    border-right: 0.1px solid;
  }

  .notebook {
    font-size: 4px;
    position: relative;
    width: 1080px;
    margin: 60px auto;
  }
  .display {
    align-items: center;
    position: relative;
    width: 800px;
    height: 500px;
    margin: 0 auto;
    background: #796cce;
    background-image: url("/img/scene/index.webp");
    background-size: cover;
    background-position: center;
    border: 40px solid #363636;
    border-radius: 30px 30px 0 0;
  }
  .display:before {
    content: "";
    position: absolute;
    top: -25px;
    left: 50%;
    margin-left: -0.5px;
    width: 10px;
    height: 10px;
    background: #252525;
    border-radius: 10px;
  }
  .bottom {
    position: relative;
    width: 1080px;
    height: 20px;
    background: #cccccc;
    margin: 0 auto;
  }
  .bottom:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -60px;
    width: 120px;
    height: 10px;
    background: #8e8e8e;
    -moz-border-radius-bottomleft: 10px;
    -webkit-border-bottom-left-radius: 10px;
    border-bottom-left-radius: 10px;
    -moz-border-radius-bottomright: 10px;
    -webkit-border-bottom-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .bottom:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    border-top: 10px solid #959595;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
  }

  .window {
    width: 600px;
    background: #d9d9d9;
    margin: 0 auto;
    margin-top: 2%;
    border-radius: 3px;
    padding: 12px 0;
    font-family: Verdana, sans-serif;
    color: #333;
    cursor: default;
    box-shadow: 0 0 16px -2px rgba(50, 50, 50, 0.5);
  }
  .buttons {
    margin-right: 12px;
    flex-direction: row;
    align-items: center;
  }
  .buttons div {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    margin-left: 5px;
  }
  .minimize {
    background: #3c6;
  }
  .resize {
    background: #cc3;
  }
  .close {
    background: #c33;
  }
  .title {
    margin-left: 12px;
    font-size: 18px;
    flex-direction: row;
    justify-content: space-between;
  }
  .textarea {
    width: 96%;
    max-width: 96%;
    min-height: 380px;
    background: #efefef;
    margin-top: 10px;
    border: 0;
    padding: 2%;
    font-size: 95%;
    line-height: 24px;
    color: #333;
    overflow: auto;
    align-items: center;
  }

  @keyframes typing {
    from {
      width: 0;
    }
  }
  @keyframes cursor-blink {
    50% {
      border-color: transparent;
    }
  }
</style>
