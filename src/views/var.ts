// 其他常量
const hard: Gamedata.Difficulty[] = [
  {name: "挑战自然·15", id: 15, desc: '所有敌人的攻击力、防御力、生命值+10%', difficulty: 16, attrs: {
    boss: {atk: 25, maxHp: 20, def: 25, res: 15},
    elite: {atk: 35, maxHp: 20, def: 25, res: 10}
  }},
  {name: "挑战自然·14", id: 14, desc: '所有敌人的防御力+5%，生命值+5%', difficulty: 14, attrs: {
    boss: {atk: 15, maxHp: 10, def: 15, res: 15},
    elite: {atk: 25, maxHp: 10, def: 15, res: 10}
  }}, 
  {name: "挑战自然·13", id: 13, desc: '精英和领袖敌人受到的物理和法术伤害-5%', difficulty: 12, attrs: {
    boss: {atk: 15, maxHp: 5, def: 10, res: 15},
    elite: {atk: 25, maxHp: 5, def: 10, res: 10}
  }},
  {name: "挑战自然·12", id: 12, desc: '进入第一、三、五层时抗干扰指数-1', difficulty: 10, attrs: {
    boss: {atk: 15, maxHp: 5, def: 10, res: 10},
    elite: {atk: 25, maxHp: 5, def: 10, res: 5}
  }},
  {name: "挑战自然·11", id: 11, desc: '领袖敌人受到的物理和法术伤害-5%', difficulty: 8, attrs: {
    boss: {atk: 15, maxHp: 5, def: 10, res: 10},
    elite: {atk: 25, maxHp: 5, def: 10, res: 5}
  }},
  {name: "挑战自然·10", id: 10, desc: '所有敌人的攻击力+10%', difficulty: 6, attrs: {
    boss: {atk: 15, maxHp: 5, def: 10, res: 5},
    elite: {atk: 25, maxHp: 5, def: 10, res: 5}
  }},
  {name: "挑战自然·9", id: 9, desc: '可同时部署人数-1', difficulty: 5, attrs: {
    boss: {atk: 5, maxHp: 5, def: 10, res: 5},
    elite: {atk: 15, maxHp: 5, def: 10, res: 5}
  }},
  {name: "挑战自然·8", id: 8, desc: '所有敌人受到的物理和法术伤害-5%', difficulty: 4, attrs: {
    boss: {atk: 5, maxHp: 5, def: 10, res: 5},
    elite: {atk: 15, maxHp: 5, def: 10, res: 5}
  }},
  {name: "挑战自然·7", id: 7, desc: '所有敌人的防御力+10%', difficulty: 3, attrs: {
    boss: {atk: 5, maxHp: 5, def: 10},
    elite: {atk: 15, maxHp: 5, def: 10}
  }},
  {name: "挑战自然·6", id: 6, desc: '招募4星及以上干员时希望消耗+1', difficulty: 2, attrs: {
    boss: {atk: 5, maxHp: 5},
    elite: {atk: 15, maxHp: 5}
  }},
  {name: "挑战自然·5", id: 5, desc: '所有敌人的攻击力+5%，生命值+5%', difficulty: 1, attrs: {
    boss: {atk: 5, maxHp: 5},
    elite: {atk: 15, maxHp: 5}
  }},
  {name: "挑战自然·4", id: 4, desc: '精英敌人的攻击力+10%', attrs: {
    elite: {atk: 10}
  }},
  {name: "挑战自然·3", id: 3, desc: '非完美作战额外增加1点坍缩值'},
  {name: "挑战自然·2", id: 2, desc: '初始生命上限-4'},
  {name: "挑战自然·1", id: 1, desc: '初始目标生命上限较高，坍缩范式加深较为缓慢'},
]
const buffMap: any = {
  1: 'up_speed',      // 攻速
  2: 'up_atk',        // 攻击力增加 与幕后筹备加算
  3: 'up_atk_mul',    // 攻击力提升 岩角号、罐头、战吼、诸王，内部加算，和干员的加攻加算，在up_atk后乘算
  4: 'up_damage',     // 物理伤害伤害提升倍率，内部加算，跟伤害乘算
  5: 'up_damage_mag', // 法术伤害伤害提升倍率，内部加算，跟伤害乘算
  6: 'down_def',      // 百分比减防御
  7: 'down_res',      // 百分比减法抗  暂无，占坑ing
  8: 'down_hp_mul',   // 百分比减血
  9: 'ign_def',       // 无视防御 只有百分比
  10: 'ign_res',      // 无视法抗 目前只有百分比
  100: 'default'      // 幕后筹备
}
const professionMap: any = {
  '先锋': 'PIONEER',
  '近卫': 'WARRIOR',
  '狙击': 'SNIPER',
  '医疗': 'MEDIC',
  '重装': 'TANK',
  '辅助': 'SUPPORT',
  '术师': 'CASTER',
  '特种': 'SPECIAL',
}
export { hard, buffMap, professionMap }