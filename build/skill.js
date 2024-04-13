import fs from "fs"
const d = fs.readFileSync("./public/data/chars.json", "utf8")
const data = JSON.parse(d)
const skills = {}
data.forEach(char => {
    char.skills.forEach(skill => {
        skills[skill.prefabId] = char.name + "\t" + skill.prefabId + "\t" + skill.name
    })
})
fs.readFile("./public/data/skill_table.json", "utf8", (err, dataStr) => {
    // 过滤医疗
    const data = JSON.parse(dataStr)
    let str = ''
    Object.keys(data).forEach(key => {
        if (skills[key] == null) return
        const skill = data[key].levels.pop()
        if (skill.description === null) return
        if (skill.description?.indexOf("{") == -1 || skill.description?.indexOf("攻击") == -1 || skill.description?.indexOf("费用") > 0) return
        str += skills[key] + '\t' + skill.description + '\n'
        console.log(skills[key], skill.description)
    })
    fs.writeFileSync("./public/data/skill.txt", str)
})