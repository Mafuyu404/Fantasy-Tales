<script>
  import Card from "../addon/card.svelte";
  import { Admin, archive } from "../store";
  import data from "../data/data";

  $Admin.guide = {
    add,
    skip: confirm,
    reset,
  };
  export let enable;
  let guide = [];
  let init;
  let confirm_area;

  const remind = {
    menu: `大部分信息可在菜单中查询，游戏中大部分东西轻触或放上鼠标会有说明
    可在任何地方右键打开或关闭菜单，也可以点击左上角菜单按钮
    通过菜单可以快速返回标题界面，并随时回到最近的战斗之前`,
    event: `与事件交互是游戏的核心，每一阶段都会刷新出固定数量的事件
    可以看到的事件有九个，而可交互事件只有底部3个`,
    valid_event: `点击事件打开事件详情，点击 × 关闭事件
    关闭事件会使九宫格重新布局，并向前推进游戏进度
    三个可交互事件可同时交互，可以全部完成后再关闭事件`,
    enermy_list: `遭遇到的敌人会罗列在这里，最多显示11个
    选中敌人后即可向其“开战”，最多可同时选中4个
    在某一列的最上方会出现BOSS事件，击败BOSS后进入下一阶段`,
    handcards: `使用你的卡牌打败敌人吧
    需留意左上角的灵力消耗、每回合抽牌数、持有上限，下方的小按钮可查看牌库余牌
    详细信息可在菜单中查询`,
    state: `这里是角色的状态栏，显示角色的生命值、持有的效果
    扇形和指针指示角色当前的灵力，打出卡牌消耗灵力，灵力会在回合初回复至上限
    直尺的数字指示角色的生命上限，你所持有的效果也会陈列在这里`,
    enermy_info: `这里是你要打败的敌人
    轻触或移动鼠标至其上可查看对方的特性或持有的效果`,
    round_end: `如果你实在没什么事可做，可以结束回合
    之后敌人会陆续进行各自的回合，直到再次轮到你`,
    equipment: `持有主动装备时，可用鼠标拖拽出瞄准箭头
    在想要瞄准的目标身上松开即可对目标使用装备
    移动端的瞄准方式则更为简化`,
    win_reward: `无论是胜利还是失败，总能拿到一些奖励
    击败杂鱼、强敌、BOSS得到的奖励各不相同
    还会得到 10 × 敌人数量 × ( 4 + 敌人数量 ) 的硬币
    这些统统可以拿走`,
    get_equipment: `装备分为主动和被动，具有强大的功能
    但是不可叠加，得到了新的就替换掉旧的
    同样可以在菜单中查看当前装备的具体功能`,
    get_souvenir: `纪念品拥有一个广义上的正面功能和一个广义上负面功能
    获得的渠道极少，且不可叠加，得到了新的就会替换掉旧的
    得到了纪念品之后就再也离不开纪念品了`,
    get_collection: `收藏品是除了卡牌之外提升角色强度的重要手段
    不断叠加同样的收藏品可以增强其效果
    稀有度 红色 > 绿色 > 蓝色`,
    exPower: `以变化的背景衬托的数字是额外灵力
    额外灵力等同于自然灵力，但是优先被消耗
    额外灵力可以保留至下回合，并不会被清除`,
    basecard: `卡面花花绿绿的就是通式
    通式不像符卡，它是全角色通用的，可以在各种地方得到
    通式一般没有过于强大的功能，但能补足角色符卡的某些缺陷`,
    init: `卡牌是游戏中核心的战斗机制，分为普通攻击、符卡和通式三种
    左上角的数字是卡牌的消耗，灰色灵力背景代表一次性卡牌
    在文字上轻触或放上鼠标，可以查看相关说明，如果有`,
  };

  function add(type) {
    if ("guide" in $archive) {
      if ($archive.guide[type] || type == "menu_open") {
        guide.push(type);
        !enable && open(type);
      }
    }
  }
  function open(type) {
    if (type == "menu_open") {
      setTimeout($Admin.menu);
      return;
    }
    guide = guide;
    enable = true;
    if (type == "init") {
      init = true;
    } else {
      let element;
      if (type == "menu") element = document.getElementsByClassName("menu")[0];
      if (type == "event")
        element = document.getElementsByClassName("event-list")[0];
      if (type == "valid_event")
        element = document.getElementsByClassName("event cursor")[1];
      if (type == "enermy_list")
        element = document.getElementsByClassName("notebook")[0];
      if (type == "handcards")
        element = document.getElementsByClassName("handcards")[0];
      if (type == "state") element = document.getElementById("state");
      if (type == "enermy_info")
        element = document.getElementsByClassName("enermys")[0];
      if (type == "round_end")
        element = document.getElementsByClassName("roundEnd")[0];
      if (type == "equipment") element = document.getElementById("equipment");
      if (type == "win_reward") element = document.getElementById("win_reward");
      if (["get_equipment", "get_souvenir", "get_collection"].includes(type))
        element = document.getElementsByClassName("selections reward")[0];
      if (type == "exPower")
        element = document.getElementsByClassName("exPower")[0];
      let offsetLeft = getOffsetLeft(element) - 20;
      let offsetTop = getOffsetTop(element) - 20;
      if ($Admin.mobile) {
        offsetLeft =
          (document.body.clientHeight * (1 - 1 / $Admin.mobile)) /
            2 /
            $Admin.mobile /
            $Admin.mobile +
          getOffsetLeft(element) -
          20 / $Admin.mobile;
        offsetTop =
          getOffsetTop(element) -
          document.getElementById("root").offsetTop -
          20;
      }
      confirm_area.style.left = `${offsetLeft}px`;
      confirm_area.style.top = `${offsetTop}px`;
      confirm_area.style.width = `${element.clientWidth + 40}px`;
      confirm_area.style.height = `${element.clientHeight + 40}px`;
    }
  }
  function skip() {
    if (enable) {
      enable = false;
      guide.forEach((type) => {
        $archive.guide[type] = false;
      });
      localStorage.setItem("archive", JSON.stringify($archive));
      guide = [];
      return true;
    } else return false;
  }
  function confirm() {
    $archive.guide[guide.shift()] = false;
    localStorage.setItem("archive", JSON.stringify($archive));
    if (guide.length == 0) skip();
    else open(guide[0]);
    return enable;
  }
  function reset() {
    $archive.guide = {
      menu: true,
      event: true,
      valid_event: true,
      enermy_list: true,
      handcards: true,
      state: true,
      enermy_info: true,
      round_end: true,
      equipment: true,
      win_reward: true,
      get_equipment: true,
      get_souvenir: true,
      get_collection: true,
      exPower: true,
      init: true,
    };
    msg({ content: "已重置新手教程" });
    localStorage.setItem("archive", JSON.stringify($archive));
  }
  const getOffsetLeft = function (obj) {
    let tmp = obj.offsetLeft;
    let val = obj.offsetParent;
    while (val != null) {
      tmp += val.offsetLeft;
      val = val.offsetParent;
    }
    return tmp;
  };
  const getOffsetTop = function (obj) {
    let tmp = obj.offsetTop;
    let val = obj.offsetParent;
    while (val != null) {
      tmp += val.offsetTop;
      val = val.offsetParent;
    }
    return tmp;
  };
</script>

<div class="body {enable && 'show'}">
  <div class="confirm_area" bind:this={confirm_area} on:click={confirm}></div>
  {#if enable}
    {#if guide[0] == "init"}
      <div
        class="init"
        on:click={(_) => {
          confirm();
        }}
      >
        <div>
          <Card key={$Admin.data.role} />
          <div class="remind">
            * [ 普通攻击 ] : 图标不是字母的就是普通攻击，中规中矩的进攻，有时附带特殊功能。
          </div>
        </div>
        <div>
          <Card
            key={data
              .keys()
              .spellcard.filter(
                (c) => data.spellcard[c].role == $Admin.data.role,
              )[1]}
          />
          <div class="remind">
            * [ 符卡 ] :
            卡面配色与角色相似，这是角色特有的卡牌，通常有着与角色特性相对应的强大功能。
          </div>
        </div>
        <div>
          <Card key="a013" />
          <div class="remind">
            * [ 通式 ] :
            卡面花花绿绿的是通式，它是全角色通用的,虽然通常没有强大的功能，但能补足角色符卡的某些缺陷。
          </div>
        </div>
      </div>
    {/if}
    <div class="remind" on:click={confirm}>{remind[guide[0]]}</div>
  {/if}
</div>

<style>
  .init {
    flex-direction: row;
    width: 100%;
    height: 100%;
    background-color: #444;
    align-items: center;
    justify-content: center;
  }
  .init > div {
    width: 200px;
    height: 420px;
    align-items: center;
    margin: 20px;
  }
  .init .remind {
    width: 200px;
    position: relative;
    margin-top: 20px;
  }

  .body {
    z-index: -1;
  }
  .show {
    z-index: 999;
  }

  .remind {
    position: absolute;
    bottom: 20px;
    font-size: 24px;
    font-family: normal;
    color: white;
    white-space: pre-line;
    text-align: center;
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
  }

  .confirm_area {
    outline: 1000vw solid rgba(0, 0, 0, 0.5);
    position: absolute;
    cursor: pointer;
  }
</style>
