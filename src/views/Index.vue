<template>
  <div class="flex h-full">
    <div class="w-full flex-col max-w-4xl 2xl:max-w-6xl xl:mr-auto s-margin md:!flex space-y-4" 
      :class="show ? 'xl:ml-0 !hidden' : 'lg:ml-[calc((100vw-56rem)/2)] 2xl:ml-[calc((100vw-72rem)/2)]'">
      <div class="bg-base-300 shadow-lg rounded-lg px-4 py-1 blog relative">
        <div class="divider font-extrabold text-4xl text-info">基础参数填写 </div>
        <div class="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div class="s-combo">
            <Select #default="{ itemData }" :data="hard" :value="enemy.hard" @value-select="listenHard">
              <b>{{ itemData.name }}</b><br>
              <span class="text-white/50">{{ itemData?.desc }}</span>
            </Select>
            <label class="s-label peer-focus:text-info">「探索自然」难度</label>
          </div>
          <div class="s-combo">
            <input class="s-input peer focus:ring-info" placeholder="默认值为 0.23" v-model.number="buffs.default" />
            <label class="s-label peer-focus:text-info">「文化比较」局外加攻</label>
          </div>
          <div class="s-combo">
            <div class="join">
              <input v-for="(_, index) in 7" 
                class="join-item btn flex-1 checked:bg-info h-[40px] min-h-0 px-3" type="radio" name="level" 
                :aria-label="`${index+1}`" @click="enemy.floor = index+1" />
            </div>
            <label class="s-label peer-focus:text-info">选择层数</label>
          </div>
        </div>
        <div class="divider my-2 lg:mt-6 font-extrabold text-2xl text-info">干员选择</div>
        <div class="grid gap-4 grid-cols-1 lg:grid-cols-5">
          <div class="s-combo">
            <Select #default="{ itemData }" :show-search="true" :data="chars" :value="selectChar" @value-select="listenChar">
              <div class="flex gap-2 items-center">
                <div class="avatar">
                  <div class="w-10 rounded-full">
                    <img :src="`https://assets.ltsc.vip/avatar/ASSISTANT/${itemData.id}.png`" />
                  </div>
                </div>
                <div>
                  <p><b>{{ itemData.name }}</b></p>
                  <span class="text-white/50">{{'✩'.repeat(itemData?.rarity + 1)}}</span>
                </div>
              </div>
            </Select>
            <label class="s-label peer-focus:text-info">「干员」<span class="text-info">{{  }}</span></label>
          </div>
          <div class="s-combo">
            <div class="grid gap-2 grid-cols-2">
              <input type="number" max="2" min="0" v-model.number="data.levels[0]" class="s-input peer focus:ring-info" placeholder="(精英)2" />
              <input type="number" min="1" v-model.number="data.levels[1]" class="s-input peer focus:ring-info" placeholder="90(级)" />
            </div>
            <label class="s-label peer-focus:text-info">「等级」</label>
          </div> 
          <div class="s-combo lg:col-span-2">
            <Select #default="{ itemData }" :data="selectChar.potentialRanks" :value="data.rank" @value-select="listenRank">
              <b>潜能 {{ itemData.id+1 }}</b><br>
              <span class="text-white/50">{{ itemData?.name }}</span>
            </Select>
            <label class="s-label peer-focus:text-info">「潜能」</label>
          </div>
          <div class="s-combo">
            <input type="number" max="100" min="0" v-model.number="data.trust" class="s-input peer focus:ring-info" placeholder="默认值为 满信赖(100)" />
            <label class="s-label peer-focus:text-info">「信赖」</label>
          </div>
        </div>
        <div class="text-2xl font-bold mt-2">干员数值</div>
        <div class="grid gap-4 grid-cols-2 lg:grid-cols-3 mt-2">
          <div class="s-combo">
            <input type="number" min="0" class="s-input peer focus:ring-info" 
              v-model="data.atk" @blur="calcChar"/>
            <label class="s-label peer-focus:text-info">基础攻击<small class="text-success">{{ dreamStr }}</small></label>
          </div>
          <div class="s-combo">
            <Select #default="{ itemData }" :data="selectChar.skills" :value="data.skill" @value-select="listenSkill">
              <b>{{ itemData.name }}</b><br>
              <span class="text-white/50" v-html="formatSkillDesc(itemData)" />
            </Select>
            <label class="s-label peer-focus:text-info">技能选择</label>
          </div>
          <div class="col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
            <div class="s-combo">
              <Select #default="{ itemData }" :data="selectChar.equip" :value="data.equip" @value-select="listenEquip">
                <b>{{ itemData.name }}</b><br>
                <span class="text-white/50" v-if="itemData.attrs.length === 0">默认模组</span>
                <span class="text-white/50 mr-1" v-for="(_, index) in itemData.attrs">
                  Lv.{{ index + 1 }}: 字数太多，无法上榜</span>
              </Select>
              <label class="s-label peer-focus:text-info">模组选择</label>
            </div>
            <div class="s-combo">
              <div class="join">
                <input v-for="(_, index) in 3" 
                  class="join-item btn flex-1 checked:bg-info h-[40px] min-h-0" type="radio" name="phases" 
                  :aria-label="`${index+1}`" @click="data.equipLevel = index+1" />
              </div>
              <label class="s-label peer-focus:text-info">模组等级</label>
            </div>
          </div>
        </div>
        <div class="divider my-2 lg:mt-6 font-extrabold text-2xl text-info">藏品选择</div>
        <div class="s-combo mb-2">
          <Select :show-search="true" :data="relics" :value="data.relics" @value-select="listenRelic" class="flex-col-reverse">
            <template #label>
              <span v-if="data.relics.length === 0" class="my-1.5">请选择藏品</span>
              <div class="flex flex-wrap gap-2" :class="data.relics.length < 10 ? 'text-sm' : 'text-xs'">
                <span v-for="k in data.relics" class="bg-info/40 p-2 rounded-full">
                  {{ k?.name }} 
                  <span class="text-error font-extrabold" v-if="k?.count !== undefined">
                    +{{ Math.floor(k?.count * k?.value[0] * 100) }}%
                  </span>
                </span>
              </div>
            </template>
            <template #default="{ itemData, index }">
              <div class="flex gap-2 items-center">
                <div class="avatar">
                  <div class="w-10 rounded-full">
                    <img :src="`https://assets.ltsc.vip/rogueitem/${itemData.iconId}.png`" />
                  </div>
                </div>
                <div>
                  <p><b>{{ itemData.name }}</b></p>
                  <span class="text-white/50" v-html="itemData?.usage" />
                  <template class="block lg:hidden">
                    <div class="my-1 flex whitespace-nowrap items-center" v-if="itemData?.count !== undefined">
                      <span class="font-bold text-lg text-white/50">层数：</span>
                      <input type="number" class="s-input focus:ring-info text-sm" placeholder="请输入生效层数" @click.stop
                        v-model.number="itemData.count" @blur="checkVal(index)" :max="itemData.max_level" :min="0" />
                    </div>
                  </template>
                </div>
                <div class="flex-1" />
                <template class="hidden lg:block">
                  <div class="w-40 mr-8" v-if="itemData?.count !== undefined">
                    <input type="number" class="s-input peer focus:ring-info text-sm" placeholder="请输入生效层数" @click.stop
                      v-model.number="itemData.count" @blur="checkVal(index)" :max="itemData.max_level" :min="0" />
                  </div>
                </template>
              </div>
            </template>
          </Select>
          <label class="s-label">藏品查找</label>
        </div>
        <div class="s-combo mb-2">
          <div class="stats shadow bg-info/15 border-x-4 border-0 border-info">
            <div class="stat">
              <div class="stat-figure">
                <div class="avatar online">
                  <div class="w-16 rounded-full">
                    <img :src="`https://assets.ltsc.vip/avatar/ASSISTANT/${selectChar.id}.png`" />
                  </div>
                </div>
              </div>
              <div class="font-bold text-lg">总伤</div>
              <div class="font-bold text-4xl text-error">{{ formula.damage.result.toFixed(2) }}</div>
              <!-- <div class="stat-desc text-success font-bold">单次伤害：302</div> -->
            </div>
            <div class="stat">
              <div class="font-bold text-lg">面板伤害</div>
              <div class="stat-value text-primary">{{ formula.base_atk.result.toFixed(2) }}</div>
              <!-- <div class="stat-desc text-success text-wrap">计算过程：{{ formula.base_atk.full_result }}</div> -->
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
            </div>
            <div class="stat">
              <div class="font-bold text-lg">DPH</div>
              <div class="stat-value text-primary">{{ formula.dph.result.toFixed(2) }}</div>
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
            </div>
            <div class="stat">
              <div class="font-bold text-lg">DPS</div>
              <div class="stat-value text-primary">{{ formula.dps.result.toFixed(2) }}</div>
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
            </div>
          </div>
          <label class="s-label flex justify-between">
            加成面板
            <span class="flex items-center justify-between gap-2 text-info font-bold">
              显示运算过程
              <input type="checkbox" class="toggle toggle-sm" v-model="showDetail" />
            </span>
          </label>
        </div>
        <div v-if="showDetail" class="flex flex-col text-sm">
          <code>面板伤害：{{ formula.base_atk.full_result }}</code>
          <code>技能伤害：{{ formula.dph.full_result }}</code>
          <code>总伤：{{ formula.damage.full_result }}</code>
          <code>秒伤：{{ formula.dps.full_result }}</code>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4 mb-2">
          <button class="btn btn-info btn-block text-white" @click="show = !show">{{show ? '隐藏' : '显示'}}敌人面板</button>
          <button class="btn btn-success btn-block text-white" @click="calcBuff">开算</button>
          <label class="btn col-span-2 btn-warning" for="tools">可用参数一览</label>
        </div>
      </div>
    </div>
    <div class="bg-base-300 flex-1 flex flex-col md:ml-8 max-w-2xl p-4 shadow-lg rounded-lg items-center animate__animated" v-if="show" :class="show ? 'animate__fadeInRight' : 'animate__fadeOutRight'">
      <div class="divider font-extrabold text-2xl text-info">敌人选择</div>
      <div class="w-full space-y-2">
        <div class="s-combo">
          <Select #default="{ itemData }" :show-search="true" :data="enemies" :value="enemy.select" 
            @value-select="listenEnemy">
            <div class="flex gap-2 items-center">
              <div class="avatar">
                <div class="w-10 rounded-full">
                  <img :src="`https://assets.ltsc.vip/enemy/${itemData.id}.png`" />
                </div>
              </div>
              <div class="flex-1 pr-5">
                <div class="w-full flex items-center justify-between">
                  <b>
                    <small class="p-0.5" :class="itemData.level === 'BOSS' ? 'bg-error/50' : 'bg-success/50'">
                      {{ itemData.level === "BOSS" ? '领袖' : '精英'}}
                    </small> 
                    {{ itemData.name }}
                  </b>
                  <div>
                    <span class="mx-1 text-white/60 px-1 py-0.5 bg-info/40" v-for="(_, k) in itemData.attrs">
                      等级{{ k }}
                    </span>
                  </div>
                </div>
                <small class="space-x-1">
                  <span class="text-success">HP:{{ itemData.attrs[0].maxHp }}</span>
                  <span class="text-warning">DEF:{{ itemData.attrs[0].def }}</span>
                  <span class="text-error">ATK:{{ itemData.attrs[0].atk }}</span>
                </small>
              </div>
            </div>
          </Select>
          <label class="s-label">选择敌人</label>
        </div>
        <div class="s-combo" v-if="enemy.select.attrs?.length > 1">
          <div class="join">
            <input v-for="(_, index) in enemy.select.attrs" class="join-item btn flex-1" :class="{'bg-info': enemy.level == index}" 
              type="radio" name="level2" :aria-label="`等级${index}`" @click="enemy.level = index"/>
          </div>
          <label class="s-label">敌人等级</label>
        </div>
        <div class="s-combo">
          <div class="flex items-center justify-between p-4 border-l-8 border-warning bg-info/15">
            <span>血量 {{ calcAttr('maxHp') }}</span>
            <span>防御 {{ calcAttr('def') }}</span>
            <span>攻击 {{ calcAttr('atk') }}</span>
            <span>法抗 {{ calcAttr('magicResistance') }}</span>
          </div>
          <label class="s-label">属性面板</label>
        </div>
      </div>
      <div class="divider mb-2 font-extrabold text-info">调试器</div>
      <div class="w-full flex-wrap">
        <div class="s-combo">
          <textarea class="s-input peer focus:ring-info text-sm" 
            placeholder="{base.atk} * (1 + ({up_atk} + {%default} + {%talent.e_1.atk}) / 100)" 
            v-model="formula.base_atk.origin" />
          <label class="s-label peer-focus:text-info">面板攻击力公式</label>
        </div>
        <code class="text-info text-sm">计算过程：{{ formula.base_atk.full_result }}</code>
        <div class="s-combo">
          <textarea class="s-input peer focus:ring-info text-sm" 
            placeholder="{base.atk} * (1 + ({up_atk} + {%default} + {%talent.e_1.atk} + {%skill.atk}) / 100)" 
            v-model="formula.dph.origin" />
          <label class="s-label peer-focus:text-info">DPH公式</label>
        </div>
        <code class="text-info text-sm">计算过程：{{ formula.dph.full_result }}</code>
        <div class="s-combo">
          <textarea class="s-input peer focus:ring-info text-sm" 
            placeholder="{base.atk} * (1 + ({up_atk} + {%default} + {%talent.e_1.atk} + {%skill.atk}) / 100)" 
            v-model="formula.damage.origin" />
          <label class="s-label peer-focus:text-info">总伤公式</label>
        </div>
        <code class="text-info text-sm">计算过程：{{ formula.damage.full_result }}</code>
        <div class="s-combo">
          <textarea class="s-input peer focus:ring-info text-sm"
            v-model="formula.dps.origin" />
          <label class="s-label peer-focus:text-info">DPS公式</label>
        </div>
        <code class="text-info text-sm">计算过程：{{ formula.dps.full_result }}</code>
      </div>
      <button class="btn btn-info  w-full mt-8" @click="show = !show"><-返回</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, watch, computed } from "vue";
  import { calc2str } from "../plugins/ast";
  import "animate.css";
  import Select from "../components/select.vue";
  import { getChars, getCollection, getEnemies } from "../plugins/axios.ts"
  import { hard, buffMap, professionMap } from "./var"
  import { params } from "../components/layout/globals"
  import { setMsg } from "../plugins/common";
  import { Type } from "../components/toast/enmu";

  const show = ref(false)
  const showDetail = ref(false)
  const dreamStr = ref('') 
  
  const data = ref({
    levels: [2, 90],                // 等级
    rank: {} as any,                // 潜能
    skill: {} as Gamedata.Skill,    // 技能
    relics: [] as Gamedata.Relic[], // 藏品
    equip: {} as Gamedata.Equip,    // 模组
    equipLevel: 1,                  // 模组等级
    trust: 100,                     // 信赖
    atk: 0,                         // 攻击力
    baseAttackTime: 0,              // 攻击间隔
    // data: {} as Gamedata.Character  // 干员数据
  })
  const enemy = ref({
    hard: {} as Gamedata.Difficulty,
    select: {} as Gamedata.Enemy,
    level: 0,
    floor: 0
  })
  const buffs = ref<Gamedata.Buff>({
    default: 0.23,
  })

  // 公式
  const formula = ref({
    base_atk: { // 面板攻击
      origin: '{base_atk} * (1 + ({%up_atk} + {%default} + {%talent.e_1.atk}) / 100)',
      result: 0,
      full_result: ''
    },
    dph: { // DPH
      origin: '{base_atk} * (1 + ({%up_atk} + {%default} + {%talent.e_1.atk} + {%skill.atk} + {%up_atk_mul} )  / 100) * {skill.atk_scale} * (1 + {up_damage})',
      result: 0,
      full_result: ''
    },
    damage: { // 总伤 = 面板攻击 * 攻击次数(考虑抬手向下取整)
      origin: `{dph} * ({duration} % ({baseAttackTime} / ((100 + {skill.attack_speed} + {up_speed}) / 100)))`,
      result: 0,
      full_result: ''
    },
    dps: {
      origin: `{damage} / {duration}`,
      result: 0,
      full_result: ''
    }
  })

  const selectChar = ref<Gamedata.Character>({} as Gamedata.Character)
  const listenHard = (val: any) => {
    enemy.value.hard = val
    // 修正难度对藏品属性的影响
    // 截止到萨米版本，难度只会影响一个属性
    const ranges = [2, 5, 8, 15];
    const index = ranges.findIndex(range => val.id <= range);
    relics.value.forEach((relic: Gamedata.Relic) => {
      // alert(relic.value[0]?.length)
      if (relic.value[0]?.length === 4) {
        relic.usage = relic.usage?.replace(/<.*>/g, '')
        relic.usage += `<span class='text-warning ml-2'>[N${val.id}变化：+${relic.value[0][index]}]</span>`
      }
    })
  }
  const lock = ref(false)
  const listenChar = (val: any) => {
    lock.value = true
    data.value.rank = {id: 0, name: "请选择潜能", key: '', value: 0}
    data.value.levels = [2, 90]
    data.value.atk = val.val[`e${data.value.levels[0]}`][1].data.atk
    data.value.equip = {} as Gamedata.Equip
    data.value.equipLevel = 1
    data.value.baseAttackTime = val.val[`e${data.value.levels[0]}`][0].data.baseAttackTime
    selectChar.value = val
    listenSkill(val.skills[2])
    lock.value = false
  }
  const listenRank = (val: any) => {
    data.value.rank = val
    calcChar()
    calcBuff()
  }
  const listenSkill = (val: any) => {
    data.value.skill = val
    calcChar()
    calcBuff()
  }
  const listenEnemy = (val: any) => {
    enemy.value.level = 0
    enemy.value.select = val
  }
  const listenEquip = (val: any) => data.value.equip = val
  const listenRelic = (val: any) => {
    val.name = val.name.replace(/【未生效】/g, '')
    if (data.value.relics.includes(val)) {
      data.value.relics = data.value.relics.filter((item: any) => item.id !== val.id)
    } else {
      data.value.relics.push(val)
    }
    calcBuff()
  }
  const calcChar = () => {
    dreamStr.value = ''
    if (data.value.levels[0] > 2 || data.value.levels[0] < 0) data.value.levels[0] = 2
    if (data.value.levels[0] == 0 && (data.value.levels[1] > 50 || data.value.levels[1] < 1)) data.value.levels[1] = 50 
    if (data.value.levels[0] == 1 && (data.value.levels[1] > 80 || data.value.levels[1] < 1)) data.value.levels[1] = 80
    if (data.value.levels[0] == 2 && (data.value.levels[1] > 90 || data.value.levels[1] < 1)) data.value.levels[1] = 90
    // @ts-ignore
    const el = selectChar.value.val[`e${data.value.levels[0]}`]
    // atk 计算公式：最低等级数值<el[0].data.atk> + (当前等级<val.levels[1]> - 最低等级<el[0].level>) * (最高等级数值<el[1].data.atk> - 最低等级数值<el[0].data.atk>) / (最高等级<el[1].level> - 最低等级<el[0].level>)
    let atk = el[0].data.atk + (data.value.levels[1] - el[0].level) * (el[1].data.atk - el[0].data.atk) / (el[1].level - el[0].level)
    atk = Math.round(atk)
    // 信赖加成: 基础加成 * 信赖 / 50
    if (selectChar.value.favor?.atk) {
      const delta = Math.round(selectChar.value.favor.atk / 50 * Math.floor(data.value.trust / 2))
      dreamStr.value += `(+信赖${delta})`
      atk += delta
    }
    // 潜能加成 = 潜能等级对应的加成值
    selectChar.value.potentialRanks.forEach((rank: any) => {
      // 判断当前rank向下的key中是否有atk
      if (rank.key == 'atk' && rank.id <= data.value.rank.id) {
        dreamStr.value += `(+潜能${rank.value})`
        atk += rank.value
      }
    })
    // 模组白值加成
    if (data.value.equip.id) {
      const delta = data.value.equip?.attrs[data.value.equipLevel - 1]
      if (delta?.atk !== undefined) {
        dreamStr.value += `(+模组${delta?.atk})`
        atk += delta?.atk
      }
    }
    data.value.atk = atk
  }
  const watchData = computed(() => {
    return {
      level1: data.value.levels[0],
      level2: data.value.levels[1],
      trust: data.value.trust,
    }
  })
  watch(watchData, (val, old) => {
    if (val.level1 !== old.level1 || val.level2 !== old.level2 || val.trust !== old.trust) {
      alert('update')
      calcChar()
      calcBuff()
    }
  })
  const chars = ref([])

  const relics = ref<Gamedata.Relic[]>([])
  const enemies = ref<Gamedata.Enemy[]>([])
  onMounted(() => {
    getChars().then((res: any) => {
      chars.value = res
      listenChar(res.find((item: any) => item.name === '斯卡蒂'))
    })
    getCollection().then((res: any) => {
      relics.value = res
      listenHard(hard[0])
    })
    getEnemies().then((res: any) => {
      enemies.value = res
    })
  })
  
  const formatSkillDesc = (skill: Gamedata.Skill) => {
    const get = (key: string) => skill.blackboard?.[key] || 0
    skill.description = skill.description.replace(
      /\{([^{}:]+)(:0%)?}/g,
      (_, p1, p2) => `${p2 ? Math.round(get(p1) * 100) + '%' : get(p1)}`
    );
    return skill.description.
      replace(/\\n/g, '<br>').
      replace(/<[@$][^>]+>/g, '<b class=text-info>').
      replace(/<\/>/g, '</b>')
  }

  const calcAttr = (attr: string) => {
    const difficulty = (attr === 'def' || attr === 'magicResistance') ? 0 : enemy.value.hard.difficulty || 0
    const attrMap: any = {
      'maxHp': 'down_hp_mul',
      'def': 'down_def',
      'magicResistance': 'ign_res'
    }
    const define: any = enemy.value.hard?.attrs?.elite && enemy.value.select.level === 'ELITE' ?
      enemy.value.hard.attrs.elite : enemy.value.hard?.attrs?.boss && enemy.value.select.level === 'BOSS' ?
      enemy.value.hard.attrs.boss : {atk: 0, maxHp: 0, def: 0, res: 0}
    let val = 0;
    for (let i = enemy.value.level; i >= 0; i--) {
      if (enemy.value.select.attrs?.[i][attr]) {
        val = enemy.value.select.attrs[i][attr]
        break
      }
    }
    return (val * (1 + (define[attr] || 0) / 100) * 
      (1 + difficulty / 100) ** enemy.value.floor * (1 - (buffs.value[attrMap[attr]] || 0))).toFixed(2)
  }
  // 计算天赋技能藏品的 BUFF 提升
  const calcBuff = () => {
    setMsg('计算中...电脑端可按下F12检查计算过程', Type.Warning)
    buffs.value = { 
      default: buffs.value.default,
      dph: 0,        // 技能攻击力
      up_atk: 0,     // 攻击力增加
      up_atk_mul: 0, // 攻击力提升倍率
      up_damage: 0,  // 物法提升倍率
    }

    // 计算天赋效果
    let talent: any = {}
    let talent_used = [false, false]
    // 模组的覆盖效果
    if (data.value.equip.attrs?.length) {
      const attr = data.value.equip?.attrs[data.value.equipLevel - 1]
      console.log('get equip attrs', attr)
      attr.rewrite.forEach((row: any) => {
        if (row.type !== 'TALENT') return
        talent_used[Number(row.prefabKey)-1] = true
        const temp = row.TALENT.filter((item: any) => item.upgrade <= data.value.rank.id).pop()
        talent[`e_${row.prefabKey}`] = temp.blackboard
      });
    }
    for (let i = 1; i <= 2; i++) {
      if (talent_used[i-1]) continue
      let key = `e${data.value.levels[0]}_${i}`
      if (!selectChar.value.talents[key]?.value) continue
      const ranks = Object.keys(selectChar.value.talents[key].value).map(Number)
      ranks.sort((a, b) => b - a);
      // 比较 ranks 中的 key 值和当前 rank 的最接近的一个
      ranks.some(rank => {
        if (Number(rank) <= data.value.rank.id) {
          console.log(data.value.rank.id, 'use rank:', rank, selectChar.value.talents[key].value[rank])
          talent[`e_${i}`] = selectChar.value.talents[key].value[rank]
          return true
        }
        return false
      })
    }

    // 计算特性效果
    let trait: any = {}
    // let trait_used = false // 可能需要调整
    let n = data.value.levels[0];
    let key = `e${n}`;
    while (!Object.keys(trait).length && n >= 0) {
      trait = selectChar.value.trait[key]?.value || {};
      n -= 1; // 每次循环n减1
      key = `e${Math.max(n, 0)}`; // 更新key
    }
    console.log('trait', trait)
    // 计算藏品效果
    let hasToken = false
    for (let key in selectChar.value.talents) {
      if (selectChar.value.talents[key]?.token) {
        hasToken = true
        break
      }
    }
    data.value.relics.forEach((relic: Gamedata.Relic) => { 
      // 判断是否是职业专属 (正则提取所有【*】干员)
      // fix: 萨米肉鸽排除坍缩体
      relic.name = relic.name.replace(/【未生效】/g, '')
      const profession = relic.usage?.match(/【(.*)】/)
      if (profession && ((profession[1] === '召唤物' && (!hasToken && !data.value.skill?.hasToken)) || 
         (profession[1] !== '召唤物' && profession[1] !== "坍缩体" && professionMap[profession[1]] !== selectChar.value.profession) ||
         (profession[1] == "坍缩体" && !enemy.value.select.tag?.includes("collapsal")))) {
        relic.name += '【未生效】'
        return
      }
      // 近战远程判断
      const position = relic.usage?.match(/(近战|远程)单位/)
      const positionMap: any = { '近战': 'MELEE', '远程': 'RANGED' }
      console.log('position', position, selectChar.value.position)
      if (position && positionMap[position[1]] !== selectChar.value.position) {
        relic.name += '【未生效】'
        return
      }
      const ranges = [2, 5, 8, 15];
      const Index = ranges.findIndex(range => enemy.value.hard.id <= range);
      let val = 0
      relic.type.forEach((type, index: any) => { // type value 两个数组对应
        // 判断是否有count属性
        if (relic?.count != undefined) {
          val = Math.floor(relic.value[index] * 100) * relic.count / 100
        } else {
          if (relic.value[index]?.length === 4) {  // 对应4种难度的增幅
            val = relic.value[index][Index]
          } else {
            // value 多数值情况 现在取最大值
            val = relic.value[index]?.length > 1 ? Math.max(...relic.value[index]) : relic.value[index]
          }
        }
        if (buffs.value[buffMap[type]] === undefined) buffs.value[buffMap[type]] = 0
        buffs.value[buffMap[type]] = Math.round(buffs.value[buffMap[type]] * 100 + val * 100) / 100
      })
    })
    // console.log(talent)
    // 面板伤害（局外伤害）= atk * (1 + 攻击力增加 up_atk / 100)
    // buffs.value.base_atk = `${data.value.atk} * (1 + (${buffs.value?.up_atk} + ${Math.round(buffs.value?.default * 100)}) / 100)`
    if (data.value.skill.duration === -1) data.value.skill.duration = 180
    params.value = { 
      ...buffs.value,
      base_atk: data.value.atk,
      duration: data.value.skill.duration, 
      talent,
      trait,
      baseAttackTime: data.value.baseAttackTime,
      skill: data.value.skill.blackboard,
      dph: 0,
      damage: 0
    }
    const result = calc2str(formula.value.base_atk.origin, params.value)
    formula.value.base_atk.result = result[0]
    formula.value.base_atk.full_result = result[1]

    // dph = atk * (1 + 攻击力增加 up_atk / 100) * (1 + 攻击力提升 up_atk_mul / 100)
    const dph = calc2str(formula.value.dph.origin, params.value)
    formula.value.dph.result = params.value.dph = dph[0]
    formula.value.dph.full_result = dph[1]
    // 总伤 = dph * (duration % baseAttackTime) 【正常情况是向下取整】
    const damage = calc2str(formula.value.damage.origin, params.value)
    formula.value.damage.result = params.value.damage = damage[0]
    formula.value.damage.full_result = damage[1]

    // 每秒伤害 = 总伤 / 技能时间 ()
    const dps = calc2str(formula.value.dps.origin, params.value)
    formula.value.dps.result = buffs.value.dps = dps[0]
    formula.value.dps.full_result = dps[1]
  }
  const checkVal = (index: number) => {
    const count = relics.value[index]?.count
    if (relics.value[index] && count !== undefined) {
      relics.value[index].count = count <= relics.value[index].max_level ? count : relics.value[index].max_level
    }
  }
</script>