const sector = {
  battleOnload: function (Admin, info) {
    /**
     * @todo 整场战斗初始化时
     * @param {number} equipmentLimit 本场战斗中装备的剩余使用次数
     */
    let state = Admin.role.state.of(0).get();
    Admin.role.collection.link("philosophers_stone").to(amount => {
      info.equipmentLimit += amount
    });
    Admin.role.souvenir.link("ahabs_opinion").to(_ => {
      let state = Admin.role.state.of(0).get();
      Admin.role.state.of(0).set("health", state.health * 0.7);
      Admin.role.state.of(0).set("Health", state.health * 0.7);
    });
    // 初始化统计
    Admin.statistics.resetRoundData();
    Admin.cache["total_heal"] = 0;
    // 成就
    if (state.Health / state.health >= 0.9) {
      Admin.cache["achievement_ac005_90%"] = true;
    }
    if (state.Health / state.health <= 0.2) {
      Admin.cache["achievement_ac012_20%"] = true;
    }
    if (Admin.handcard.getAll().filter(c => c.type == "normal_attack").length == 0) {
      Admin.achievement("ac025");
    }
  },
  roleOnload: function (Admin, info) {
    /**
     * @todo 角色信息初始化时，也可以说是战斗开始时，
     * @param {number} exPowerLimit 额外灵力上限，默认等于牌库总牌数
     */
    Admin.role.collection.link("paper_windmill").to(amount => {
      Admin.role.state.of(0).set("power", Admin.role.state.of(0).get().power + amount);
      Admin.role.power.of(0).reset();
      info.exPowerLimit += amount;
    });
    Admin.role.collection.link("seal_needle").to(_ => {
      Admin.role.buff.of(0).set("seal_needle_buff", 8);
    });
    Admin.role.collection.link("sport_shoes").to(amount => {
      Admin.role.buff.of(0).set("sport_shoes_buff", 10 - amount);
    });
    Admin.role.souvenir.link("ahab's_opinion").to(_ => {
      let h = Math.floor(Admin.role.state.of(0).get().health * 0.7);
      Admin.role.state.of(0).set("health", h);
      Admin.role.state.of(0).set("Health", h);
    });
    Admin.role.collection.link("frozen_frog").to(amount => {
      Admin.role.buff.of(0).set("baka", amount);
    });
  },
  enermyOnload: function (Admin, info) {
    /**
     * @todo 敌人信息初始化时，比角色信息初始化要慢一些些
     * @param {Array} enermys 都出场了些什么敌人，是一个key数组
     */
  },
  probability: function (Admin, info) {
    /**
     * @todo 在进行概率判定的时候，默认将true对应好的结果
     * @param {number} probability 初始概率，0~1
     */
    let ex_decide = 0;
    if (Admin.data.role == "reimu") {
      ex_decide += 2;
    }
    Admin.role.collection.link("ace").to(amount => {
      ex_decide += amount;
    });
    info.probability = 1 - Math.pow(1 - info.probability, ex_decide + 1);
    Admin.role.buff.of(0).link("strong_luck").to(_ => {
      info.probability = 1;
    });
  },
  roleStateGet: function (Admin, info) {
    /**
     * @todo 在获取角色面板的时候，和角色属性有关的加成都要走这里，速度加成那些就在这里加好了，加上也不会影响初始值
     * @param {object} state 角色面板的拷贝，包含speed、health、power等
     * @param {target} number 获取的谁的面板
     */
    Admin.role.buff.of(info.target).link("tardy").to(amount => {
      info.state.speed *= Math.pow(0.95, amount);
    });

    Admin.role.collection.link("corvis_feathers").to(amount => {
      if (Object.keys(Admin.role.buff.of(0).getAll()).length >= 2)
        info.state.speed += amount * 0.2;
    });
    Admin.role.collection.link("burning_seashore_flower").to(amount => {
      info.state.speed += amount * 0.01 * Math.floor((1 - info.state.Health / info.state.health) * 100);
    });
    Admin.role.collection.link("flip_flops").to(amount => {
      let exPower = Admin.role.power.of(0).getExPower();
      info.state.speed += amount * 0.2 * exPower;
    });

    Admin.role.buff.of(info.target).link("baka").to(amount => {
      info.state.speed += amount * 0.3;
    });
    Admin.role.buff.of(info.target).link("accelerate").to(amount => {
      info.state.speed += amount * 0.1;
    });
    Admin.role.buff.of(info.target).link("eight_dragon_kill").to(_ => {
      info.state.speed -= 1;
    });
    // 成就
    if (info.state.speed > 5) {
      Admin.achievement("ac002");
    }
  },
  enermyStateGet: function (Admin, info) {
    /**
     * @todo 在获取敌人面板的时候，和敌人属性有关的加成都要走这里，速度加成那些就在这里加好了，加上也不会影响初始值
     * @param {object} state 角色面板的拷贝，包含speed、health、attack等
     * @param {number} target 获取的谁的面板
     */
    Admin.enermy.buff.of(info.target).link("tardy").to(amount => {
      info.state.speed *= Math.pow(0.95, amount);
    });
    Admin.enermy.buff.of(info.target).link("accelerate").to(amount => {
      info.state.speed += amount * 0.1;
    });
  },
  roleBuffGet: function (Admin, info) {
    /**
     * @todo 获取角色buff的时候，包括link.to和buff.get，在buff触发事件之前
     * @param {number} amount 该buff的层数
     * @param {number} target 谁的buff要结算
     * @param {object} buff 结算什么buff
     */
    Admin.role.collection.link("fish_stone").to(amount => {
      if (!info.buff.positive)
        info.amount -= amount * 2;
    });
  },
  roleBuffUpdate: function (Admin, info) {
    /**
     * @todo 更改角色buff的时候，包括add、set和clear，不包含clearAll
     * @param {number} amount 该buff的层数
     * @param {object} buff buff的名字
     */

    // 成就
    if (info.buff == "interim_barrier" && info.amount > Admin.role.state.of(0).get().health) {
      Admin.achievement("ac014");
    }
    if (Admin.role.buff.of(0).count() >= 5) {
      Admin.achievement("ac015");
    }
  },
  handcardOnload: function (Admin, info) {
    /**
     * @todo 手牌系统初始化时，在战斗中第一次抽牌之前
     * @param {number} limit 默认手牌上限，默认为4
     * @param {object} handcards 自己的牌库
     */
    Admin.role.souvenir.link("wanderlust").to(_ => info.limit = 3);
    Admin.role.collection.link("patchoulis_ribbon").to(amount => {
      let cards = Admin.handcard.getAll();
      let cost = cards.map(card => card.cost);
      let max = Math.max(...cost);
      let results = cards.filter(card => card.cost == max);
      let key = results.rd()[0].key;
      Admin.handcard.setCost.byKey(key, -Math.min(max, amount));
    });
  },
  roleRoundStart: function (Admin, info) {
    /**
     * @todo 角色的回合开始的时候，还没回复自然灵力也还没抽牌
     * @param {bool} powerReset 是否要回复自然灵力
     * @param {number} offset 回复自然灵力时值的偏移，很显然，这个偏移只能为负
     * @param {bool} handcardRefresh 是否要进行回合初的抽牌
     * @param {Array} interimBuff 每回合初要清除的buff，还没清除
     * @param {Array} decreaseBuff 每回合初要递减的buff，还没递减
     */
    let state = Admin.role.state.of(0).get();
    // 优先级高
    Admin.role.souvenir.link("momos_gamepad").to(_ => {
      if (Admin.role.event.round.count > 1 && Admin.cache["round_hurt_total"] == 0) {
        Admin.role.buff.of(0).add("interim_strength", 5);
      }
    });
    Admin.data.role == "marisa" && Admin.role.power.of(0).add(4);
    if (Admin.cache["open_universe"]) {
      Admin.role.buff.of(0).add("insulation");
      delete Admin.cache["open_universe"];
      info.powerReset = false;
    }
    if (Admin.cache["super_perseids"]) {
      Admin.role.buff.of(0).add("strength", Admin.cache["super_perseids"] - 1);
      delete Admin.cache["super_perseids"];
    }
    if (Admin.cache["escape_velocity"]) {
      Admin.role.buff.of(0).add("accelerate", 6);
    }
    delete Admin.cache["roundEndAttack"];
    delete Admin.cache["patience"];
    delete Admin.cache["pure_happy_cost"];
    delete Admin.cache["reimu_health_cost"];
    // 收藏品部分
    Admin.role.collection.link("terrible_ring").to(amount => {
      Admin.role.buff.of(0).set("slow_power", Admin.role.event.round.count * amount);
    });
    Admin.role.collection.link("paper_windmill").to(amount => {
      Admin.role.power.of(0).add(amount);
    });
    Admin.role.collection.link("winter_gloves").to(amount => {
      Admin.role.buff.of(0).set("gloves_buff", amount);
    });
    // 下面是buff的部分
    Admin.role.buff.of(0).link("pure_happy").to(amount => {
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: amount,
        penetrate: true
      });
    });
    Admin.role.buff.of(0).link("burning").to(amount => {
      Admin.role.state.of(0).set("Health", Admin.role.state.of(0).get().Health * (1 - 0.02 * amount));
    });
    Admin.role.buff.of(0).link("orrerys_sun").to(_ => {
      Admin.role.buff.of(0).clear("orrerys_sun");
      Admin.cache["orrerys_sun"].forEach(unit => {
        unit.damage.value *= 1.5;
        unit.damage.amount = 1;
        Admin.enermy.damage.target(unit.target).source("spellcard").by(unit.damage);
      });
      delete Admin.cache["orrerys_sun"];
    });
    Admin.role.buff.of(0).link("hypodynamic").to(_ => {
      info.powerReset = false;
      Admin.role.power.of(0).clear();
    });
    Admin.role.buff.of(0).link("in_treatment").to(amount => {
      Admin.role.heal.target(0).by({
        type: "static",
        value: Admin.role.state.of(0).get().Health * amount * 0.1
      });
    });
    Admin.role.buff.of(0).link("magic_bean").to(_ => {
      Admin.role.power.of(0).add(2);
      Admin.role.heal.target(0).by({
        type: "static",
        value: 4
      });
    })
    Admin.role.buff.of(0).link("charging").to(amount => {
      Admin.role.power.of(0).add(amount);
    });
    Admin.role.buff.of(0).link("tired").to(amount => {
      info.offset -= amount;
    });
    Admin.role.buff.of(0).link("bleed").to(amount => {
      Admin.role.damage.target(0).by({
        type: "static",
        value: amount,
        final: true
      });
      Admin.role.doll.link("helan").to(_ => {
        Admin.role.buff.of(0).clear("bleed");
      });
    });
    Admin.role.buff.of(0).link("spirit_poison").to(amount => {
      Admin.role.damage.target(0).by({
        type: "static",
        value: state.Health * 0.05 * amount,
        final: true
      });
      Admin.role.buff.of(0).add("trance", amount);
    });
    Admin.role.buff.of(0).link("waiting_pearl").to(_ => {
      Admin.role.buff.of(0).add("pure_happy", 12);
      Admin.handcard.draw.amount(2).fromLeft();
    });
    Admin.role.buff.of(0).link("shadow_joke").to(_ => {
      let holds = Admin.handcard.getHolds();
      let target = [];
      holds.map((c, i) => c.key == "a030" && target.push(i));
      Admin.handcard.abandon.fromHolds(target);
      Admin.role.buff.of(0).clear("shadow_joke");
    });
    Admin.role.buff.of(0).link("tardy").to(amount => {
      Admin.role.buff.of(0).set("tardy", Math.ceil(amount / 2));
    });
    Admin.role.buff.of(0).link("weilaiwenle").to(_ => {
      let holdLimit = 4 + Math.round(Admin.role.state.of(0).get().speed);
      let holdLength = Admin.handcard.getHolds().length;
      Admin.handcard.draw.amount(holdLimit - holdLength).fromLeft();
    });
    Admin.role.event.round.count > 1 && Admin.role.buff.of(0).clear("baka", 1);
    // 纪念品
    Admin.role.souvenir.link("wanderlust").to(_ => {
      let speed = Admin.role.state.of(0).get().speed;
      Admin.role.power.of(0).add(Math.ceil(speed));
    });
    Admin.role.souvenir.link("ddchenzi").to(_ => {
      if (Admin.role.event.round.count == 1 || Admin.role.buff.of(0).get("ddchenzi_buff")) {
        Admin.role.power.of(0).add(5);
        Admin.role.buff.of(0).clear("ddchenzi_buff");
      }
      else {
        info.powerReset = false;
      }
    });
    // 人偶
    Admin.role.doll.link("tansuo").to(_ => {
      Admin.enermy.buff.of(Admin.enermy.survival().rd()[0]).add("exposure", 2);
    });
    Admin.role.doll.link("yuanzhuo").to(_ => {
      Admin.handcard.insert.amount(2).interim(true).toHolds("alice");
    });
    Admin.role.doll.link("banzizhu").to(_ => {
      Admin.role.doll.add({
        name: "泛用人偶",
        key: "fanyong",
        health: 12,
        attack: 4,
        card: "al035",
        time: 2
      });
    });
    // 特殊
    setTimeout(_ => {
      if (Admin.cache["momizi"]) {
        let survival = Admin.enermy.survival();
        let effect_valid = Admin.cache["momizi"].map((v, i) => survival.includes(i) && v).includes(true);
        if (effect_valid) {
          msg({ content: "你还有十秒钟能出牌" });
          Admin.role.buff.of(0).set("round_timer", 10);
          Admin.frameEvent.add("momizi_timer", function () {
            Admin.role.buff.of(0).clear("round_timer", 1);
            if (Admin.role.buff.of(0).get("round_timer") == 1) {
              Admin.frameEvent.clear("momizi_timer");
              Admin.role.event.round.end();
            }
          }, 62);
        }
      }
    }, 1000);
    // 其它
    if (Admin.cache["a038_round_inset_card"]) {
      Admin.cache["a038_round_inset_card"].forEach(key => {
        Admin.handcard.insert.amount(1).interim(true).toHolds(key);
      });
    }
    let dolls = Admin.role.doll.get();
    if (dolls > 0) {
      dolls.forEach((doll, i) => {
        if ("time" in doll) {
          if (doll.time == 0) Admin.role.doll.clear(i);
          else doll.time--;
        }
      })
    }
    // 统计
    Admin.statistics.saveRoundData();
    Admin.statistics.resetRoundData();
  },
  handcardRefresh: function (Admin, info) {
    /**
     * @todo 回合初刷新手牌时
     * @param {number} holdLimit 经速度比较调整后的手牌上限，最终值
     * @param {Array} handcards 自己的牌库，装的是牌的key
     * @param {Array} hold 显而易见，是当前手牌们
     * @param {Array} ex 额外加入的牌，格式为牌的key
     * @param {number} drawLimit 能抽的上限，其实也就是牌库剩余的牌数
     * @param {number} drawAmount 打算抽多少张
     */
    Admin.role.souvenir.link("morning_star").to(_ => {
      Admin.battle.equipment.left.add(1);
    });
    Admin.role.souvenir.link("wanderlust").to(_ => info.holdLimit = 5);
    Admin.role.equipment.link("repentance_rod").to(_ => {
      if (info.drawAmount >= info.drawLimit)
        Admin.role.power.of(0).add(5);
    });
    Admin.role.collection.link("blade_of_yellow_spring").to(amount => {
      info.drawLimit += amount;
    });
    if (Admin.cache["shiki"]) {
      Admin.cache["shiki"][3] -= info.drawAmount;
      Admin.enermy.survival().forEach(i => Admin.enermy.buff.of(i).clear("shiki3", info.drawAmount));
    }
    Admin.role.buff.of(0).link("fool_range").to(amount => {
      info.drawAmount += amount;
      info.drawLimit -= amount;
    });
    if (Admin.data.role == "alice") {
      if (Admin.role.event.round.count == 1)
        info.drawAmount += 2;
    }
    // 成就
    if (info.drawAmount >= info.drawLimit) {
      Admin.achievement("ac031");
    }
  },
  handcardLeftReset: function (Admin, info) {
    /**
     * @todo 牌堆被抽完的时候，将牌库洗进牌堆，在手牌系统初始化完成后也会发生一次，这次也是在第一次抽牌前
     * @param {object} res 牌库的原生复制，还未打乱顺序
     */
  },
  afterRoleRoundStart: function (Admin, info) {
    /**
     * @todo 角色回合开始时的各种事件全部触发完后，就算手再快也还没打出第一张牌！
     * @param {object} null 暂时还没有环境变量
     */
    Admin.role.collection.link("blade_of_yellow_spring").to(amount => {
      Admin.handcard.insert.interim(true).amount(amount).toHolds(Admin.data.role);
    });
  },
  beforePowerCost: function (Admin, info) {
    /**
     * @todo 打出卡时进行卡消耗的计算，在扣除之前
     * @param {string} card 卡的信息对象，包括key、name、detail之类的
     * @param {number} cost 卡的消耗，默认是1或3
     * @param {number} index_of_all 卡在牌库中的排序，这个序号是唯一的
     * @param {number} index_of_holds 卡在手牌中的排序，同样是唯一的
     */
    Admin.role.buff.of(0).link("diligence").to(_ => {
      info.cost += 2;
    });
    Admin.role.buff.of(0).link("humility").to(amount => {
      if (info.card.type == "basecard") info.cost -= amount;
    });
    Admin.role.buff.of(0).link("xianshizhiwang").to(_ => {
      if (info.card.key == Admin.data.role) {
        info.cost++;
      }
    })
    // 为了让这个镜子更强，放最后结算
    Admin.role.equipment.link("mirror_of_pear").to(_ => {
      if (info.card.key == Admin.data.role) info.cost = 0;
    });
    // 这个挂件理所应当是放最最后的，不过还是优先于灵梦的被动
    Admin.role.souvenir.link("mimicry_cat_pendant").to(_ => {
      Admin.cache["mimicry_cat_pendant"] = info.cost;
      info.cost = 0;
    });
    if (Admin.data.role == "reimu") {
      if (Admin.role.power.of(0).get() < info.cost) {
        Admin.cache["reimu_cost"] = info.cost - Admin.role.power.of(0).get();
        info.cost = Admin.role.power.of(0).get();
      }
    }
    // 需要满足条件才能打出的牌
    // 条件是当前有大于一张手牌
    if (["y016", "a021"].includes(info.card.key)) {
      if (Admin.handcard.getHolds().length <= 1) {
        info.valid = false;
      }
    }
    if (info.card.key == "a014") {
      let source = Admin.handcard.getHolds().filter(c => c.type == "basecard");
      if (source.length == 0) {
        info.valid = false;
      }
    }
    if (info.card.key == "a010") {
      if (Admin.handcard.getHolds().length <= 1) {
        info.valid = false;
      }
    }
    if (info.card.key == "a018") {
      if (!Admin.cache["last_card"] || Admin.cache["last_card"] == "a018") {
        info.valid = false;
      }
    }
    if (info.card.key == "a038") {
      if (!Admin.cache["last_card"] || Admin.cache["last_card"] == "a038") {
        info.valid = false;
      }
    }
    if (info.card.key == "r013") {
      if (Admin.role.buff.of(0).get("pure_happy") < 6) {
        info.valid = false;
      }
    }
    if (info.card.key == "r026" || info.card.key == "r034") {
      if (!Admin.role.buff.of(0).get("pure_happy")) {
        info.valid = false;
      }
    }
    if (info.card.key == "r027") {
      if (Admin.handcard.getHolds().length <= 1) {
        info.valid = false;
      }
    }
    if (info.card.key == "y024") {
      if (!Admin.role.buff.of(0).get("telepathism")) {
        info.valid = false;
      }
    }
    if (info.card.key == "al008") {
      if (Admin.role.doll.get().length < 1) {
        info.valid = false;
      }
    }
    if (info.card.key == "al001") {
      if (Admin.role.doll.get().length < 3) {
        info.valid = false;
      }
    }
    if (info.card.key == "al015") {
      if (Admin.handcard.getHolds().length <= 3) {
        info.valid = false;
      }
    }
    if (info.card.key == "al017") {
      if (Admin.handcard.getHolds().length <= 2) {
        info.valid = false;
      }
    }
    // 需求丢弃一张普攻
    if (["y014", "y021", "y036"].includes(info.card.key)) {
      let source = Admin.handcard.getHolds().filter(c => c.type == "normal_attack");
      if (source.length == 0) {
        info.valid = false;
      }
    }

    if (Admin.cache["mystia_first"]) {
      let survival = Admin.enermy.survival();
      let effect_valid = Admin.cache["mystia_first"].map((v, i) => survival.includes(i) && v).includes(true);
      if (effect_valid && Admin.cache["round_punch_count"] == 0) {
        if (info.index_of_holds != 0) info.valid = false;
      }
    }
    Admin.role.buff.of(0).link("throttle").to(amount => {
      info.cost = Math.max(0, info.cost - amount);
    });
    // 统计
    Admin.cache["round_cost_total"] += info.cost;
  },
  punchCard: function (Admin, info) {
    /**
     * @todo 打出牌时，也是结算灵力之后
     * @param {number} cost 卡的最终消耗
     * @param {number} target 对着哪个目标用的
     * @param {string} type 卡的类型，spellcard、basecard、normal_attack
     * @param {object} card 卡的详情，包含key、role、index、name、detail、cost、interim、aim等
     * @param {bool} valid 这张卡要不要生效
     */
    if (Admin.data.role == "reimu") {
      if (Admin.cache["reimu_cost"]) {
        let state = Admin.role.state.of(0).get();
        Admin.role.state.of(0).set("health", state.health - Admin.cache["reimu_cost"] * 2);
        delete Admin.cache["reimu_cost"];
      }
    }
    Admin.role.souvenir.link("mimicry_cat_pendant").to(_ => {
      Admin.role.state.of(0).set("Health", Admin.role.state.of(0).get().Health * (1 - 0.1 * Admin.cache["mimicry_cat_pendant"]));
    });
    if (Admin.data.role == "youmu") {
      if (info.cost > 0)
        Admin.role.buff.of(0).add("telepathism", info.cost);
    }
    Admin.role.collection.link("shy_rabbit").to(amount => {
      if (!Admin.cache["shy_rabbit"]) Admin.cache["shy_rabbit"] = 1;
      else Admin.cache["shy_rabbit"]++;
      if (Admin.cache["shy_rabbit"] == 2) {
        Admin.role.buff.of(0).add("shy_rabbit", amount);
      }
      if (Admin.cache["shy_rabbit"] == 3) {
        Admin.role.buff.of(0).clear("shy_rabbit");
      }
      if (Admin.cache["shy_rabbit"] == 4) {
        Admin.cache["shy_rabbit"] = 1;
      }
    });
    Admin.role.collection.link("seal_needle").to(_ => {
      if (!Admin.role.buff.of(0).get("seal_needle_buff"))
        Admin.battle.effect.targetEnermy(0).by(_ => {
          Admin.role.buff.of(0).set("seal_needle_buff", 8);
        });
    });
    Admin.role.collection.link("sport_shoes").to(amount => {
      Admin.role.buff.of(0).link("sport_shoes_buff").to(left => {
        if (left == 1) {
          Admin.role.buff.of(0).set("sport_shoes_buff", 10 - amount);
          Admin.battle.equipment.left.add(1);
        }
        else Admin.role.buff.of(0).clear("sport_shoes_buff", 1);
      });
    });
    Admin.role.collection.link("light_bulb").to(amount => {
      let power = Admin.role.power.of(0).get()
      if (power < amount && power + info.cost >= amount)
        Admin.handcard.draw.amount(2).fromLeft();
    });
    Admin.role.buff.of(0).link("gloves_buff").to(_ => {
      if (Admin.handcard.getHolds().length == 1) {
        Admin.handcard.draw.amount(1).fromLeft();
        Admin.role.buff.of(0).clear("gloves_buff", 1);
      }
    });
    if (info.card.type == "spellcard") {
      // 打出了一张符卡
      if (Admin.cache["super_perseids"]) {
        Admin.cache["super_perseids"]++;
      }
      Admin.role.equipment.link("circular_fan").to(_ => {
        Admin.handcard.insert.interim(true).cost(0).toHolds(Admin.data.role);
      });
      Admin.role.buff.link("yinyang_bird").to(_ => {
        if (Admin.probability(0.3)) {
          Admin.role.power.of(0).add(2);
          Admin.role.buff.of(0).add("pure_happy", 4);
        }
      });
    }
    else if (info.card.type == "basecard") {
      // 打出了一张通式
      Admin.role.buff.of(0).link("rhythm").to(amount => {
        Admin.role.heal.target(0).by({
          type: "static",
          value: 5 * amount
        });
      });
    }
    else {
      // 普通攻击
      if (Admin.cache["patience"]) {
        Admin.role.buff.of(0).add("focus", 3);
      }
      Admin.role.buff.of(0).link("Bright_Bitter_Wheel").to(_ => {
        Admin.role.buff.of(0).add("strength", 1);
      });
    }
    if (Admin.cache["pulsar_star"]) {
      if (Admin.cache["pulsar_star"] == 2) {
        Admin.cache["pulsar_star"]--;
      }
      else {
        Admin.handcard.insert.interim(true).toHolds(info.card.key);
        delete Admin.cache["pulsar_star"];
      }
    }
    Admin.role.buff.of(0).link("diligence").to(_ => {
      info.card.handle(Admin, info.target);
    });
    if (Admin.cache["magic_link"]) {
      info.valid = false;
      Admin.role.heal.target(0).by({
        type: "static",
        value: 8
      });
      Admin.role.buff.of(0).add("pure_happy", 6);
      Admin.cache["magic_link"] = false;
    }
    if (Admin.cache["mystia_invalid"]) {
      let survival = Admin.enermy.survival();
      let effect_valid = Admin.cache["mystia_invalid"].map((v, i) => survival.includes(i) && v);
      if (effect_valid.includes(Admin.cache["round_punch_count"] + 1)) {
        info.valid = false;
        msg({ content: "无效" });
      }
    }
    // 特殊
    if (Admin.cache["shiki"]) {
      if (typeof info.cost == "number" && info.cost > 0) {
        Admin.cache["shiki"][2] -= info.cost;
        Admin.enermy.survival().forEach(i => Admin.enermy.buff.of(i).clear("shiki2", info.cost));
      }
    }
    // 成就
    if (info.cost > 5) {
      Admin.achievement("ac019");
    }
    if (Admin.handcard.getHolds().length == 1) {
      "punch_last_count".increaseOf(Admin.cache);
      if (Admin.cache["punch_last_count"] == 3) {
        Admin.achievement("ac020");
      }
    }
    // 统计
    Admin.cache["round_punch_count"]++;
    if (info.card.interim) Admin.cache["round_expend_count"]++;
  },
  dollAdd: function (Admin, info) {
    /**
     * @todo 放置人偶时
     * @param {object} doll 人偶信息，包含key、name、card、health、attack、time等
     */
    Admin.role.buff.of(0).link("magic_fabric").to(_ => {
      Admin.handcard.insert.amount(1).interim(true).toHolds(info.card);
    });
  },
  rolePowerAdd: function (Admin, info) {
    /**
     * @todo 获得额外灵力的时候，发生在实际获得额外灵力之前
     * @param {number} amount 获得额外灵力的数值
     */
    Admin.role.collection.link("paper_windmill").to(amount => {
      info.limit += amount;
    });
    //最后触发
    Admin.role.buff.of(0).link("insulation").to(_ => info.amount = 0);
    // 成就
    if (info.amount + Admin.role.power.of(0).getExPower() >= info.limit) {
      Admin.achievement("ac011");
    }
  },
  enermyDamagedProcess: function (Admin, info) {
    /**
     * @todo 敌人受到伤害的时候，在进行实际扣除和显示之前
     * @param {object} damage 伤害输入，包含type类型value值，可选indirect间接amount值blocked被阻挡miss被闪避
     * @param {number} target 伤害的目标
     * @param {string} source 伤害的来源，spellcard、collection等
     */
    if (!info.damage.final && info.damage.value > 0) {
      //开始烹饪！
      if (info.source) {
        // 有来源的伤害，也就是角色造成的伤害
        // 那么这个放大镜肯定是最先结算的
        if (Admin.data.rule.includes("rule_magnify")) info.damage.value *= 2;
        Admin.role.buff.of(0).link("orrerys_sun").to(_ => {
          if (!Admin.cache["orrerys_sun"]) Admin.cache["orrerys_sun"] = [];
          if (!info.damage.indirect) {
            info.damage.indirect = true;
            info.damage.orrerys_sun = true;
          }
        });
        Admin.role.buff.of(0).link("milky_way").to(amount => {
          info.damage.value += amount * 2;
        });
        Admin.role.buff.of(0).link("blood_blade").to(_ => {
          info.damage.value += 8;
          Admin.role.state.of(0).add("Health", -4);
        });
        Admin.role.collection.link("shimenawa").to(amount => {
          info.damage.value += Admin.battle.equipment.left.get() * amount;
        });
        Admin.role.buff.of(0).link("momentum").to(amount => {
          info.damage.value += amount * 1;
        });
        // 初始暴击率和暴击伤害
        let criticalChance = 0.05,
          criticalDamage = 0.5;
        // 暴击和暴伤处理部分
        Admin.role.collection.link("fluorescent_zanthoxylum").to(amount => {
          criticalChance += 0.05 * amount;
        });
        Admin.role.collection.link("burning_seashore_flower").to(amount => {
          let state = Admin.role.state.of(0).get();
          criticalChance += amount * 0.003 * Math.floor((1 - state.Health / state.health) * 100);
        });
        Admin.role.collection.link("human_soul_lamp").to(amount => {
          criticalDamage += 0.7 * amount;
        });
        Admin.role.buff.of(0).link("slow_power").to(amount => {
          criticalChance += amount * 0.04;
        });
        Admin.role.buff.of(0).link("marisa_time").to(_ => {
          criticalChance += 0.4;
        });
        Admin.role.buff.of(0).link("grand_cross").to(_ => {
          criticalDamage += 1;
        });
        Admin.role.buff.of(0).link("laevatain").to(_ => {
          criticalChance += 1;
          criticalDamage += 0.5;
        });
        Admin.role.buff.of(0).link("yinianwuliangjie").to(_ => {
          criticalDamage += 1;
        });
        Admin.role.buff.of(0).link("tiannvfan").to(_ => {
          let speed = Admin.role.state.of(0).get().speed;
          criticalDamage += speed * 0.2;
        });
        // 妖梦的被动必须最后结算
        if (Admin.data.role == "youmu") {
          criticalDamage += criticalChance;
          criticalChance = 0;
        }
        // 成就
        if (criticalChance >= 1) {
          Admin.achievement("ac028");
        }
        let critical = criticalChance >= 1 ? true : Admin.probability(criticalChance);
        // 间接伤害不能暴击
        if (info.damage.indirect) {
          critical = false;
        }
        else {
          // 判定是否暴击，有两个判定，第一个是自然判定，第二个是强制暴击
          if (critical || info.damage.critical) {
            // 暴击触发的事件
            info.damage.critical = true;
            info.damage.value *= 1 + criticalDamage;
            Admin.role.collection.link("free_eagle").to(amount => {
              if (Admin.cache["free_eagle"]) {
                Admin.cache["free_eagle"] = false;
                Admin.role.buff.of(0).clear(false, amount * 2);
              }
              else Admin.cache["free_eagle"] = true;
            });
            Admin.role.buff.of(0).link("moon_sleep").to(_ => {
              info.damage.penetrate = true;
            });
            Admin.role.buff.of(0).link("sanhunqipo").to(_ => {
              Admin.role.power.of(0).add(1);
            });
            if (info.damage["seal_array"]) {
              Admin.role.state.of(0).add("health", 8);
            }
            if (Admin.cache["shiki"]) {
              Admin.cache["shiki"][1]--;
              Admin.enermy.survival().forEach(i => Admin.enermy.buff.of(i).clear("shiki1", 1));
            }
          }
          else {
            // 显而易见，是不暴击触发的事件
            if (info.damage["undifferentiated_subduction"]) {
              Admin.role.buff.of(0).add("pure_happy", 8);
            }
            Admin.role.souvenir.link("eee_book").to(_ => {
              let value = info.damage.value;
              Admin.role.heal.target(0).by({
                type: "static",
                value: value
              });
              info.damage.value = 0;
            });
          }
        }
        // 这里是派生类，如果放在烹饪环节后面就会走两遍烹饪，间接伤害都暴击给你看哦！
        Admin.role.collection.link("bronze_mirror").to(amount => {
          if (!info.damage.bronze_mirror)
            if (Admin.probability(0.25)) {
              Admin.enermy.damage.except(info.target).random().source("collection").by({
                type: "scale",
                value: 0.3 * amount * info.damage.value,
                indirect: true,
                bronze_mirror: true
              });
            }
        });
        Admin.role.collection.link("ice_scale").to(amount => {
          if (Admin.probability(amount * 0.1))
            Admin.enermy.buff.of(info.target).add("tardy", 1);
        });
        Admin.role.collection.link("skyrocket").to(amount => {
          if (Admin.probability(0.2) && info.source == "normal_attack") {
            Admin.enermy.buff.of(info.target).add("burning", 2 * amount);
            Admin.role.power.of(0).add(1);
          }
        });
        Admin.role.collection.link("seal_needle").to(amount => {
          if (!Admin.role.buff.of(0).get("seal_needle_buff")) {
            Admin.enermy.buff.of(info.target).add("bleed", amount * 3);
          }
        });
        Admin.role.collection.link("JupiterACL300").to(amount => {
          if (!info.damage.indirect) {
            let survivor = Admin.enermy.survival(),
              index_of_origin_in_survivor = survivor.indexOf(info.target),
              targets_in_survivor = [index_of_origin_in_survivor - 1, index_of_origin_in_survivor + 1]
            if (index_of_origin_in_survivor == survivor.length - 1)
              targets_in_survivor.pop();
            if (index_of_origin_in_survivor == 0)
              targets_in_survivor.shift();
            if (targets_in_survivor.length > 0) {
              let targets = targets_in_survivor.map(index => survivor[index]);
              Admin.enermy.damage.targetMuti(targets).source("collection").by({
                type: "static",
                value: info.damage.value * amount * 0.25,
                indirect: true
              });
            }
          }
        });
        Admin.role.buff.of(0).link("test_slave").to(amount => {
          let damage = info.damage.value * 0.25 * amount;
          if (!Admin.cache["test_slave"]) Admin.cache["test_slave"] = [];
          Admin.cache["test_slave"].push(damage);
          info.damage.value -= damage;
        });
        Admin.role.doll.link("eluosi").to(_ => {
          Admin.enermy.damage.target(info.target).source("spellcard").by({
            type: "static",
            value: Admin.enermy.state.of(info.target).get().Health * 0.03,
            final: true,
            indirect: true
          });
        });
        Admin.role.doll.link("helan").to(_ => {
          Admin.enermy.buff.of(info.target).add("bleed", 1);
        });
        Admin.role.doll.link("shanghai").to(_ => {
          if (Admin.probability(0.2)) {
            let buffs = Admin.enermy.buff.of(info.target).getAll();
            for (let b in buffs) {
              if (!buffs[b].positive) {
                Admin.enermy.damage.target(info.target).source("spellcard").by({
                  type: "static",
                  value: buffs[b].amount,
                  final: true,
                  indirect: true
                });
              }
            }
          }
        });
        if (Admin.cache["koakuma"] && Admin.battle.round.get()) {
          if (Admin.cache["koakuma"][info.target]) {
            Admin.role.damage.target(0).from(info.target).by({
              type: "static",
              value: info.damage.value * 0.1
            });
          }
        }
        // 然后是道具等的各个烹饪环节，都是独立乘区，排序不分先后
        Admin.role.collection.link("portable_money_box").to(amount => {
          info.damage.value *= (1 + amount * 0.05 * Math.floor(Admin.data.coin / 400));
        });
        Admin.role.collection.link("compass_cat").to(amount => {
          if (Admin.enermy.state.of(info.target).get().speed < Admin.role.state.of(0).get().speed)
            info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.collection.link("sundial").to(amount => {
          if (info.damage.indirect)
            info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.collection.link("pickled_radish").to(amount => {
          let state = Admin.role.state.of(0).get();
          if (state.Health / state.health > 0.9)
            info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.collection.link("false_hammer").to(amount => {
          if (Admin.enermy.info.of(info.target).get().type == "elite")
            info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.collection.link("shy_rabbit").to(amount => {
          if (Admin.cache["shy_rabbit"] == 3)
            info.damage.value *= 1 + amount * 0.15;
        });
        Admin.role.collection.link("midnight_cloak").to(amount => {
          let state = Admin.enermy.state.of(info.target).get();
          if (state.Health / state.health < 0.5)
            info.damage.value *= 1 + amount * 0.1;
        });
        // buff
        Admin.role.buff.of(0).link("instinct").to(amount => {
          if (info.source == "normal_attack") {
            info.damage.value *= 1 + 0.1 * amount;
          }
        });
        Admin.role.buff.of(0).link("focus").to(amount => {
          if (info.source == "spellcard")
            info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.buff.of(0).link("wine_strength").to(amount => {
          if (info.source == "spellcard")
            info.damage.value *= 1 + amount * 0.3;
        });
        Admin.role.buff.of(0).link("weak").to(amount => {
          info.damage.value *= 1 - amount * 0.1;
        });
        Admin.role.buff.of(0).link("strength").to(amount => {
          info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.buff.of(0).link("interim_strength").to(amount => {
          info.damage.value *= 1 + amount * 0.1;
        });
        Admin.role.buff.of(0).link("wrath").to(amount => {
          if (info.source == "normal_attack") {
            info.damage.value *= 1 + 0.5 * amount;
          }
        });
        Admin.role.buff.of(0).link("yanfan").to(amount => {
          if (info.source == "normal_attack") {
            info.damage.value *= 1 + 0.8 * amount;
            Admin.role.buff.of(0).clear("yanfan");
          }
        });
        Admin.role.buff.of(0).link("xianshizhiwang").to(_ => {
          if (info.source == "normal_attack") {
            info.damage.value *= 2;
          }
        });
        Admin.role.buff.of(0).link("big_bad_sun").to(_ => {
          info.damage.value *= 0.1;
        });
        // 装备
        Admin.role.equipment.link("sword_of_feixiang").to(_ => {
          let count = Admin.enermy.buff.of(info.target).count(false);
          if (count > 0) info.damage.value *= 1.4;
        });
        Admin.role.equipment.link("mirror_of_pear").to(_ => {
          if (info.source == "normal_attack") {
            info.damage.value *= 1 + 0.3;
          }
        });
        Admin.role.buff.of(0).link("eagle_90").to(_ => {
          Admin.enermy.damage.target(info.target).source("equipment").by({
            type: "static",
            value: info.damage.value * 0.5,
            final: true
          });
        });
      }
      // 可被穿透的减伤
      if (!info.damage.penetrate) {
        // 阻挡伤害
        Admin.enermy.buff.of(info.target).link("natral_protect").to(_ => {
          if (reallyDamaged(info.damage)) {
            info.damage.value = 5;
          }
        });
        Admin.enermy.buff.of(info.target).link("interim_barrier").to(amount => {
          if (reallyDamaged(info.damage)) {
            if (amount < info.damage.value) {
              info.damage.value -= amount;
              Admin.enermy.buff.of(info.target).clear("interim_barrier");
            }
            else {
              Admin.enermy.buff.of(info.target).clear("interim_barrier", Math.ceil(info.damage.value));
              info.damage.value = 0;
            }
          }
        });
        Admin.enermy.buff.of(info.target).link("barrier").to(amount => {
          if (reallyDamaged(info.damage)) {
            if (amount < info.damage.value) {
              info.damage.value -= amount;
              Admin.enermy.buff.of(0).clear("barrier");
            }
            else {
              Admin.enermy.buff.of(0).clear("barrier", Math.ceil(info.damage.value));
              info.damage.value = 0;
            }
          }
        });
        Admin.enermy.buff.of(info.target).link("qianzhidun").to(amount => {
          if (reallyDamaged(info.damage)) {
            if (info.damage.value < amount / 2) info.damage.value /= 2;
            if (amount < info.damage.value) {
              info.damage.value -= amount;
              Admin.enermy.buff.of(info.target).clear("qianzhidun");
            }
            else {
              Admin.enermy.buff.of(info.target).clear("qianzhidun", Math.ceil(info.damage.value));
              info.damage.value = 0;
            }
          }
        });
        // 闪避伤害
        Admin.enermy.buff.of(info.target).link("foresee").to(_ => {
          info.damage.miss = true;
        });
      }
      if (Admin.cache["ran"] && info.target != 0) {
        // 想了很多，但是蓝的承伤效果还是先结算好
        info.damage.value /= 2;
        let damage = deepCopy(info.damage);
        damage.penetrate = false;
        damage.final = false;
        Admin.enermy.damage.target(0).by(damage);
      }
    }
    // 烹饪完就是最终伤害了
    info.damage.final = true;
    // 并非角色触发，而是敌人自带
    Admin.enermy.buff.of(info.target).link("miracle").to(amount => {
      info.damage.value -= amount;
    });
    Admin.enermy.buff.of(info.target).link("fragile").to(amount => {
      info.damage.value *= 1 + amount * 0.1;
    });
    Admin.enermy.buff.of(info.target).link("iron_skin").to(amount => {
      info.damage.value *= 1 - 0.1 * amount;
    });
    Admin.enermy.buff.of(info.target).link("exposure").to(_ => {
      info.damage.penetrate = true;
    });
    // 阻挡判定
    if (info.damage.value <= 0) info.damage.blocked = true;
    // 命中率相关
    if (!info.damage.penetrate) {
      if (!info.damage.precision) info.damage.precision = 1;
      if (info.damage.precision) {
        if (reallyDamaged(info.damage) && !Admin.probability(info.damage.precision)) {
          info.damage.miss = false;
        }
      }
      if (info.source) {
        Admin.role.buff.of(0).link("trance").to(amount => {
          if (reallyDamaged(info.damage) && !Admin.probability(1 - 0.1 * amount)) {
            info.damage.miss = false;
          }
        });
        Admin.enermy.buff.of(info.target).link("cautious").to(amount => {
          if (reallyDamaged(info.damage) && !Admin.probability(1 - 0.1 * amount)) {
            info.damage.miss = false;
          }
        });
      }
    }
    if (info.source && reallyDamaged(info.damage)) Admin.role.buff.of(0).link("orrerys_sun").to(amount => {
      if (info.damage.orrerys_sun) {
        for (let _ of Array(amount)) {
          Admin.cache["orrerys_sun"].push(deepCopy(info));
        }
        info.damage.blocked = true;
      }
    });
    // 必定致死伤害
    if (info.damage.fatal) {
      info.damage.value = Admin.enermy.state.of(info.target).get().Health;
      delete info.damage.miss;
      delete info.blocked;
    }
    // 敌人确实受到伤害之后
    if (reallyDamaged(info.damage)) {
      let state = Admin.enermy.state.of(info.target).get();
      // 特殊
      if (info.damage["jump_jade"]) {
        Admin.role.heal.target(0).by({
          type: "static",
          value: 4
        });
      }
      if (Admin.cache["narumi"]) {
        // 矢田寺成美的判定必须放这，不然额外伤害是不过前面那一片的判定的。
        if (Admin.cache["narumi"][info.target]) {
          let count = Admin.cache["narumi"][info.target];
          if (state.health > state.Health && info.damage.value >= state.Health) {
            Admin.cache["narumi"][info.target]++;
            let health = state.health * (1 - count * 0.2);
            Admin.enermy.state.of(info.target).set("health", health);
            Admin.enermy.state.of(info.target).set("Health", health);
            info.damage.blocked = true;
            Admin.enermy.buff.of(info.target).set("magic_life", count);
          }
        }
      }
      if (Admin.cache["yukari"]) {
        let index;
        if (Admin.cache["yukari"] == 1) index = 0;
        if (Admin.cache["yukari"] > 1) index = 1;
        if (info.target == index && Admin.cache["yukari"] != 3) {
          if (info.damage.value >= state.Health) {
            Admin.enermy.state.of(info.target).set("Health", state.health);
            info.damage.blocked = true;
            Admin.cache["yukari"]++;
            Admin.battle.effect.targetEnermy(info.target).clearTask();
            if (Admin.cache["yukari"] == 2) {
              Admin.enermy.insert("ran", 0);
              info.target++;
            }
            Admin.role.souvenir.link("merrys_paperclip").to(_ => {
              Admin.cache["yukari"] = 3;
              Admin.event.unlockRule();
            });
            if (Admin.cache["yukari"] == 3) {
              Admin.enermy.state.of(0).set("Health", Admin.enermy.state.of(0).get().health)
              Admin.enermy.insert("chen", 2);
              Admin.role.damage.target(0).from(2).by({
                type: "scale",
                value: 36,
                amount: 4
              });
            }
            Admin.enermy.buff.of(info.target).clearAll();
          }
        }
      }
      if (info.source) {
        // 角色造成伤害
        if (info.damage.indirect) {
          Admin.role.buff.of(0).link("shadow_joke").to(_ => {
            if (!info.damage.shadow_joke) {
              Admin.role.state.of(0).add("Health", -1);
              Admin.handcard.insert.interim(true).amount(1).toHolds("a030");
            }
          });
        }
        Admin.role.buff.of(0).link("meditation_slash").to(_ => {
          if (info.damage.value < state.health * 0.05) {
            Admin.enermy.buff.of(info.target).add("trance", 1);
          }
        });
        Admin.role.buff.of(0).link("font_safe").to(_ => {
          Admin.role.heal.target(0).by({
            type: "static",
            value: 4
          });
          Admin.role.buff.of(0).add("trance", 2);
          Admin.role.buff.of(0).add("pure_happy", 2);
        });
        Admin.role.collection.link("cursed_wind_chimes").to(amount => {
          if (info.damage.value > 60 - amount * 3) {
            Admin.enermy.buff.of(info.target).clearAll();
          }
        });
        Admin.role.equipment.link("gongonier").to(_ => {
          if (info.damage.critical) {
            Admin.role.heal.target(0).from(0).by({
              type: "static",
              value: info.damage.value * 0.1
            });
          };
        });
        Admin.role.buff.of(0).clear("seal_needle_buff", 1);
        Admin.role.collection.link("vampires_old_tooth").to(amount => {
          if (Admin.enermy.buff.of(info.target).count(true) > 0)
            Admin.role.heal.target(0).by({
              type: "static",
              value: amount
            });
        });
        Admin.role.collection.link("earthy_spider_wine").to(amount => {
          if (info.source == "normal_attack")
            Admin.role.buff.of(0).set("wine_strength", amount);
        });
        Admin.role.collection.link("bottle_of_stars").to(amount => {
          if (info.damage.value > 100) {
            Admin.enermy.buff.of(info.target).add("star", amount, 5);
            if (!Admin.cache["bottle_of_stars"]) Admin.cache["bottle_of_stars"] = [];
            for (let i = 0; i < amount; i++)
              Admin.cache["bottle_of_stars"].push({
                target: info.target,
                damage: info.damage.value * 0.3,
              });
          }
        });
        if (info.damage.dragon_meteor) {
          if (info.damage.dragon_meteor == 1) {
            if (state.Health <= info.damage.value) {
              Admin.cache["dragon_meteor"] = true;
              Admin.role.buff.of(0).add("interim_strength", 5);
            }
          }
          if (info.damage.dragon_meteor == 2) {
            if (Admin.cache["dragon_meteor"]) {
              delete Admin.cache["dragon_meteor"];
            } else if (state.Health <= info.damage.value) {
              Admin.role.buff.of(0).add("interim_strength", 5);
            }
          }
        }
        if (info.damage.jade_dance) {
          if (state.Health <= info.damage.value) {
            Admin.handcard.draw.amount(2).fromLeft();
          }
        }
        // 其它
        Admin.enermy.buff.of(info.target).link("poison_body").to(_ => {
          Admin.role.buff.of(0).add("spirit_poison", 1);
        });
        if (Admin.cache["yukari"] == 3) {
          if (Admin.role.state.of(0).get().Health > 4)
            Admin.role.state.of(0).add("Health", -4);
        }
        if (Admin.cache["kyouko"] && Admin.cache["kyouko"].includes(info.target)) {
          Admin.role.damage.target(0).from(info.target).by({
            type: "static",
            value: info.damage.value / 2
          });
        }
        // 成就
        if (info.damage.indirect) {
          "round_indirect_damage_frequency".increaseOf(Admin.cache);
          if (Admin.cache["round_indirect_damage_frequency"] == 10) {
            Admin.achievement("ac004");
          }
        }
        if (info.damage.value > 1000) {
          Admin.achievement("ac024");
        }
        // 统计
        Admin.cache["round_damage_frequency"]++;
        Admin.cache["round_damage_total"] += info.damage.value;
        Admin.cache["round_max_damage"] = Math.max(info.damage.value, Admin.cache["round_max_damage"]);
      }
      Admin.role.collection.link("crown_of_thorns").to(amount => {
        if (Admin.battle.round.get() == false) {
          if (!Admin.cache["crown_of_thorns"][info.target]) {
            Admin.enermy.buff.of(info.target).add("fragile", amount);
            Admin.cache["crown_of_thorns"][info.target] = true;
          }
        }
      });
      Admin.enermy.buff.of(info.target).link("crime_fire").to(_ => {
        if (Admin.probability(0.6)) {
          Admin.enermy.buff.of(info.target).add("burning", 1);
        }
      });
    }
    else {
      // 未命中
      if (info.damage["dream_seal"]) {
        Admin.role.buff.of(0).add("pure_happy", 6);
      }
      if (info.damage["ghost_breaker"]) {
        Admin.role.buff.of(0).add("interim_barrier", 12);
      }
      if (info.damage["faith_needle"]) {
        Admin.handcard.draw.amount(2).fromLeft();
      }
      if (info.damage["jump_jade"]) {
        Admin.role.state.of(0).add("health", 4);
      }
    }
  },
  roleHealProcess: function (Admin, info) {
    /**
     * @todo 角色受到的治疗，不知道要不要区分来源，兴许以后会有将伤害转化为治疗的东西
     * @param {object} heal 治疗，包含type类型value值
     * @param {number} target 谁被治疗
     */
    // 烹饪环节
    Admin.role.collection.link("sakura_tea").to(amount => {
      info.heal.value *= 1 + amount * 0.1;
    });
    Admin.role.collection.link("water_joke").to(_ => {
      let value = info.heal.value;
      Admin.role.damage.target(0).by({
        type: "static",
        value: value
      });
      info.heal.value = 0;
    });
    Admin.role.buff.of(0).link("big_bad_sun").to(_ => {
      info.heal.value *= 2;
    });
    // 所以铅笔应该放在这边
    if (Admin.data.rule.includes("rule_pencil")) {
      let value = info.heal.value;
      Admin.role.buff.of(0).add("interim_barrier", Math.floor(value));
      info.heal.value = 0;
    }
    let state = Admin.role.state.of(0).get();
    //过量治疗量
    let overHeal = info.heal.value + state.Health - state.health;
    Admin.role.collection.link("sticking_plaster").to(amount => {
      if (overHeal > 0) {
        let value = Math.floor(amount * 0.1 * overHeal);
        Admin.role.buff.of(0).add("interim_barrier", value);
      }
    });
    if (info.heal.cheer_up) {
      Admin.role.buff.of(0).add("barrier", Math.ceil(overHeal));
    }
    if (info.heal.value > 0) Admin.role.buff.of(0).clear("bleed");
    if (!info.heal.final) {
      // 烹饪完后得出最终治疗量
      info.heal.final = true;
      // 特殊
      if (Admin.cache["shiki"]) {
        Admin.cache["shiki"][0] -= Math.floor(info.heal.value);
        Admin.enermy.survival().forEach(i => Admin.enermy.buff.of(i).clear("shiki0", Math.floor(info.heal.value)));
      }
      if (Admin.cache["kyouko"]) {
        Admin.cache["kyouko"].forEach(i => Admin.enermy.heal.target(i).by({
          type: "static",
          value: info.heal.value / 2,
          final: true
        }));
      }
    }
    // 成就
    if (info.heal.value > state.health / 2) {
      Admin.achievement("ac010");
    }
    if (state.Health / state.health > 0.2) {
      Admin.cache["achievement_ac012_20%"] = false;
    }
    // 统计
    Admin.cache["total_heal"] += info.heal.value;
  },
  useEquipment: function (Admin, info) {
    /**
     * @todo 使用主动装备时，主动装备是独立的事件，而这边的东西偏向于过程中的变数，所以就单独放equipment.js了
     */
    Admin.role.collection.link("toolbox").to(amount => {
      if (Admin.probability(amount * 0.25))
        this.defeatEnermy(Admin);
    });
    // 成就
    "round_equipment_used_count".increaseOf(Admin.cache);
    if (Admin.cache["round_equipment_used_count"] == 10) {
      Admin.achievement("ac026");
    }
  },
  drawCard: function (Admin, info) {
    /**
     * @todo 全局的抽牌时触发，包括回合初的自然抽牌和一些牌自带的抽牌，如果是回合初的自然抽牌，请转到handcardRefresh，对了，发生在开始抽牌之前
     * @param {number} holdLimit 手牌上限
     * @param {number} amount 抽牌数
     * @param {number} drawLimit 牌库剩余牌的数量，也就是抽牌上限
     */
    Admin.role.souvenir.link("morning_star").to(_ => {
      Admin.battle.equipment.left.add(1);
    });
    Admin.role.equipment.link("repentance_rod").to(_ => {
      if (info.amount >= info.drawLimit)
        Admin.role.power.of(0).add(5);
    });
    if (Admin.cache["shiki"]) {
      Admin.cache["shiki"][3] -= info.amount;
      Admin.enermy.survival().forEach(i => Admin.enermy.buff.of(i).clear("shiki3", info.amount));
    }
    Admin.role.buff.of(0).link("fool_range").to(amount => {
      info.amount += amount;
      info.drawLimit -= amount;
    });
    Admin.role.souvenir.link("wanderlust").to(_ => info.holdLimit = 5);
    // 成就
    if (info.amount >= info.drawLimit) {
      Admin.achievement("ac031");
    }
  },
  abandonCard: function (Admin, info) {
    /**
     * @todo 丢弃手牌时
     * @param {number} amount 弃牌数
     * @param {string} type 丢弃的牌是什么类型，未指定就是undefined
     */
    Admin.role.collection.link("toolbox").to(amount => {
      if (Admin.probability(amount * 0.25))
        this.defeatEnermy(Admin);
    });
  },
  defeatEnermy: function (Admin, info) {
    /**
     * @todo 击败敌人后触发的事件，这个结束后才会看是不是打完了
     * @param {object} damage 伤害输入，包含type类型value值，可选indirect间接amount值blocked被阻挡miss被闪避，是击败敌人的最后一击
     * @param {number} target 伤害的目标，也就是被击败的敌人
     */
    let enermy_info = info ? Admin.enermy.info.of(info.target).get() : {};
    Admin.role.collection.link("bird_wine").to(amount => {
      Admin.enermy.buff.addAll("burning", amount * 1);
    });
    Admin.role.collection.link("trolley").to(amount => {
      Admin.role.power.of(0).add(amount);
    });
    Admin.role.collection.link("black_8").to(amount => {
      Admin.role.buff.of(0).set("black_8_buff", amount);
    });
    if (Admin.data.role == "marisa") {
      Admin.role.heal.target(0).by({
        type: "static",
        value: 8
      });
    }
    // 成就
    if (enermy_info.key == "chen" && Admin.enermy.state.of(info.target).get().speed > Admin.role.state.of(0).get().speed) {
      Admin.achievement("ac003");
    }
    if (enermy_info.type == "zagu") {
      "defeat_zagu_count".increaseOf(Admin.data);
      if (Admin.data.defeat_zagu_count == 50) {
        Admin.achievement("ac017");
      }
    }
    if (enermy_info.type == "elite" && Admin.role.event.round.count == 1) {
      Admin.achievement("ac006");
    }
    if (enermy_info.key && !Admin.battle.round.get()) {
      Admin.achievement("ac007");
    }
    if (enermy_info.key && info.damage.penetrate) {
      "penetrate_defeat_count".increaseOf(Admin.cache);
      if (Admin.cache["penetrate_defeat_count"] == 3) {
        Admin.achievement("ac009");
      }
    }
    if (enermy_info.type == "boss" && !Admin.data.equipment) {
      Admin.achievement("ac013");
    }
    if (enermy_info.key && Admin.enermy.buff.of(info.target).count(false) >= 5) {
      Admin.achievement("ac029");
    }
    if (enermy_info.key && Admin.enermy.buff.of(info.target).count(true) >= 5) {
      Admin.achievement("ac030");
    }
    if (enermy_info.type == "boss" && Admin.cache["achievement_ac005_90%"]) {
      Admin.achievement("ac005");
    }
    if (enermy_info.key == "yukari") {
      Admin.achievement("ac000");
    }
    // 解锁符卡
    if (enermy_info.type == "boss" && !Admin.data.trial) {
      Admin.event.unlockCard("spellcard");
    }
  },
  roleRoundEnd: function (Admin, info) {
    /**
     * @todo 角色的回合结束时，目前没什么环境参数
     */
    Admin.role.souvenir.link("stubborn_jk").to(_ => {
      if (Admin.role.event.round.count == 4) {
        Admin.battle.deadEvent();
      }
    });
    Admin.role.collection.link("big_bugle").to(amount => {
      Admin.enermy.damage.targetAll().source("collection").by({
        type: "static",
        value: amount * 2,
        penetrate: true,
        indirect: true
      });
    });
    Admin.role.collection.link("ghost_lantern").to(amount => {
      let powerLeft = Admin.role.power.of(0).getExPower();
      if (powerLeft > 0)
        Admin.role.buff.of(0).add("interim_barrier", amount * powerLeft);
    });
    Admin.role.buff.of(0).link("test_slave").to(_ => {
      if (!Admin.cache["test_slave"]) Admin.cache["test_slave"] = [];
      Admin.enermy.damage.targetAll().source("spellcard").by({
        type: "static",
        value: Admin.cache["test_slave"].sum()
      });
      delete Admin.cache["test_slave"];
      Admin.role.buff.of(0).clear("test_slave");
    });
    Admin.role.buff.of(0).link("blue_poison").to(amount => {
      Admin.role.damage.target(0).by({
        type: "static",
        value: amount,
        indirect: true
      });
    });
    Admin.role.souvenir.link("cerallins_bottle").to(_ => {
      let amount = Admin.handcard.getHolds().length;
      Admin.handcard.abandon.amount(amount).fromHolds();
      Admin.role.power.of(0).add(amount);
    });
    Admin.role.souvenir.link("ddchenzi").to(_ => {
      if (Admin.role.power.of(0).get() == 0) {
        Admin.role.buff.of(0).set("ddchenzi_buff", 1);
      }
    });
    Admin.role.doll.link("aoerliang").to(_ => {
      Admin.role.heal.target(0).by({
        type: "static",
        value: 10
      });
    });
    Admin.role.doll.link("jingdu").to(_ => {
      Admin.role.power.of(0).add(2);
    });
    Admin.role.doll.link("tansuo").to(_ => {
      Admin.enermy.buff.of(Admin.enermy.survival().rd()[0]).add("exposure", 2);
    });
    Admin.role.doll.link("yuanzhuo").to(_ => {
      Admin.handcard.insert.amount(2).interim(true).toHolds("alice");
    });
    Admin.role.doll.link("banzizhu").to(_ => {
      Admin.role.doll.add({
        name: "泛用人偶",
        key: "fanyong",
        health: 12,
        attack: 4,
        card: "al035",
        time: 2
      });
    });
    Admin.role.buff.of(0).clear("round_timer");
    if (Admin.cache["roundEndAttack"]) {
      for (let f of Admin.cache["roundEndAttack"]) f();
    }
    let dolls = Admin.role.doll.get();
    if (dolls.length > 0) {
      let source = dolls.map((_, i) => i).filter(i => dolls[i].key == "zibao");
      source.forEach(_ => {
        Admin.enermy.damage.targetAll().source("spellcard").by({
          type: "static",
          value: 8
        });
      });
      Admin.role.doll.clearAll(source);
    }
  },
  enermyRoundStart: function (Admin, info) {
    /**
     * @todo 敌人的回合开始的时候
     * @param {number} target 具体哪个敌人的回合
     * @param {object} interimBuff 每回合初要清除的buff，还没清除
     * @param {object} decreaseBuff 每回合初要递减的buff，还没递减
     */
    let state = Admin.enermy.state.of(info.target).get();

    // 是小恶魔先来的
    if (Admin.cache["koakuma"]) {
      if (Admin.cache["koakuma"][info.target]) {
        Admin.enermy.buff.of(info.target).clear("iron_skin");
      }
    }

    Admin.enermy.buff.of(info.target).link("burning").to(amount => {
      Admin.enermy.damage.target(info.target).by({
        type: "static",
        value: state.health * 0.02 * amount,
        final: true
      });
    });
    Admin.enermy.buff.of(info.target).link("star").to(_ => {
      let stars = Admin.cache["bottle_of_stars"].filter(star => star.target == info.target);
      for (let star of stars) {
        Admin.enermy.damage.target(info.target).source("collection").by({
          type: "static",
          value: star.damage,
          indirect: true,
          final: true
        }, 5);
      }
      Admin.enermy.buff.of(info.target).clear("star");
      Admin.cache["bottle_of_stars"] = Admin.cache["bottle_of_stars"].filter(star => star.target != info.target);
    });
    Admin.enermy.buff.of(info.target).link("bleed").to(amount => {
      Admin.enermy.damage.target(info.target).by({
        type: "static",
        value: amount,
        final: true
      });
      Admin.role.doll.link("helan").to(_ => {
        Admin.enermy.buff.of(info.target).clear("bleed");
      });
    });
    Admin.enermy.buff.of(info.target).link("tardy").to(amount => {
      Admin.enermy.buff.of(info.target).set("tardy", Math.ceil(amount / 2));
    });

    Admin.role.collection.link("crown_of_thorns").to(_ => {
      if (!Admin.cache["crown_of_thorns"]) Admin.cache["crown_of_thorns"] = [];
      Admin.cache["crown_of_thorns"][info.target] = false;
    });
  },
  enermyAction: function (Admin, info) {
    /**
     * @todo 敌人将要开始行动的时候
     * @param {number} target 具体哪个敌人要行动
     * @param {object} index 这个行动是否有效，默认为true
     */
    Admin.enermy.buff.of(info.index).link("lust").to(_ => {
      info.valid = false;
      Admin.role.damage.target(0).from(info.index).by({
        type: "static",
        value: Admin.enermy.state.of(info.index).get().health * 0.2
      });
    });
    Admin.enermy.buff.of(info.index).link("trance_cage").to(_ => {
      info.valid = false;
      Admin.role.buff.of(0).add("trance", 3);
    });
  },
  roleDamagedProcess: function (Admin, info) {
    /**
     * @todo 角色受到伤害的时候，在进行实际扣除和显示之前
     * @param {object} damage 伤害输入，包含type类型value值，可选indirect间接amount值blocked被阻挡miss被闪避
     * @param {number} target 伤害的目标
     * @param {string} source 伤害的来源，spellcard、collection等
     * @param {number} from 如果是敌人造成的，是谁造成的
     */
    let state = Admin.role.state.of(0).get();
    Admin.role.buff.of(0).link("exposure").to(_ => {
      info.damage.penetrate = true;
    });
    // 百分比减伤(或增伤)
    Admin.role.collection.link("amulet_of_full_moon").to(amount => {
      let count = Admin.role.buff.of(0).count(false);
      if (count >= 1) info.damage.value *= Math.pow(0.9, amount);
    });
    Admin.role.buff.of(0).link("iron_skin").to(amount => {
      info.damage.value *= 1 - 0.1 * amount;
    });
    Admin.role.buff.of(0).link("black_8_buff").to(amount => {
      info.damage.value *= Math.pow(0.9, amount);
    });
    Admin.role.buff.of(0).link("fragile").to(amount => {
      info.damage.value *= 1 + amount * 0.1;
    });
    Admin.role.buff.of(0).link("eight_dragon_kill").to(_ => {
      info.damage *= 1 - 0.4;
    });
    Admin.role.souvenir.link("nodas_hat").to(_ => {
      let state = Admin.role.state.of(0).get();
      if (state.Health / state.health > 0.5) {
        info.damage.value *= 1.2;
      }
      if (state.Health / state.health < 0.5) {
        info.damage.value *= 0.7;
      }
    });
    if (typeof info.from == "number") {
      // 伤害来源自敌人
      Admin.enermy.buff.of(info.from).link("strength").to(amount => {
        info.damage.value *= 1 + amount * 0.1;
      });
      Admin.enermy.buff.of(info.from).link("interim_strength").to(amount => {
        info.damage.value *= 1 + amount * 0.1;
      });
    }
    // 固定减伤(或增伤)
    Admin.role.collection.link("conch_shell").to(amount => {
      info.damage.value -= amount;
    });
    Admin.role.collection.link("shimenawa").to(_ => {
      info.damage.value -= Admin.battle.equipment.left.get();
    });
    if (!info.damage.penetrate) {
      // 阻挡伤害
      Admin.role.buff.of(0).link("interim_barrier").to(amount => {
        if (reallyDamaged(info.damage))
          if (amount < info.damage.value) {
            info.damage.value -= amount;
            Admin.role.buff.of(0).clear("interim_barrier");
          }
          else {
            Admin.role.buff.of(0).clear("interim_barrier", Math.ceil(info.damage.value));
            info.damage.value = 0;
          }
      });
      Admin.role.buff.of(0).link("barrier").to(amount => {
        if (reallyDamaged(info.damage))
          if (amount < info.damage.value) {
            info.damage.value -= amount;
            Admin.role.buff.of(0).clear("barrier");
          }
          else {
            Admin.role.buff.of(0).clear("barrier", Math.ceil(info.damage.value))
            info.damage.value = 0;
          }
      });
    }
    // 人偶部分
    let dolls = Admin.role.doll.get();
    if (dolls.length > 0) {
      let rate = 0.7;
      for (let doll of dolls) {
        if (info.damage.value > 0) {
          let damage = Math.ceil(info.damage.value * rate);
          if (doll.health > damage) {
            Admin.role.doll.set(0, "health", Math.floor(doll.health - damage));
            info.damage.value *= (1 - rate);
            return;
          }
          else {
            info.damage.value -= doll.health * rate;
            if (doll.key == "penglai") {
              Admin.enermy.damage.target(info.from).source("spellcard").by({
                type: "static",
                value: 40,
                indirect: true,
                penetrate: true
              });
            }
            Admin.role.doll.clear(0);
          }
        }
      }
    }
    // 含羞草的结算还存疑，但是不放最后的话强度就太高了
    Admin.role.collection.link("mimosa").to(amount => {
      let limit = Admin.role.state.of(0).get().health * 0.7 * Math.pow(0.95, amount - 1);
      info.damage.value = Math.min(info.damage.value, limit);
    });
    if (info.damage.value <= 0) info.damage.blocked = true;
    // 烹饪结束
    info.damage.final = true;
    if (typeof info.from == "number") {
      // 敌人造成伤害
      if (!info.damage.penetrate) {
        // 命中率相关，有比较讲究的结算顺序
        Admin.role.buff.of(0).link("rebound").to(_ => {
          if (reallyDamaged(info.damage)) {
            info.damage.miss = true;
            Admin.enermy.damage.targetAll().source("spellcard").by({
              type: "static",
              value: 7,
              amount: 2
            });
          }
        });
        Admin.role.buff.of(0).link("hakurei_phantom").to(_ => {
          if (reallyDamaged(info.damage) && Admin.probability(0.4)) {
            info.damage.miss = true;
            Admin.role.buff.of(0).add("pure_happy", 6);
          }
        });
        Admin.role.buff.of(0).link("cautious").to(amount => {
          if (reallyDamaged(info.damage) && Admin.probability(0.1 * amount)) {
            info.damage.miss = true;
          }
        });
        Admin.enermy.buff.of(info.from).link("trance").to(amount => {
          if (reallyDamaged(info.damage) && Admin.probability(0.1 * amount)) {
            info.damage.miss = true;
          }
        });
      }
      Admin.role.buff.of(0).link("telepathism").to(amount => {
        console.log(6)
        if (reallyDamaged(info.damage) && Admin.probability(0.1 * amount)) {
          telepathism(Admin, info);
        }
      });
    }
    // 消除伤害
    Admin.role.buff.of(0).link("foresee").to(_ => {
      if (reallyDamaged(info.damage)) {
        info.damage.value = 0;
        info.damage.miss = true;
        Admin.role.buff.of(0).clear("foresee", 1);
      }
    });
    Admin.role.buff.of(0).link("prophesy").to(_ => {
      if (reallyDamaged(info.damage)) {
        info.damage.value = 0;
        info.damage.miss = true;
        Admin.role.buff.of(0).clear("prophesy", 1);
      }
    });
    Admin.role.souvenir.link("aokis_fish").to(_ => {
      if (reallyDamaged(info.damage))
        if (Admin.probability(0.3)) {
          info.damage.value = 0;
          info.damage.blocked = true;
        }
        else {
          Admin.role.buff.of(0).add(["tired", "tardy", "fragile", "weak", "trance"].rd()[0]);
        }
    });
    //特殊
    Admin.role.souvenir.link("stubborn_jk").to(_ => {
      if (info.damage.value >= state.Health) {
        info.damage.value = state.Health - 0.1;
      }
    });
    // 受到伤害后触发
    if (reallyDamaged(info.damage)) {
      Admin.role.buff.of(0).link("xuezhenchimei").to(_ => {
        telepathism(Admin, info);
      });
      Admin.role.souvenir.link("momos_gamepad").to(_ => {
        Admin.role.buff.of(0).add("weak", 4);
      });
      Admin.role.collection.link("large_roll_of_bandages").to(amount => {
        Admin.role.buff.of(0).add("in_treatment", amount);
      });
      Admin.role.collection.link("red_and_white_scarf").to(amount => {
        let state = Admin.role.state.of(0).get();
        if (state.Health < info.damage.value)
          if (state.Health / state.health > 0.3 * Math.pow(0.8, amount - 1)) {
            info.damage.blocked = true;
            Admin.role.state.of(0).set("Health", 1);
          }
      });
      Admin.role.collection.link("butterfly").to(amount => {
        if (Admin.cache["round_hurt_frequency"]) {
          Admin.role.state.of(0).add("Health", amount);
        }
      });
      if (typeof info.from == "number") {
        // 受到敌人伤害之后
        Admin.role.collection.link("magic_dart").to(amount => {
          Admin.enermy.damage.target(info.from).source("collection").by({
            type: "static",
            value: 10 * amount,
            indirect: true
          });
        });
      }
      Admin.role.buff.of(0).link("pure_happy").to(_ => {
        Admin.role.buff.of(0).clear("pure_happy", Math.ceil(info.damage.value, 0));
      });
      if (Admin.cache["kyouko"]) {
        Admin.cache["kyouko"].forEach(i => Admin.enermy.damage.target(i).by({
          type: "static",
          value: info.damage.value / 2
        }));
      }
      // 成就
      if (state.Health == state.health && info.damage.value >= state.Health) {
        Admin.achievement("ac001");
      }
      // 统计
      Admin.cache["round_max_hurt"] = Math.max(info.damage.value, Admin.cache["round_max_hurt"]);
      Admin.cache["round_hurt_total"] += info.damage.value;
      Admin.cache["round_hurt_frequency"]++;
    }
    // 成就
    if (state.Health / state.health < 0.9) {
      Admin.cache["achievement_ac005_90%"] = false;
    }
  },
  enermyHealProcess: function (Admin, info) {
    /**
     * @todo 敌人受到的治疗
     * @param {object} heal 治疗，包含type类型value值
     * @param {number} target 谁被治疗
     */
    if (!info.heal.final) {
      if (Admin.cache["kyouko"] && Admin.cache["kyouko"].includes(info.target)) {
        Admin.role.heal.target(0).by({
          type: "static",
          value: info.heal.value / 2,
          final: true
        });
      }
    }
  },
  equipmentLeftAdd: function (Admin, info) {
    /**
     * @todo 获得主动装备可使用次数时
     * @param {number} amount 要获得几次
     * @param {number} left 现在有几次
     */
    Admin.role.souvenir.link("morning_star").to(_ => {
      if (info.amount + info.left > 4)
        info.amount = 4 - info.left;
    });
  },
  win: function (Admin) {
    /**
     * @todo 显而易见，胜利时
     */

    // 成就
    if (Admin.cache["achievement_ac012_20%"]) {
      Admin.achievement("ac012");
    }
    if (Admin.role.power.of(0).get() == 0) {
      Admin.achievement("ac018");
    }
    if (Admin.enermy.info.getAmount() == 4) {
      Admin.achievement("ac022");
    }
  },
  dead: function (Admin, info) {
    /**
     * @todo 显而易见，寄了
     */

    // 成就
    if (Admin.role.event.round.count >= 5) {
      Admin.achievement("ac016");
    }
    if (Admin.enermy.info.getAmount() == 4) {
      Admin.achievement("ac021");
    }
    if (!info.damage) {
      Admin.achievement("ac023");
    }
  },
  getSouvenir: function (Admin, info) {
    /**
     * @todo 获得纪念品时
     */
    "souvenir_reward_count".increaseOf(Admin.data);
    if (Admin.data.souvenir_reward_count == 3) {
      Admin.achievement("ac033");
    }
  }
}

function reallyDamaged(damage) {
  return !damage.blocked && !damage.miss && damage.value > 0;
}

function telepathism(Admin, info) {
  let damage = {
    type: "static",
    value: 4,
    amount: 2,
    critical: true
  }
  Admin.role.buff.of(0).link("dawuxianhui").to(_ => {
    damage.value = 10;
    damage.amount = 1;
  });
  Admin.role.buff.of(0).link("six_roots_clean").to(_ => {
    damage.value = 3;
    damage.amount = 4;
  });
  let _info = {
    card: {
      key: "youmu",
      type: "normal_attack"
    },
    cost: 1,
    valid: true,
    type: "normal_attack"
  };
  sector.beforePowerCost(Admin, _info);
  if (Admin.role.power.of(0).get()) {
    info.damage.miss = true;
    Admin.enermy.damage.target(info.from).source("normal_attack").by(damage);
    Admin.handcard.draw.amount(1).fromLeft();
    Admin.role.buff.of(0).clear("telepathism", 3);
    Admin.role.power.of(0).cost(_info.cost);
  }
  else msg({ content: "灵力不足" });
  sector.punchCard(Admin, _info);
}

export default sector;