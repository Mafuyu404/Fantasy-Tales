import sector from "../data/sector";
import cirno from "./enermy/cirno";
import mokou from "./enermy/mokou";
import piece from "./enermy/piece";
import lilywhite from "./enermy/lilywhite";
import eternity from "./enermy/eternity";
import chen from "./enermy/chen";
import daiyousei from "./enermy/daiyousei";
import medicine from "./enermy/medicine";
import kanako from "./enermy/kanako";
import sunny from "./enermy/sunny";
import lunar from "./enermy/lunar";
import star from "./enermy/star";
import rumia from "./enermy/rumia";
import narumi from "./enermy/narumi";
import nitori from "./enermy/nitori";
import koakuma from "./enermy/koakuma";
import sanae from "./enermy/sanae";
import onoduka from "./enermy/onoduka";
import mystia from "./enermy/mystia";
import momizi from "./enermy/momizi";
import shiki from "./enermy/shiki";
import yukari from "./enermy/yukari";
import yukari0 from "./enermy/yukari0";
import ran from "./enermy/ran";
import kyouko from "./enermy/kyouko";

const enermy = {
  mokou,
  cirno,
  piece,
  lilywhite,
  eternity,
  chen,
  daiyousei,
  medicine,
  kanako,
  sunny,
  lunar,
  star,
  rumia,
  narumi,
  nitori,
  koakuma,
  sanae,
  onoduka,
  mystia,
  momizi,
  shiki,
  yukari,
  yukari0,
  ran,
  kyouko
}

for (let e in enermy) {
  const mirror = {
    zagu: "blue",
    elite: "green",
    boss: "red",
  };
  enermy[e].color = mirror[enermy[e].type];
  let g = enermy[e].growth;
  enermy[e].growth = lv => {
    return growth(lv, g);
  };
  let a = enermy[e].action;
  enermy[e].action = (Admin, index) => prepare(Admin, index, _ => a(Admin, index));
}

function prepare(Admin, index, handle) {
  let info = {
    valid: true,
    index: index,
  };
  sector.enermyAction(Admin, info);
  if (info.valid) handle();
}

function growth(lv, scale) {
  lv = retain(lv + window.exploreLevelScale * 20, 0) - 10;
  return {
    health: float(e(lv) * scale.health),
    attack: float(e(lv) * scale.attack / 8),
    speed: 1 + 0.02 * (lv + Math.floor(Math.random() * 3) - 1) * scale.speed,
  }
}
function e(lv) {
  return parseInt(Math.pow(Math.E, lv / (Math.log(lv + 1) + Math.sqrt(lv))) + lv + 10);
}
function float(v) {
  return v * 0.95 + Math.random().toFixed(2) * v * 0.1;
}

export default enermy;