import Data from "./data";

const unlockHandle = {
  get: function (archive) {
    const result = {};
    for (let type of ["collection", "equipment", "souvenir"]) {
      // 默认解锁
      let keys = Data.keys()[type].filter(k => Data[type][k].unlock == "default");
      // 后来解锁
      if (!archive.unlocked[type]) archive.unlocked[type] = [];
      keys.push(...archive.unlocked[type]);
      result[type] = keys;
    }
    for (let type of ["spellcard", "basecard"]) {
      let keys = Data.keys()[type].filter(k => !Data[type][k].lock);
      if (!archive.unlocked[type]) archive.unlocked[type] = [];
      keys.push(...archive.unlocked[type]);
      result[type] = keys;
    }
    if (!archive.unlocked.achievement) archive.unlocked.achievement = [];
    result.achievement = archive.unlocked.achievement;
    return result;
  },
  from: function (archive) {
    for (let type of ["collection", "equipment", "souvenir"]) {
      archive.unlocked[type] = [];
      for (let achievement of archive.unlocked.achievement) {
        for (let key in Data[type]) {
          if (Data[type][key].unlock == achievement) {
            archive.unlocked[type].push(key);
          }
        }
      }
    }
  }
}

export default unlockHandle;