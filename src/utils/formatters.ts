import cloneDeep from 'lodash/cloneDeep';
import OverlayAPI, { CombatantData } from 'ffxiv-overlay-api';

/**
 * format number
 */
export function fmtNumber(number: number, decimal = 1) {
  if (typeof number !== 'number') {
    number = Number(number);
  }

  let sign = '';
  if (number < 0) {
    sign = '-';
  }

  number = Math.abs(number);

  let numberString: string;
  switch (true) {
    case number < 1e4:
      numberString = number.toFixed(0);
      break;
    case number < 1e7:
      numberString = `${(number / 1e3).toFixed(decimal)}k`;
      break;
    case number < 1e10:
      numberString = `${(number / 1e6).toFixed(decimal)}m`;
      break;
    default:
      numberString = number.toFixed(decimal);
  }

  return `${sign}${numberString}`;
}

interface PetMergeTempMap {
  [key: string]: { player: CombatantData; pets: CombatantData[] };
}

/**
 * merge pet data into player
 */
export function fmtMergePet(combatant: CombatantData[] = [], yid = 'YOU') {
  const map: PetMergeTempMap = {};
  // init all players
  for (let i = 0; i < combatant.length; i++) {
    const player = combatant[i];
    if (!/\([^)]+\)/gi.exec(player.name)) {
      if (player.name === 'YOU') {
        map[yid] = { player: cloneDeep(player), pets: [] };
      } else {
        map[player.name] = { player: cloneDeep(player), pets: [] };
      }
    }
  }
  // init all pets
  for (let i = 0; i < combatant.length; i++) {
    const player = combatant[i];
    const owner = /\(([^)]+)\)/gi.exec(player.name);
    if (owner && owner[1]) {
      let name = owner[1];
      name === 'YOU' && (name = yid);
      if (map[name] && map[name].pets) {
        map[name].pets.push(cloneDeep(player));
      }
    }
  }

  const ret: CombatantData[] = [];
  for (const name of Object.keys(map)) {
    const res = OverlayAPI.mergeCombatant(map[name].player, ...map[name].pets);
    res && ret.push(res);
  }
  return ret;
}
