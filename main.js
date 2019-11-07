import getBenchmark from './benchmark.js';
import SkillHero from './SkillHero.js';

async function main() {
  let bench = await getBenchmark('chrono_power_illu');
  let sh = new SkillHero(bench);
  await sh.load();
  sh.play();
}

main();
