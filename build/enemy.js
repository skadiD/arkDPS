import fs from "fs"
import axios from "axios"
const enemies = {}
const rougeEnemies = {}
fs.readFile("./public/data/enemy_database.json", "utf8", async (err, dataStr) => {
    const data = JSON.parse(dataStr)
    data.enemies.forEach(key => {
        if (Number(key.Key.split("_")[1]) > 3000) return
        const enemy = {
            id: key.Key,
            name: key.Value[0].enemyData.name.m_value,
            attrs: [],
            level: key.Value[0].enemyData.levelType.m_value,
            tag: key.Value[0].enemyData.enemyTags.m_value
        }
        // 处理不同等级的敌人
        key.Value.forEach(value => {
            const temp = {}
            Object.keys(value.enemyData.attributes).forEach(name => {
                if (value.enemyData.attributes[name].m_defined == true) {
                    temp[name] = value.enemyData.attributes[name].m_value
                }
            })
            enemy.attrs.push(temp)
        })
        enemies[key.Key] = enemy
    })
    await getRougeLevels()
    setTimeout(() => {
        // obj 转 array
        const enemiesArr = []
        Object.keys(rougeEnemies).forEach(key => {
            if (rougeEnemies[key] === undefined) return
            enemiesArr.push(rougeEnemies[key])
        })
        fs.writeFile("./public/data/enemies.json", JSON.stringify(enemiesArr), "utf8", () => {
            console.log("enemies.json has been created")
        })
    }, 15 * 1000);
})
async function getRougeLevels() {
    const data = await axios.get("https://assets.ltsc.vip/gamedata/excel/roguelike_topic_table.json")
    rougeEnemies['enemy_2002_bearmi'] = enemies['enemy_2002_bearmi']
    rougeEnemies['enemy_2001_duckmi'] = enemies['enemy_2001_duckmi']
    rougeEnemies['enemy_2034_sythef'] = enemies['enemy_2034_sythef']
    Object.keys(data.data.details.rogue_3.stages).forEach(async key => {
        const stage = data.data.details.rogue_3.stages[key]
        if (stage.isBoss !== 1) return
        // let levelName = levelName.difficulty === "NORMAL" ? '' : '紧急'
        let levelName = stage.name
        let levelId = stage.levelId.split("/").pop()
        console.log(key, levelName, levelId)
        getMapEnemy(levelId)
    })
}
async function getMapEnemy(name) {
    let data = await axios.get(`https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/levels/obt/roguelike/ro3/${name}.json`)
    Object.keys(data.data.enemyDbRefs).forEach(key => {
        // 鉴定数值被覆盖
        if (data.data.enemyDbRefs[key].overwrittenData === null) {
            key = data.data.enemyDbRefs[key].id
            if (rougeEnemies[key] !== undefined || enemies[key].level != 'BOSS') return // 已记录敌人
            // if (rougeEnemies[key] !== undefined || enemies[key].level == 'NORMAL') return // 已记录敌人
            rougeEnemies[key] = enemies[key]
            return
        }
        const id = data.data.enemyDbRefs[key].id
        if (enemies[id] === undefined) {
            rougeEnemies[id] = {
                id: id,
                name: data.data.enemyDbRefs[key].overwrittenData.name.m_value,
                attrs: [{}],
                level: data.data.enemyDbRefs[key].overwrittenData.levelType.m_value,
                tag: data.data.enemyDbRefs[key].overwrittenData.enemyTags?.m_value
            }
        } else {
            rougeEnemies[id] = enemies[id] // 先拷贝后覆盖
        }
        if (rougeEnemies[id].level === 'NORMAL') {
            delete rougeEnemies[id]
            return
        }
        Object.keys(data.data.enemyDbRefs[key].overwrittenData.attributes).forEach(attr => {
            if (data.data.enemyDbRefs[key].overwrittenData.attributes[attr].m_defined == true) {
                rougeEnemies[id].attrs[data.data.enemyDbRefs[key].level][attr] = data.data.enemyDbRefs[key].overwrittenData.attributes[attr].m_value
            }
        })
    })
    // console.log(rougeEnemies)
}