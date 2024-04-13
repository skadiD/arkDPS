import fs from "fs"
// 这个表就拿个名字
fs.readFile("./public/data/uniequip_table.json", "utf8", async (err, dataStr) => {
    const data = JSON.parse(dataStr)
    const uniequip = data.equipDict // 模组 Obj
    const result = data.charEquip   // 干员为 key 的 Obj

    const equip = JSON.parse(fs.readFileSync("./public/data/battle_equip_table.json", "utf8"))
    const chars = JSON.parse(fs.readFileSync("./public/data/chars.json", "utf8"))

    // 主循环结构 将 "char": string[] 转换为 "char": {id: number, name: string, attrs: any[]}[]
    Object.keys(result).forEach(key => {
        if (chars.filter(char => char.id === key).length === 0) {
            console.log(key)
            return
        }
        const temp = []
        data.charEquip[key].forEach(id => { // 模组 id
            const attrs = []
            if (equip[id] !== undefined) {
                equip[id].phases.forEach(phases => { // 属性 id
                    const attr = {}
                    phases.attributeBlackboard.forEach(obj => attr[obj.key] = obj.value)
                    // 修正模组对天赋的影响
                    attr.rewrite = [] // 对应 parts 部分
                    phases.parts.forEach(part => {
                        if (!part.addOrOverrideTalentDataBundle.candidates && !part.overrideTraitDataBundle.candidates) return
                        attr.rewrite.push(execDataBundle(part.target, 
                            (part.target !== 'TRAIT' && part.target != "TRAIT_DATA_ONLY" && part.target != "DISPLAY") ? part.addOrOverrideTalentDataBundle.candidates :  
                            part.overrideTraitDataBundle.candidates))
                    })
                    attrs.push(attr)
                })
            }
            temp.push({
                id: id,
                name: uniequip[id].uniEquipName,
                attrs: attrs
            })
        })
        result[key] = temp
    })
    chars.forEach(char => {
        char["equip"] = result[char.id] || []
    })
    fs.writeFileSync("./public/data/chars.json", JSON.stringify(chars, null, 4), "utf8")
})

// 处理模组对特性天赋的修正
function execDataBundle(type, candidates) {
    const result = {}
    if (!candidates) {
        console.log(type, candidates)
        return
    }
    candidates = candidates.map(candidate => {
        const blackboard = {}
        candidate.blackboard.forEach(item => {
            blackboard[item.key] = item.value
        })
        return {
            up_desc: candidate.upgradeDescription,
            add_desc: candidate.additionalDescription,
            upgrade: candidate.requiredPotentialRank,
            blackboard
        }
    })
    type = type.indexOf("TALENT") === -1 ? "TRAIT" : "TALENT"
    result.type = type 
    result[type] = candidates
    return result
}