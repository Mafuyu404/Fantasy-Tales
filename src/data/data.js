import collection from "./collection.json";
import equipment from "./equipment.js";
import souvenir from "./souvenir.json";
import spellcard from "./spellcard.js";
import basecard from "./basecard.js";
import role from "./role.json";
import consumable from "./consumable.json";
import enermy from "./enermy.js";
import buff from "./buff.js";
import scene from "./scene.js";
import rule from "./rule.js";
import achievement from "./achievement.js";
import remark from "./remark.js";

const card = {};
Object.assign(card, spellcard);
Object.assign(card, basecard);
const data = {
  role,
  collection,
  equipment,
  souvenir,
  spellcard,
  basecard,
  consumable,
  card,
  enermy,
  buff,
  scene,
  rule,
  achievement,
  remark
};

for (let s in data.souvenir) data.souvenir[s].type = "purple";

data.keys = function (archive) {
  const keys = {};
  for (let k in this) {
    keys[k] = Object.keys(this[k]);
  }
  // 按是否默认解锁来排序
  let _collection = [];
  for (let type of ["blue", "green", "red"]) {
    let source = Object.keys(this.collection).filter(c => this.collection[c].type == type);
    _collection.push(...source.filter(i => this.collection[i].unlock == "default"));
    _collection.push(...source.filter(i => this.collection[i].unlock != "default"));
  }
  keys.collection = _collection;
  for (let type of ["equipment", "souvenir"]) {
    let res = [];
    res.push(...Object.keys(this[type]).filter(i => this[type][i].unlock == "default"));
    res.push(...Object.keys(this[type]).filter(i => this[type][i].unlock != "default"));
    keys[type] = res;
  }
  for (let type of ["spellcard", "basecard"]) {
    let res = [];
    res.push(...Object.keys(this[type]).filter(i => !this[type][i].lock));
    res.push(...Object.keys(this[type]).filter(i => this[type][i].lock));
    keys[type] = res;
  }
  if (archive) {
    let _achievement = [];
    _achievement.push(...Object.keys(this.achievement).filter(i => archive.unlocked.achievement.includes(i)));
    _achievement.push(...Object.keys(this.achievement).filter(i => !archive.unlocked.achievement.includes(i)));
    keys.achievement = _achievement;
  }
  return keys;
};
data.split = function () {
  const res = {};
  for (let k in this) {
    Object.assign(res, this[k]);
  }
  return res;
}
data.index = function (key) {
  let res;
  for (let type of Object.keys(this)) {
    if (key in this[type]) res = type;
  }
  return res;
}

export default data;