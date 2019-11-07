import CastController from './CastController.js';
import SkillData from './SkillData.js';

let binds = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  'Signet of the Ether': 'c',
  'Phantasmal Disenchanter': 'q',
  'Mind Spike': 'e',
  'Double Something': 'r',
  'Gravity Well': 'b',
  'Continuum Split': '%',
  'Weapon Swap': '`',
};

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

    for (let cast of this.bench.casts) {
      let data = SkillData.get(cast.id);
      console.log(this.bench.skills[cast.id]);
      let label = binds[this.bench.skills[cast.id]];
      if (data && data.slot) {
        let matches = data.slot.match(/(Weapon|Downed)_(\d)/);
        if (matches && matches.length > 0) {
          label = matches[2];
        }
      }
      if (!label) {
        console.warn('noooo', this.bench.skills[cast.id]);
      }
      let elt = document.createElement('div');
      elt.textContent = label;
      elt.classList.add('cast');
      if (cast.end - cast.start < 200) {
        cast.end = cast.start + 200;
      }
      let height = (cast.end - cast.start) / this.msPerPx;
      elt.style.height = height + 'px';
      let slotX = Object.values(binds).indexOf(label) * 32;
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
