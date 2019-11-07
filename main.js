import getBenchmark from './benchmark.js';
import SkillHero from './SkillHero.js';

async function main() {
  let bench = await getBenchmark('weaver_condi_sword');
  let sh = new SkillHero(bench);
  await sh.load();
  sh.play();
}

main();
