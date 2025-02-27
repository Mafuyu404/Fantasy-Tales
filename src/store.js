import { writable } from 'svelte/store';

export const page = writable('Index');
export const ctrl = writable({});
export const Explain = writable(false);
export const archive = writable({
  unlocked: {
    role: ["marisa", "reimu", "youmu", "alice"],
    collection: [],
    equipment: [],
    souvenir: [],
    spellcard: [],
    basecard: [],
    achievement: [],
    rule: ["rule_magnify"]
  },
  record: [],
  guide: {
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
    init: true
  }
});
export const data = writable({
  collection: {
    // bottle_of_stars: 3,
    // JupiterACL300: 4,
    // ace: 10,
    // vampires_old_tooth: 50,
    red_and_white_scarf: 50,
    // portable_money_box: 10,
    frozen_frog: 100,
    // bronze_mirror: 1,
    // conch_shell: 200,
    paper_windmill: 3,
    // seal_needle: 1,
    // sport_shoes: 7,
    // shimenawa: 10,
    ice_scale: 10,
    // fluorescent_zanthoxylum: 20,
    ace: 2,
    seal_needle: 10
  },
  rule: [],
  equipment: 'price_tag',
  consumable: {
    banana: 3,
    heart_fire_of_grace: 2,
    good_corn: 1
  },
  card: {
    alice: 4,
    // al035: 2,
    // al034: 2,
    al028: 1,
    al026: 1,
    al027: 1,
    // al038: 1
  },
  souvenir: 'morning_star',
  additional_souvenir: false,
  role: 'alice',
  sugar: 5,
  consumableLimit: 3,
  chance: {
    name: '轻松',
    type: 'red',
    amount: 1,
  },
  health: 40,
  coin: 6000,
  scene: 'xijian',
  stage: 3,
  blackList: [],
  statistics: [],
  coin_reward_total: 0,
  first_boss: "shiki",
  achievement: []
});
export const setting = writable({
  resource: 'dairi'
});
export const explore = writable({
  enermy: ["mokou"],
  cursor: [0, 0, 0],
  offsetY: [1, 0, 0],
  event: [],
  eventList: [],
  eventSummoned: false,
  eventLeft: [],
  target: [true, true, true, true, false, false],
  enermyLimit: 4,
  lv: 100,
  pricelv: 1,
  dragon: 0,
  boss: "mokou"
});
export const cache = writable({});
export const frameEvent = writable({});
export const Admin = writable({ event: {} });