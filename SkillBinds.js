export default class SkillBinds {
  constructor() {
    this.binds = {
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
      'Glyph of Elemental Power (Fire)': 'q',
      'Primordial Stance': 'e',
      'Signet of Fire': 'r',
      'Weave Self': 'b',
      Fire: '!',
      Water: '@',
      Air: '#',
      Earth: '$',
      'Magnetic Wave': '4',
    };

    let normalBinds = {
      'Glyph of Elemental Power (Fire)': '7',
      'Signet of Fire': '8',
      'Primordial Stance': '9',
      'Weave Self': '0',
      Fire: 'F1',
      Water: 'F2',
      Air: 'F3',
      Earth: 'F4',
    };

    if (window.useNormalBinds) {
      this.binds = Object.assign(this.binds, normalBinds);
    }
  }

  /**
   * Get the binding for a given skill
   * @param {String} skill
   * @return {String} key binding
   */
  get(skill) {
    return this.binds[skill];
  }

  /**
   * Get all known skill bindings
   * @return {Object} skill name -> key
   */
  getAll() {
    return this.binds;
  }

  /**
   * @return {number} the slot (index) of a keybind
   */
  getSlot(bind) {
    return Object.values(this.binds).indexOf(bind);
  }
}
