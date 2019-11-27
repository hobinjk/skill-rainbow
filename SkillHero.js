import CastController from './CastController.js';
import SkillBinds from './SkillBinds.js';
import SkillData from './SkillData.js';
import SkillIds from './SkillIds.js';

export default class SkillHero {
  constructor(bench) {
    this.bench = bench;
    this.binds = new SkillBinds();
    this.castController = new CastController(this.binds);
    this.start = 0;
    this.msPerPx = 10;
    this.container = document.createElement('div');
    this.container.classList.add('casts-container');
    this.container.style.width =
      Object.keys(this.binds.getAll()).length * 32 +
      'px';
    document.body.appendChild(this.container);
    this.skillBar = document.createElement('div');
    this.skillBar.classList.add('skill-bar');
    this.skillBar.style.width =
      Object.keys(this.binds.getAll()).length * 32 +
      'px';
    document.body.appendChild(this.skillBar);
    this.update = this.update.bind(this);
  }

  slotToColor(slot) {
    const hue = (slot * 32) % 360;
    let lightness = 50;
    if (slot === 7) {
      lightness = 60;
    }
    return `hsl(${hue},90%,${lightness}%)`;
  }

  async load() {
    await SkillData.load(this.bench.skills);
    console.log(this.bench);

    this.createTimeline();
    this.createSkillBar();
  }

  createTimeline() {
    let magWave = this.buffApplyCasts(SkillIds.MAGNETIC_WAVE);
    let primStance = this.buffApplyCasts(SkillIds.PRIMORDIAL_STANCE);
    let goep = this.buffApplyCasts(SkillIds.GLYPH_OF_ELEMENTAL_POWER_FIRE);
    let attunes = this.attunementSwapCasts();
    this.bench.casts = this.bench.casts.concat(magWave, primStance, goep,
                                               attunes);

    for (let cast of this.bench.casts) {
      let data = SkillData.get(cast.id);
      console.log(this.bench.skills[cast.id]);
      let label = cast.label || this.binds.get(this.bench.skills[cast.id]);
      if (data && data.slot) {
        let matches = data.slot.match(/(Weapon|Downed)_(\d)/);
        if (matches && matches.length > 0) {
          label = matches[2];
        }
      }
      if (!label) {
        console.warn('noooo', this.bench.skills[cast.id], cast);
      }
      let slot = this.binds.getSlot(label);
      let castText = document.createElement('div');
      castText.classList.add('cast-text');
      castText.textContent = label;

      let elt = document.createElement('div');
      elt.classList.add('cast');
      elt.appendChild(castText);
      elt.style.background = this.slotToColor(slot);
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

  createSkillBar() {
    const coveredBinds = {};
    for (let skill in this.binds.getAll()) {
      const bind = this.binds.get(skill);
      if (coveredBinds.hasOwnProperty(bind)) {
        continue;
      }
      coveredBinds[bind] = true;
      let slot = this.binds.getSlot(bind);
      let castText = document.createElement('div');
      castText.classList.add('cast-text');
      castText.textContent = bind;

      let elt = document.createElement('div');
      elt.classList.add('cast');
      elt.appendChild(castText);
      elt.style.background = this.slotToColor(slot);
      elt.style.width = '32px';
      elt.style.height = '24px';
      let slotX = slot * 32;
      let startY = 0;
      elt.style.transform = `translate(${slotX}px,${startY}px)`;
      this.skillBar.appendChild(elt);
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

  attunementSwapCasts() {
    let attunements = {};

    for (let skillId in this.bench.skills) {
      let skillName = this.bench.skills[skillId];
      if (skillName.includes('Attunement')) {
        attunements[skillId] = skillName;
      }
    }

    let casts = [];
    for (let skillId in attunements) {
      let pressedAttunement = attunements[skillId].split(' ')[1];
      let buffEvents = this.bench.buffs[skillId];
      for (let event of buffEvents) {
        if (!event.hasOwnProperty('Apply')) {
          continue;
        }
        casts.push({
          label: this.binds.get(pressedAttunement),
          start: event.Apply,
          end: event.Apply,
        });
      }
    }
    return casts;
  }

  buffApplyCasts(skillId) {
    let casts = [];
    let buffEvents = this.bench.buffs[skillId];

    for (let event of buffEvents) {
      if (!event.hasOwnProperty('Apply')) {
        continue;
      }
      let label = this.binds.get(this.bench.skills[skillId]);
      casts.push({
        label: label,
        start: event.Apply,
        end: event.Apply,
      });
    }
    return casts;
  }
}
