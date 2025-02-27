<script>
  import { onMount, beforeUpdate } from "svelte";
  import { explore, data, Explain, frameEvent, Admin } from "../store";
  import Enermy from "../data/enermy.js";
  import buffs from "../data/buff.js";
  import attackAnimation from "../addon/attackAnimation";
  import sector from "../data/sector";
  import keypress from "../data/keypress";

  export let battle;

  const Explore = deepCopy($explore);
  $Admin.explore = Explore;
  const Data = deepCopy($data);
  let enermys = Explore.target
    .map((t, i) => t && Explore.enermy[i])
    .filter((e) => e);
  let ordered; //敌人回合的时候轮到谁谁就往下移动20px
  if ($Admin.data.chance.type == "blue") window.exploreLevelScale = 0.5;
  if ($Admin.data.chance.type == "green") window.exploreLevelScale = 1;
  if ($Admin.data.chance.type == "red") window.exploreLevelScale = 1.5;
  let state = enermys.map((e) => Enermy[e].growth(Explore.lv));
  let health = state.map((s) => s.health);
  let buff = health.map((_) => new Object());
  let aimAll = false;
  let aim = false;
  let input = enermys.map((_) => new Array());
  let emotion = enermys.map((_) => "portrait");
  let onHurt = enermys.map((_) => false);
  const element_buff = enermys.map((_) => []);
  const element_enermy = [];
  let element_enermys;

  const action = {
    list: [],
    handle: function () {
      if (this.list.length > 0) {
        if (this.list[0].time == 1) {
          if (battle.effect.listLengthOf("enermy") == 0)
            this.list.shift().handle();
        } else this.list[0].time--;
      }
    },
  };
  const inputRender = {
    add: function (info, index) {
      input[index] = [
        ...input[index],
        {
          info: info,
          time: 50,
        },
      ];
    },
    handle: function () {
      input.forEach((i, index) => {
        i.forEach((ii) => {
          if (ii.time > 0) ii.time--;
        });
        let count = i.filter((ii) => ii.time > 0).length;
        if (count == 0) enermy.express.outHurt(index);
      });
    },
    clear: function () {
      input = enermys.map((_) => new Array());
    },
  };
  const buffHandle = {
    of: function (index) {
      let This = deepCopy(this);
      This.Target = index;
      return This;
    },
    get: function (b) {
      if (b in buff[this.Target]) return buff[this.Target][b];
      else return false;
    },
    getAll: function () {
      let res = {};
      for (let b in buff[this.Target]) {
        res[b] = buffs[b];
        res[b].amount = buff[this.Target][b];
      }
      return res;
    },
    add: function (b, n, t) {
      // battle.effect.targetEnermy(this.Target).by(
      //   (_) => {
      //     n = n ? n : 1;
      //     if (b in buff[this.Target]) buff[this.Target][b] += n;
      //     else buff[this.Target][b] = n;
      //   },
      //   t ? t : 5,
      // );
      n = n ? n : 1;
      if (b in buff[this.Target]) buff[this.Target][b] += n;
      else buff[this.Target][b] = n;
    },
    addAll: function (b, n) {
      // battle.effect.targetEnermy(0).by((_) => {
      //   n = n ? n : 1;
      //   enermy.survival().forEach((e) => {
      //     if (b in buff[e]) buff[e][b] += n;
      //     else buff[e][b] = n;
      //   });
      // }, 5);
      n = n ? n : 1;
      enermy.survival().forEach((e) => {
        if (b in buff[e]) buff[e][b] += n;
        else buff[e][b] = n;
      });
    },
    set: function (b, n) {
      // battle.effect.targetEnermy(this.Target).by((_) => {
      //   buff[this.Target][b] = n;
      // }, 10);
      buff[this.Target][b] = n;
    },
    clear: function (b, n) {
      if (b in buff[this.Target]) {
        if (n) {
          // battle.effect.targetEnermy(this.Target).by((_) => {
          if (buff[this.Target][b] != undefined) {
            buff[this.Target][b] -= n;
            buff[this.Target][b] <= 0 && delete buff[this.Target][b];
          }
          // }, 5);
        } else {
          // battle.effect.targetEnermy(this.Target).by((_) => {
          delete buff[this.Target][b];
          buff = buff;
          // }, 5);
        }
      } else return false;
    },
    clearAll: function (positive) {
      // battle.effect.targetEnermy(this.Target).by((_) => {
      if (positive === true)
        for (let b in buff[this.Target])
          buffs[b].positive && delete buff[this.Target][b];
      else if (positive === false)
        for (let b in buff[this.Target])
          !buffs[b].positive && delete buff[this.Target][b];
      else buff[this.Target] = {};
      buff = buff;
      // }, 10);
    },
    link: function (k) {
      this.Key = k;
      return this;
    },
    to: function (f) {
      if (this.Key in buff[this.Target]) {
        let amount = buff[this.Target][this.Key];
        // 不知为何底下这两行顺序不能反
        if (buffs[this.Key].expend)
          this.clear(this.Key, Number(buffs[this.Key].expend));
        f(Math.max(amount, 0));
      }
    },
    count: function (positive) {
      let positiveBuffCount = Object.keys(buff[this.Target]).filter(
        (b) => buffs[b].positive,
      ).length;
      if (positive) return positiveBuffCount;
      else return Object.keys(buff[this.Target]).length - positiveBuffCount;
    },
  };
  const expressHandle = {
    store: enermys.map((_) => "portrait"),
    emotionGet: function (i) {
      let res = emotion[i] == "hurt" ? this.store[i] : emotion[i];
      return typeof i == "number" ? res : emotion;
    },
    emotionSet: function (i, type) {
      if (type != "hurt") this.store[i] = emotion[i];
      emotion[i] = type;
    },
    outHurt: function (i) {
      emotion[i] = this.store[i];
      onHurt[i] = false;
    },
    hurt: function (i) {
      onHurt[i] = true;
    },
  };
  const damageHandle = {
    except: function (index) {
      let This = deepCopy(this);
      This.Except = index;
      return This;
    },
    target: function (index) {
      let This = deepCopy(this);
      This.Aim = "one";
      This.Target = index;
      return This;
    },
    targetMuti: function (array) {
      let This = this;
      This.Aim = "muti";
      This.Muti = array;
      return This;
    },
    targetAll: function () {
      let This = this;
      This.Aim = "all";
      return This;
    },
    average: function () {
      this.Aim = "average";
      return this;
    },
    random: function () {
      let This = this;
      This.Aim = "random";
      return This;
    },
    source: function (index) {
      this.Source = index;
      return this;
    },
    from: function (index) {
      this.From = index;
      return this;
    },
    by: function (Damage, time) {
      if (Damage.type == "static");
      let e = health.map((_, i) => i).filter((i) => health[i] > 0);
      let aim = {
        one: [this.Target],
        all: e.filter((i) => i != this.Except),
        average: e.filter((i) => i != this.Except),
        random: e
          .filter((i) => i != this.Except)
          .rd()
          .splice(0, 1),
      };
      const source = this.Source;
      this.Source = false;
      let targets = this.Aim == "muti" ? this.Muti : aim[this.Aim];
      this.Target = false;
      this.Except = -1;
      if (!Damage.amount) Damage.amount = 1;
      if (!time) time = 5;
      battle.effect.targetEnermy(this.Target).by((_) => {
        for (let i of targets) {
          const damage = deepCopy(Damage);
          damage.value /= this.Aim == "average" ? targets.length : 1;
          const damageArray = [];
          for (let a = 0; a < damage.amount; a++) {
            let info_sector = {
              damage: deepCopy(damage),
              target: i,
              source,
            };
            sector.enermyDamagedProcess($Admin, info_sector);
            let display;
            if (info_sector.damage.blocked) {
              display = "已阻挡";
              $Admin.sound("blocked");
            } else if (info_sector.damage.miss) {
              display = "Miss";
              $Admin.sound("miss");
            } else if (health[i] > 0) {
              $Admin.sound("hit");
              health[i] -= info_sector.damage.value;
              if (health[i] <= 0) {
                action.list = action.list.filter((a) => a.index != i);
                // setTimeout(
                //   (_) => battle.effect.targetEnermy(i).clearTask(),
                //   720,
                // );
                $Admin.role.event.defeat(i).by(info_sector.damage);
                if ($Admin.enermy.survival().length == 0)
                  $Admin.battle.winEvent();
              }
              display = retain(info_sector.damage.value, 1);
            }
            inputRender.add(
              {
                value: display,
                prop: "damage",
                penetrate: info_sector.damage.penetrate,
                critical: info_sector.damage.critical,
                indirect: info_sector.damage.indirect,
              },
              i,
            );
            damageArray.push(info_sector.damage);
          }
          let missDamage = damageArray.filter((damage) => damage.miss),
            blockedDamage = damageArray.filter((damage) => damage.blocked);
          if (missDamage.length == 0)
            if (enermy.express.emotionGet(i) != "hurt") enermy.express.hurt(i);
          if (blockedDamage == 0) enermy.express.emotionSet(i, "hurt");
        }
      }, 5);
    },
  };
  const healHandle = {
    from: function (index) {
      this.From = index;
      return this;
    },
    target: function (index) {
      this.Target = index;
      this.Aim = "one";
      return this;
    },
    targetAll: function () {
      let This = this;
      This.Aim = "all";
      return This;
    },
    by: function (heal) {
      if (heal.type == "static");
      let e = health.map((_, i) => i).filter((i) => health[i] > 0);
      let aim = {
        one: [this.Target],
        all: e.filter((i) => i != this.Except),
        average: e.filter((i) => i != this.Except),
        random: e
          .filter((i) => i != this.Except)
          .rd()
          .splice(0, 1),
      };
      this.Source = false;
      let targets = this.Aim == "muti" ? this.Muti : aim[this.Aim];
      let _target = this.Target;
      this.Target = false;
      this.Except = -1;
      if (!heal.amount) heal.amount = 1;
      battle.effect.targetEnermy(this.Target).by((_) => {
        for (let i of targets) {
          if (heal.type == "static");
          let info = {
            heal,
            target: _target,
          };
          sector.enermyHealProcess($Admin, info);
          health[i] += info.heal.value;
          let overHeal = health[i] - state.health;
          if (overHeal > 0) {
            health[i] = state.health;
          }
          inputRender.add(
            {
              value: retain(info.heal.value, 1),
              prop: "heal",
            },
            i,
          );
          return info.heal.value;
        }
      });
    },
  };
  const stateHandle = {
    of: function (index) {
      this.Target = index;
      return this;
    },
    get: function () {
      let s = deepCopy(state[this.Target]);
      s.Health = health[this.Target];
      let info = {
        state: s,
        target: this.Target,
      };
      sector.enermyStateGet($Admin, info);
      return s;
    },
    getAll: function () {
      let s = deepCopy(state);
      health.forEach((h, i) => (s[i].Health = h));
      return s;
    },
    set: function (n, v) {
      if (n == "Health") healthSet(v, this.Target);
      else state[this.Target][n] = v;
      if (health[this.Target] <= 0) {
        action.list = action.list.filter((a) => a.index != this.Target);
        $Admin.role.event.defeat(this.Target);
        if ($Admin.enermy.survival().length == 0) $Admin.battle.winEvent();
      }
    },
  };
  const eventHandle = {
    round: {
      of: function (index) {
        this.Target = index;
        return this;
      },
      start: function () {
        let info = {
          target: this.Target,
          interimBuff: Object.keys(buffs).filter((key) => buffs[key].interim),
          decreaseBuff: Object.keys(buffs).filter((key) => buffs[key].decrease),
        };
        sector.enermyRoundStart($Admin, info);
        info.decreaseBuff.forEach((b) =>
          enermy.buff.of(this.Target).clear(b, 1),
        );
        info.interimBuff.forEach((b) => enermy.buff.of(this.Target).clear(b));
      },
      end: function () {},
    },
  };
  const infoHandle = {
    of: function (index) {
      this.Target = index;
      return this;
    },
    get: function () {
      let info = deepCopy(Enermy[enermys[this.Target]]);
      info.key = enermys[this.Target];
      return info;
    },
    getAmount: function () {
      return enermys.length;
    },
    getAiming: function () {
      return aim;
    },
  };
  const enermy = {
    action: actionHandle,
    render: inputRender,
    state: stateHandle,
    buff: buffHandle,
    express: expressHandle,
    damage: damageHandle,
    heal: healHandle,
    event: eventHandle,
    survival,
    info: infoHandle,
    checkForPosition,
    equipmentAim: roleAction,
    insert: insertEnermy,
  };
  $Admin.enermy = enermy;

  onMount((_) => {
    $frameEvent.add("enermyInput", (_) => inputRender.handle(), 1);
    sector.enermyOnload($Admin, { enermys });
    keypress.bind("e", function () {
      let survival = enermy.survival();
      if (typeof aim != "number" || aim == survival[survival.length - 1])
        aim = survival[0];
      else aim = survival[survival.indexOf(aim) + 1];
    });
    keypress.bind("q", function () {
      let survival = enermy.survival();
      if (typeof aim != "number" || aim == survival[0])
        aim = survival[survival.length - 1];
      else aim = survival[survival.indexOf(aim) - 1];
    });
    setTimeout((_) => {
      enermys.forEach(
        (e, i) => Enermy[e].onload && Enermy[e].onload($Admin, i),
      );
    }, 1000);
  });
  beforeUpdate((_) => {
    if ($Admin.handcard && $Admin.battle.equipment) {
      aimAll = !$Admin.handcard.aim() && !$Admin.battle.equipment.aim();
    }
    element_buff.forEach((b, i) => {
      b.forEach((e, ii) => {
        let key = Object.keys(buff[i])[ii];
        key &&
          $Explain(e)
            .color(buffs[key].positive ? "blue" : "purple")
            .with(buffs[key]);
      });
    });
    let enermy_info = enermys.map((e) => Enermy[e]);
    element_enermy.forEach((e, i) => {
      $Explain(e).color(enermy_info[i].color).with(enermy_info[i]);
    });
  });

  function r() {
    return Math.random();
  }
  function survival(left) {
    if (left)
      return enermys
        .map((_, i) => i)
        .filter((i) => state[i].health > 0 && health[i] > 0);
    else
      return enermys
        .map((_, i) => i)
        .filter((i) => state[i].health < 0 || health[i] > 0);
  }
  function actionHandle() {
    $frameEvent.add("enermyAction", (_) => action.handle(), 1);
    const u = 12.5,
      enermyInterval = 6,
      afterSwitch = 4,
      beforeStart = 6;
    enermys.forEach((e, i) => {
      if (health[i] > 0) {
        action.list.push({
          handle: (_) => {
            battle.effect.targetEnermy(i).by((_) => {
              ordered = i;
              enermy.event.round.of(i).start();
            });
          },
          time: enermyInterval * u,
          index: i,
        });
        action.list.push({
          handle: (_) =>
            battle.effect.targetRole(i).by((_) => {
              Enermy[e].action($Admin, i);
            }),
          time: afterSwitch * u,
          index: i,
        });
      }
    });
    action.list.push({
      handle: (_) => {
        battle.effect.targetRole(0).by((_) => {
          ordered = null;
          $frameEvent.clear("enermyAction");
          $Admin.role.event.round.start();
        });
      },
      time: beforeStart * u,
    });
  }
  function healthSet(h, i) {
    health[i] = h > state[i].health ? state[i].health : h;
  }
  function checkForPosition(p) {
    let enermyRange = element_enermy.map((e) => e.getBoundingClientRect());
    let enermysRange = element_enermys.getBoundingClientRect();
    let position = false;
    let _aimAll = !$Admin.handcard.aim() && !$Admin.battle.equipment.aim();
    enermyRange.forEach((e, i) => {
      if (p.x > e.left && p.x < e.right && p.y < e.bottom - 50 && p.y > e.top)
        position = i;
    });
    if (typeof position == "number" && health[position] <= 0) position = false;
    if (!_aimAll) {
      aim = position;
    } else {
      if (
        p.x > enermysRange.left &&
        p.x < enermysRange.right &&
        p.y < enermysRange.bottom - 50 &&
        p.y > enermysRange.top
      )
        position = survival()[0];
      aim = position;
    }
    return position;
  }
  function roleAction() {
    if (typeof aim == "number") {
      if (health[aim] > 0) {
        battle.equipment.target(aim).use();
        aim = false;
        return true;
      } else return false;
    } else return false;
  }
  function insertEnermy(key, index) {
    enermy.render.clear();
    enermys.splice(index, 0, key);
    enermys = enermys;
    state.splice(index, 0, Enermy[key].growth(Explore.lv));
    state = state;
    health.splice(index, 0, state[index].health);
    buff.splice(index, 0, {});
    input.splice(index, 0, new Array());
    emotion.splice(index, 0, "portrait");
    enermy.express.store.splice(index, 0, "portrait");
    onHurt.splice(index, 0, false);
    element_buff.splice(index, 0, []);
    Enermy[key].onload && Enermy[key].onload($Admin, index);
  }
</script>

<div
  class="enermys {aimAll && typeof aim == 'number' && 'allAim'}"
  on:mouseenter={(_) => (aim = false)}
  bind:this={element_enermys}
>
  {#each enermys as e, i (i)}
    <div
      class={`enermy ${aim === i && "oneAim"} ${
        health[i] <= 0 && "animate_enermyOut"
      } ${ordered == i && "orderEnermy"}`}
      style="z-index:{enermys.length - i}"
    >
      <div class="enermy-info">
        <img
          src={`/img/enermy/${Enermy[e].type}/${e}/${emotion[i]}.webp`}
          class={`${onHurt[i] && "animate_enermyShake"}`}
          bind:this={element_enermy[i]}
        />
        <txt style="--color:var(--{Enermy[e].color})">{Enermy[e].name}</txt>
      </div>
      <div class="enermy-state">
        <div
          class="enermy-health"
          style="visibility:{health[i] < state[i].health
            ? 'visible'
            : 'hidden'};background-image:{`linear-gradient(90deg, white ${
            (health[i] / state[i].health) * 100
          }%, transparent ${(health[i] / state[i].health) * 100}%)`}"
        >
          {#if Enermy[e].type == "boss" || $Admin.data.role == "renko"}
            <txt>{Math.ceil(health[i])}</txt>
          {/if}
        </div>
        <div class="enermy-buff">
          {#each Object.keys(buff[i]) as b, ii (ii)}
            <div bind:this={element_buff[i][ii]}>
              <icon class="icon-{b}"></icon>
              {#if Object.values(buff[i])[ii] > 1}
                <txt>{Object.values(buff[i])[ii]}</txt>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="enermy-aim icon-aim" />
      {#each input[i] as a, ii (ii)}
        {#if a.info.value}
          <a
            class="battle-input-{a.info.prop} {a.info.penetrate &&
              'penetrate'} {a.info.critical && 'critical'} {a.info.indirect &&
              'indirect'}"
            style="left:{-25 + r() * 150}px;top:{50 + r() * 150}px"
            >{a.info.value}</a
          >
        {/if}
      {/each}

      {#if onHurt[i]}
        <svelte:component this={attackAnimation[Data.role]} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .enermys {
    flex-direction: row;
    width: 900px;
    justify-content: center;
  }

  .enermy-info {
    position: relative;
    margin: 5px;
    width: 200px;
    align-items: center;
    overflow: hidden;
    background-image: radial-gradient(
      #ffffff91,
      #ffffff82,
      transparent,
      transparent
    );
    transition: 0.3s;
  }
  .oneAim .enermy-info img,
  .allAim .enermy-info img {
    filter: drop-shadow(0 0 8px red) drop-shadow(0 0 4px red);
  }

  .enermy-info > img {
    height: 250px;
    transition: 0.3s;
  }

  .enermy-info > txt {
    --blue: rgb(103, 186, 255);
    --green: #60d560;
    --red: #e55c5c;
    color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    text-shadow:
      0 0 3px var(--color),
      0 0 3px var(--color),
      0 0 3px var(--color),
      0 0 3px var(--color),
      0 0 3px var(--color),
      0 0 3px var(--color),
      0 0 3px var(--color);
    font-size: 20px;
    font-family: normal;
    font-weight: bold;
  }

  .enermy-state {
    margin-top: 5px;
    width: 100%;
    align-items: center;
  }

  .enermy-health {
    box-sizing: border-box;
    width: 150px;
    height: 13px;
    border: 4px solid white;
    filter: drop-shadow(0 0 6px #777);
    font-size: 12px;
    line-height: 4px;
    font-weight: bold;
    color: #666;
    align-items: center;
    text-shadow:
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff,
      0 0 3px #fff;
  }

  .enermy-buff {
    flex-direction: row;
    width: 200px;
    justify-content: center;
    margin-top: 2px;
    font-size: 24px;
    color: white;
    min-height: 24px;
  }

  .enermy-buff > div {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    position: relative;
    filter: drop-shadow(0 0 8px #555);
  }

  .enermy-buff > div > txt {
    position: absolute;
    right: -5px;
    bottom: -5px;
    font-size: 14px;
    color: white;
    text-shadow:
      0 0 3px #777,
      0 0 3px #777,
      0 0 3px #777,
      0 0 3px #777,
      0 0 3px #777,
      0 0 3px #777,
      0 0 3px #777;
    font-family: title;
  }

  .enermy-aim {
    opacity: 0;
    transition: 0.2s;
    font-size: 50px;
    text-align: center;
    color: white;
  }

  .oneAim .enermy-aim,
  .allAim .enermy-aim {
    opacity: 1;
  }

  .allAim > div,
  .oneAim {
    cursor: pointer;
  }

  .enermy {
    position: relative;
    transition: 0.3s;
  }

  .orderEnermy {
    transform: translateY(20px);
  }

  .animate_enermyOut {
    animation: enermyOut 1.6s forwards;
  }

  .animate_enermyShake {
    animation: enermyShake 0.6s ease-in-out;
  }

  @keyframes enermyOut {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      cursor: auto;
    }
  }

  @keyframes enermyShake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(+2px, 0, 0);
    }

    30%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(+4px, 0, 0);
    }

    50% {
      transform: translate3d(-4px, 0, 0);
    }
  }
</style>
