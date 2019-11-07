import CastController from './CastController.js';
import SkillData from './SkillData.js';
import SkillIds from './SkillIds.js';

let binds = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  // 'Signet of the Ether': 'c',
  // 'Phantasmal Disenchanter': 'q',
  // 'Mind Spike': 'e',
  // 'Double Something': 'r',
  // 'Gravity Well': 'b',
  // 'Continuum Split': '%',
  // 'Weapon Swap': '`',
  // 'Glyph of Elemental Power (Fire)': 'q',
  // 'Primordial Stance': 'e',
  // 'Signet of Fire': 'r',
  // 'Weave Self': 'b',
  // Fire: '!',
  // Water: '@',
  // Air: '#',
  // Earth: '$',
  'Glyph of Elemental Power (Fire)': '7',
  'Signet of Fire': '8',
  'Primordial Stance': '9',
  'Weave Self': '0',
  Fire: 'F1',
  Water: 'F2',
  Air: 'F3',
  Earth: 'F4',
};

function attunementSwapCasts(bench) {
  let attunements = {};

  for (let skillId in bench.skills) {
    let skillName = bench.skills[skillId];
    if (skillName.includes('Attunement')) {
      attunements[skillId] = skillName;
    }
  }

  let casts = [];
  for (let skillId in attunements) {
    let pressedAttunement = attunements[skillId].split(' ')[1];
    let buffEvents = bench.buffs[skillId];
    for (let event of buffEvents) {
      if (!event.hasOwnProperty('Apply')) {
        continue;
      }
      casts.push({
        label: binds[pressedAttunement],
        start: event.Apply,
        end: event.Apply,
      });
    }
  }
  return casts;
}

function buffApplyCasts(bench, skillId) {
  let casts = [];
  let buffEvents = bench.buffs[skillId];

  for (let event of buffEvents) {
    if (!event.hasOwnProperty('Apply')) {
      continue;
    }
    casts.push({
      label: binds[bench.skills[skillId]],
      start: event.Apply,
      end: event.Apply,
    });
  }
  return casts;
}

export default class SkillHero {
  constructor(bench) {
    this.bench = bench;
    this.castController = new CastController();
    this.start = 0;
    this.msPerPx = 10;
    this.container = document.createElement('div');
    this.container.classList.add('casts-container');
    this.container.style.width = Object.keys(binds).length * 32 + 'px';
    document.body.appendChild(this.container);
    this.update = this.update.bind(this);
  }

  async load() {
    await SkillData.load(this.bench.skills);
    console.log(this.bench);

    let primStance = buffApplyCasts(this.bench, SkillIds.PRIMORDIAL_STANCE);
    let goep = buffApplyCasts(this.bench,
                              SkillIds.GLYPH_OF_ELEMENTAL_POWER_FIRE);
    let attunes = attunementSwapCasts(this.bench);
    this.bench.casts = this.bench.casts.concat(primStance, goep, attunes);

    for (let cast of this.bench.casts) {
      let data = SkillData.get(cast.id);
      console.log(this.bench.skills[cast.id]);
      let label = cast.label || binds[this.bench.skills[cast.id]];
      if (data && data.slot) {
        let matches = data.slot.match(/(Weapon|Downed)_(\d)/);
        if (matches && matches.length > 0) {
          label = matches[2];
        }
      }
      if (!label) {
        console.warn('noooo', this.bench.skills[cast.id]);
      }
      let slot = Object.values(binds).indexOf(label);
      let castText = document.createElement('div');
      castText.classList.add('cast-text');
      castText.textContent = label;

      let elt = document.createElement('div');
      elt.classList.add('cast');
      elt.appendChild(castText);
      let hue = (slot * 32) % 360;
      let lightness = 50;
      if (slot === 7) {
        lightness = 60;
      }
      elt.style.background = `hsl(${hue},90%,${lightness}%)`;
      if (cast.end - cast.start < 200) {
        cast.end = cast.start + 200;
      }
      let height = (cast.end - cast.start) / this.msPerPx;
      elt.style.height = height + 'px';
      let slotX = slot * 32;
      let startY = -height - cast.start / this.msPerPx;
      elt.style.transform = `translate(${slotX}px,${startY}px)`;
      this.container.appendChild(elt);
    }
  }

  play() {
    this.start = Date.now() + 1000;
    this.update();
  }

  update() {
    let timeY = (Date.now() - this.start) / this.msPerPx;
    this.container.style.transform = `translate(-50%,${timeY}px)`;
    window.requestAnimationFrame(this.update);
  }
}
