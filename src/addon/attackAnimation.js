import MarisaAttack from './part/marisaAttack.svelte';
import YoumuAttack from './part/youmuAttack.svelte';
import ReimuAttack from "./part/reimuAttack.svelte";
import RenkoAttack from "./part/renkoAttack.svelte";

const handle = {
  marisa: MarisaAttack,
  youmu: YoumuAttack,
  reimu: ReimuAttack,
  renko: RenkoAttack
}

export default handle;