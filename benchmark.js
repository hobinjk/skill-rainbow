import SkillIds from './SkillIds';
import EIParser from './EIParser';

async function get(id, name) {
  const url = `./benchmarks/${id}.json`;
  const res = await fetch(url);
  const raw = await res.json();
  const log = EIParser.parseJson(raw);
  log.casts = log.casts[0];
  log.buffs = log.buffs[0];
  log.targetDamage1S = log.targetDamage1S[0];
  if (id === 'deadeye_rifle') {
    // Adjust DPS for LN settings
    for (let i = 0; i < log.targetDamage1S; i++) {
      log.targetDamage1S[i] = log.targetDamage1S[i] * 38100 / 40720;
    }
  }
  log.id = id;
  if (!name) {
    log.name = id.replace(/_/g, ' ');
  }
  return log;
}

function hasCast(log, id) {
  for (let cast of log.casts) {
    if (cast.id === id) {
      return true;
    }
  }
  return false;
}

export default get;
