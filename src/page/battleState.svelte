<script>
  import { onMount, beforeUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { data, setting, Explain, Admin, frameEvent, cache } from "../store";
  import growth from "../data/growth";
  import buffs from "../data/buff.js";
  import sector from "../data/sector";
  import Role from "../data/role.json";

  const Data = deepCopy($data);
  let buff = [{}, {}];
  let Doll = [];
  let state = [deepCopy(growth.role[Data.role]), {}];
  if (!$Admin.data.rule) $Admin.data.rule = [];
  if ($Admin.data.rule.includes("rule_magnify")) state[0].health /= 2;
  let health = [Data.health ? Data.health : state[0].health, 50];
  let power = [state[0].power, 0];
  let exPower = [0, 0];
  let input = [[], []];
  const info_sector = {
    exPowerLimit: Object.values(Data.card).sum(),
  };
  let element_exPower;
  let element_role;
  const element_buff = deepCopy(buffs);
  let show_barrier = false;

  const powerHandle = {
    of: function (index) {
      this.Target = index;
      return this;
    },
    cost: function (cost) {
      let left = power[this.Target] + exPower[this.Target] - cost;
      exPower[this.Target] =
        left <= power[this.Target] ? 0 : exPower[this.Target] - cost;
      if (left <= power[this.Target]) power[this.Target] = left;
      return left;
    },
    reset: function (offset) {
      if (!offset) offset = 0;
      power[this.Target] = Math.max(
        0,
        state[this.Target].power + offset,
        power[this.Target],
      );
    },
    add: function (n) {
      let info = { amount: n, limit: info_sector.exPowerLimit };
      sector.rolePowerAdd($Admin, info);
      exPower[this.Target] = Math.min(
        info.limit,
        exPower[this.Target] + info.amount,
      );
      setTimeout((_) => $Admin.guide.add("exPower"));
    },
    get: function () {
      return power[this.Target] + exPower[this.Target];
    },
    getExPower: function () {
      return exPower[this.Target];
    },
    clear: function () {
      power[this.Target] = 0;
      exPower[this.Target] = 0;
    },
  };
  const buffHandle = {
    of: function (index) {
      this.Target = index;
      return this;
    },
    get: function (b) {
      if (b in buff[this.Target]) {
        let amount = buff[this.Target][b];
        let info = { amount, buff: buffs[b], target: this.Target };
        sector.roleBuffGet($Admin, info);
        return info.amount;
      } else return false;
    },
    getAll: function () {
      let res = {};
      for (let b in buff[this.Target]) {
        res[b] = buffs[b];
      }
      return res;
    },
    set: function (b, n) {
      // battle.effect.targetRole(this.Target).by((_) => {
      //   buff[this.Target][b] = n;
      //   let info = {
      //     amount: buff[this.Target][b],
      //     buff: b,
      //   };
      //   sector.roleBuffUpdate($Admin, info);
      // }, 10);
      buff[this.Target][b] = n;
      let info = {
        amount: buff[this.Target][b],
        buff: b,
      };
      sector.roleBuffUpdate($Admin, info);
    },
    clear: function (b, n) {
      if (b in buff[this.Target]) {
        // battle.effect.targetRole(this.Target).by((_) => {
        //   if (n && buff[this.Target][b]) {
        //     buff[this.Target][b] -= n;
        //     buff[this.Target][b] <= 0 && delete buff[this.Target][b];
        //   } else delete buff[this.Target][b];
        //   buff = buff;
        //   let info = {
        //     amount: buff[this.Target][b],
        //     buff: b,
        //   };
        //   sector.roleBuffUpdate($Admin, info);
        // }, 5);
        if (n && buff[this.Target][b]) {
          buff[this.Target][b] -= n;
          buff[this.Target][b] <= 0 && delete buff[this.Target][b];
        } else delete buff[this.Target][b];
        buff = buff;
        let info = {
          amount: buff[this.Target][b],
          buff: b,
        };
        sector.roleBuffUpdate($Admin, info);
      } else if (typeof b == "boolean") {
        for (let i = 0; i < n; i++) {
          let keys = Object.keys(buff[this.Target]).rd();
          let positive = keys.filter((b) => buffs[b].positive);
          let negative = keys.filter((b) => !buffs[b].positive);
          this.clear(b ? positive[0] : negative[0], 1);
        }
      } else return false;
      buff = buff;
    },
    clearAll: function (positive) {
      // battle.effect.targetRole(this.Target).by((_) => {
      //   if (positive === true)
      //     for (let b in buff[this.Target])
      //       buffs[b].positive && delete buff[this.Target][b];
      //   else if (positive === false)
      //     for (let b in buff[this.Target])
      //       !buffs[b].positive && delete buff[this.Target][b];
      //   else buff[this.Target] = {};
      //   buff = buff;
      // }, 10);
      if (positive === true)
        for (let b in buff[this.Target])
          buffs[b].positive && delete buff[this.Target][b];
      else if (positive === false)
        for (let b in buff[this.Target])
          !buffs[b].positive && delete buff[this.Target][b];
      else buff[this.Target] = {};
      buff = buff;
    },
    link: function (k) {
      this.Key = k;
      return this;
    },
    to: function (f) {
      if (this.Key in buff[this.Target]) {
        let amount = buff[this.Target][this.Key];
        let info = { amount, buff: buffs[this.Key], target: this.Target };
        sector.roleBuffGet($Admin, info);
        if (buffs[this.Key].expend)
          this.clear(this.Key, Number(buffs[this.Key].expend));
        info.amount > 0 && f(info.amount);
      }
    },
    add: function (b, n) {
      // battle.effect.targetRole(this.Target).by(
      //   (_) => {
      //     n = n ? n : 1;
      //     if (b in buff[this.Target]) buff[this.Target][b] += n;
      //     else buff[this.Target][b] = n;
      //     let info = {
      //       amount: buff[this.Target][b],
      //       buff: b,
      //     };
      //     sector.roleBuffUpdate($Admin, info);
      //   },
      //   5,
      //   b,
      // );
      n = n ? n : 1;
      if (b in buff[this.Target]) buff[this.Target][b] += n;
      else buff[this.Target][b] = n;
      let info = {
        amount: buff[this.Target][b],
        buff: b,
      };
      sector.roleBuffUpdate($Admin, info);
    },
    count: function (positive) {
      if (typeof positive == "boolean") {
        let positiveBuffCount = Object.keys(buff[this.Target]).filter(
          (b) => buffs[b].positive,
        ).length;
        if (positive) return positiveBuffCount;
        else return Object.keys(buff[this.Target]).length - positiveBuffCount;
      } else return Object.keys(buff[this.Target]).length;
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
      sector.roleStateGet($Admin, info);
      return s;
    },
    getAll: function () {
      return state;
    },
    set: function (n, v) {
      if (n == "Health") healthSet(v, this.Target);
      else state[this.Target][n] = v;
      if (n == "health")
        healthSet(Math.min(v, health[this.Target]), this.Target);
      if (health[this.Target] < 0) battle.deadEvent();
    },
    add: function (n, v) {
      let state = $Admin.role.state.of(0).get();
      $Admin.role.state.set(n, state[n] + v);
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
      });
    },
  };
  const damageHandle = {
    except: function (index) {
      this.Except = index;
      return this;
    },
    target: function (index) {
      this.Aim = "one";
      this.Target = index;
      return this;
    },
    targetAll: function () {
      this.Aim = "all";
      return this;
    },
    average: function () {
      this.Aim = "average";
      return this;
    },
    source: function (index) {
      this.Source = index;
      return this;
    },
    from: function (index) {
      this.From = index;
      return this;
    },
    random: function () {
      this.Aim = "random";
      return this;
    },
    by: function (Damage) {
      let from = this.From;
      this.From = false;
      battle.effect.targetRole(this.Target).by((_) => {
        if (Damage.type == "static");
        if (Damage.type == "scale")
          Damage.value *= $Admin.enermy.state.of([from]).get().attack * 0.01;
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
        let targets = aim[this.Aim];
        this.Except = -1;
        const source = this.Source;
        this.Source = false;
        for (let i of targets) {
          const damage = deepCopy(Damage);
          damage.value /= this.Aim == "average" ? targets.length : 1;
          let info_sector = {
            damage,
            target: i,
            source,
            from,
          };
          sector.roleDamagedProcess($Admin, info_sector);
          if (!damage.amount) damage.amount = 1;
          for (let a = 0; a < damage.amount; a++) {
            let display;
            if (damage.blocked) {
              display = "已阻挡";
              $Admin.sound("blocked");
            } else if (damage.miss) {
              display = "Miss";
              $Admin.sound("miss");
            } else {
              $Admin.sound("hit");
              health[i] -= damage.value;
              if (health[i] < 0) battle.deadEvent(damage);
              display = retain(damage.value, 1);
            }
            inputRender.add(
              {
                value: display,
                prop: "damage",
                penetrate: info_sector.damage.penetrate,
              },
              i,
            );
          }
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
      return this;
    },
    by: function (heal) {
      if (heal.type == "static");
      let info = {
        heal,
        target: this.Target,
      };
      sector.roleHealProcess($Admin, info);
      let overHeal = health[this.Target] - state[this.Target].health;
      if (overHeal > 0);
      healthSet(health[this.Target] + heal.value, this.Target);
      inputRender.add(
        {
          value: retain(heal.value, 1),
          prop: "heal",
        },
        this.Target,
      );
      return heal.value;
    },
  };
  const collectionHandle = {
    link: function (k) {
      this.Key = k;
      return this;
    },
    to: function (f) {
      if (this.Key in Data.collection) f(Data.collection[this.Key]);
      return this.Key in Data.collection;
    },
  };
  const equipmentHandle = {
    link: function (k) {
      this.Key = k;
      return this;
    },
    to: function (f) {
      if (Data.equipment == this.Key) f();
      return Data.equipment == this.Key;
    },
  };
  const souvenirHandle = {
    link: function (k) {
      this.Key = k;
      return this;
    },
    to: function (f) {
      let p = Data.souvenir == this.Key || Data.additional_souvenir == this.Key;
      if (p) f();
      return p;
    },
  };
  const eventHandle = {
    handle: {
      defeat: function (damage, target) {
        let info = {
          target,
          damage,
        };
        sector.defeatEnermy($Admin, info);
        $Admin.battle.winEvent(target);
      },
      failed: function (damage) {},
    },
    defeat: function (index) {
      this.Type = "defeat";
      this.Target = index;
      return this;
    },
    failed: function () {
      this.Type = "failed";
      return this;
    },
    by: function (damage) {
      this.handle[this.Type](damage, this.Target);
    },
    round: {
      count: 0,
      start: function () {
        battle.effect.targetRole(0).by((_) => {
          this.count++;
          let info = {
            powerReset: true,
            handcardRefresh: true,
            interimBuff: Object.keys(buffs).filter(
              (key) => buffs[key].interim && !buffs[key].roundend,
            ),
            decreaseBuff: Object.keys(buffs).filter(
              (key) => buffs[key].decrease && !buffs[key].roundend,
            ),
            offset: 0,
          };
          sector.roleRoundStart($Admin, info);
          battle.effect.targetRole(0).by(_ => {
            info.decreaseBuff.forEach((b) => role.buff.of(0).clear(b, 1));
            info.interimBuff.forEach((b) => role.buff.of(0).clear(b));
          });
          info.powerReset && role.power.of(0).reset(info.offset);
          info.handcardRefresh && $Admin.handcard.refresh();
          battle.round.set(true);
          sector.afterRoleRoundStart($Admin, {});
        });
      },
      end: function () {
        let info = {
          interimBuff: Object.keys(buffs).filter(
            (key) => buffs[key].interim && buffs[key].roundend,
          ),
          decreaseBuff: Object.keys(buffs).filter(
            (key) => buffs[key].decrease && buffs[key].roundend,
          ),
        };
        $Admin.enermy.render.clear();
        sector.roleRoundEnd($Admin, info);
        info.decreaseBuff.forEach((b) => role.buff.of(0).clear(b, 1));
        info.interimBuff.forEach((b) => role.buff.of(0).clear(b));
        battle.round.set(false);
        $Admin.enermy.action();
      },
    },
  };
  const dollHandle = {
    remove: function (amount) {
      show_barrier = true;
      this.remove_mode = true;
      this.remove_amount = amount;
      msg({ content: "单击移除人偶" });
    },
    action: function (doll, i) {
      if (this.remove_mode == true) {
        this.remove_amount--;
        this.clear(i);
        if (this.remove_amount == 0) {
          this.remove_mode = false;
          show_barrier = false;
        } else msg({ content: `还需移除${this.remove_amount}个人偶` });
      }
    },
    clear: function (i) {
      Doll = Doll.filter((_, ii) => ii != i);
    },
    add: function (info) {
      if (info.special) Doll = Doll.filter((doll) => doll.key != info.key);
      Doll.splice(0, 0, info);
      sector.dollAdd($Admin, { doll: info });
      Doll = Doll;
    },
    get: function () {
      return Doll;
    },
    clearAll: function (source) {
      if (source) {
        Doll = Doll.filter((_, i) => !source.includes(i));
      } else Doll = [];
    },
    set: function (i, key, value) {
      Doll[i][key] = value;
      Doll = Doll;
    },
    link: function (key) {
      this.Key = key;
      return this;
    },
    to: function (f) {
      let amount = Doll.filter((doll) => doll.key == this.Key).length;
      if (amount > 0) f(amount);
    },
  };
  const role = {
    damage: damageHandle,
    heal: healHandle,
    state: stateHandle,
    buff: buffHandle,
    power: powerHandle,
    collection: collectionHandle,
    equipment: equipmentHandle,
    souvenir: souvenirHandle,
    event: eventHandle,
    doll: dollHandle,
  };
  $Admin.role = role;
  export let battle;

  onMount((_) => {
    $Explain(element_exPower).with({
      name: "额外灵力",
      detail: "等同于灵力，优先消耗。\n上限等同于牌库总牌数。",
    });
    let role_info = {
      name: Role[$Admin.data.role].name,
      detail: Role[$Admin.data.role].talent,
    };
    $Explain(element_role).with(role_info);
    $frameEvent.add("roleInput", (_) => inputRender.handle(), 1);
    sector.roleOnload($Admin, info_sector);
    health[0] = Math.min(health[0], state[0].health);
    $Admin.data.health = health[0];
  });

  beforeUpdate((_) => {
    for (let b in element_buff) {
      if (element_buff[b].e)
        $Explain(element_buff[b].e)
          .color(buffs[b].positive ? "blue" : "purple")
          .with(element_buff[b]);
    }
  });

  function r() {
    return Math.random();
  }
  function healthSet(h, i) {
    health[i] = Math.min(h, state[i].health);
  }
</script>

<div class="state" id="state">
  {#each input[0] as a, i (i)}
    <a
      class="battle-input-{a.info.prop} {a.info.penetrate && 'penetrate'}"
      style="left:{460 + r() * 150}px;top:{r() * 60 + 40}px;font-size:28px;"
      >{a.info.value}</a
    >
  {/each}
  <div class="power">
    <div class="line">
      {#each [...Array(state[0].power).keys()] as i}
        <div style="transform:rotate({(180 / state[0].power) * i}deg)"></div>
      {/each}
    </div>
    <div
      class="cursor"
      style="transform:rotate({(180 * power[0]) / state[0].power - 90}deg)"
    ></div>
  </div>
  <div class="avatar" on:click={$Admin.menu}>
    <img bind:this={element_role} src="/img/role/dairi/{Data.role}.webp" />
    <div
      class="exPower"
      style="visibility:{exPower[0] > 0 ? 'visible' : 'hidden'}"
      bind:this={element_exPower}
    >
      <txt>{exPower[0]}</txt>
    </div>
  </div>
  <div class="health">
    <div
      class="pencil"
      style="width:{120 + (180 * health[0]) / state[0].health}px"
    >
      <txt>{health[0].toFixed(0)}</txt>
    </div>
    <div class="ruler">
      {#each [...Array(32).keys()] as i}
        <div style={i % 4 == 3 && "height:15px"}></div>
      {/each}
      <txt>{state[0].health}</txt>
    </div>
  </div>
  <div class="buff">
    {#each Object.keys(buff[0]) as b, i (i)}
      {#if Object.values(buff[0])[i] > 0}
        <div bind:this={element_buff[b].e}>
          <icon class="icon-{b}"></icon>
          {#if Object.values(buff[0])[i] > 1}
            <txt>{Object.values(buff[0])[i]}</txt>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
  {#if Doll.length > 0}
    <div class="doll">
      {#each Doll as doll, i (i)}
        <div on:click={(_) => role.doll.action(doll, i)}>
          <txt>{doll.name}({doll.health})</txt>
        </div>
      {/each}
    </div>
  {/if}
  {#if show_barrier}
    <div
      class="barrier"
      in:fade={{ duration: 250 }}
      out:fade={{ duration: 250 }}
    ></div>
  {/if}
</div>

<style>
  .state {
    position: absolute;
    left: -80px;
    bottom: -10px;
    height: 210px;
    width: 300px;
  }

  .barrier {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 7;
    backdrop-filter: blur(8px);
    left: 0;
    top: 0;
  }

  .doll {
    position: absolute;
    left: 40px;
    bottom: 200px;
    filter: drop-shadow(0px 0px 3px #999);
    color: #555;
    font-family: title;
    font-size: 16px;
    line-height: 30px;
    text-align: right;
    z-index: 8;
  }
  .doll > div {
    background-color: #ffffcc;
    margin: 2px 0;
    transform: rotate(7deg);
    height: 30px;
    width: 140px;
    padding-right: 7px;
    clip-path: polygon(12px 0, 100% 0, 136px 100%, 12px 100%, 0 50%);
    cursor: pointer;
  }
  .doll > div::before {
    content: "•";
    font-size: 26px;
    position: absolute;
    left: 10px;
    top: -2px;
  }

  .exPower {
    position: absolute;
    width: 56px;
    height: 56px;
    background-color: #9eff28;
    z-index: 1;
    animation: huerotate 6s infinite linear;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }
  .exPower txt {
    width: 36px;
    font-size: 28px;
    line-height: 32px;
    color: white;
    text-align: center;
    font-family: title;
    text-shadow:
      0 0 4px #aaa,
      0 0 4px #aaa,
      0 0 4px #aaa,
      0 0 4px #aaa,
      0 0 4px #aaa,
      0 0 4px #aaa,
      0 0 4px #aaa;
  }

  .health {
    height: 82px;
    width: 320px;
    position: absolute;
    left: 136px;
    bottom: 22px;
    z-index: 1;
    justify-content: space-between;
  }
  .health .pencil {
    background-color: rgb(255, 112, 112);
    height: 25px;
    width: 300px;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    transition: 0.3s;
  }
  .health .pencil txt {
    font-size: 22px;
    color: white;
    width: 25px;
    height: 25px;
    background-color: #b896be;
    text-align: center;
    font-family: write;
    font-weight: bold;
  }
  .health .ruler {
    background-color: rgb(255, 185, 152);
    height: 52px;
    width: 300px;
    flex-direction: row;
    position: relative;
  }
  .health .ruler div {
    position: relative;
    left: -3px;
    width: 3px;
    background-color: #666;
    height: 10px;
    margin: 3px;
  }
  .health .ruler txt {
    position: absolute;
    right: 16px;
    top: 20px;
    font-family: title;
    color: #666;
  }

  .power {
    position: absolute;
    width: 220px;
    height: 120px;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    clip-path: ellipse(110px 110px at 50% 110px);
    left: 26px;
    top: 18px;
    align-items: center;
    transform: rotate(-55deg) scale(0.8);
  }
  .power .line {
    margin: auto;
    height: 100px;
    width: 200px;
    border-radius: 100px 100px 0 0;
    --color: rgba(44, 44, 44, 0.4);
    border: 3px solid var(--color);
    align-items: center;
  }
  .power .line div {
    width: 206px;
    height: 3px;
    position: absolute;
    bottom: 7px;
    background-color: var(--color);
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
  }
  .power .cursor {
    clip-path: polygon(0 50%, 50% 0, 100% 50%);
    background-color: #af2863;
    position: absolute;
    bottom: -110px;
    width: 30px;
    height: 240px;
    transition: 0.4s;
  }
  .avatar {
    height: 110px;
    width: 110px;
    background-color: white;
    position: absolute;
    filter: drop-shadow(0 0 4px #777);
    left: 120px;
    top: 47px;
    transform: rotate(4deg);
    z-index: 2;
    cursor: pointer;
  }
  .avatar img {
    margin: auto;
    height: 90px;
    width: 90px;
    background: #aaa;
  }
  .buff {
    flex-direction: row;
    position: absolute;
    top: 157px;
    left: 145px;
    width: 210px;
    font-size: 20px;
    color: white;
    z-index: 3;
  }
  .buff > div {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    position: relative;
    filter: drop-shadow(0 0 8px #555);
  }
  .buff > div > txt {
    position: absolute;
    right: -5px;
    bottom: -5px;
    font-size: 12px;
    color: white;
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
    font-family: title;
  }

  @keyframes huerotate {
    0% {
      filter: hue-rotate(0deg);
    }

    100% {
      filter: hue-rotate(360deg);
    }
  }
  @keyframes unhuerotate {
    0% {
      filter: hue-rotate(0deg);
    }

    100% {
      filter: hue-rotate(-360deg);
    }
  }
</style>
