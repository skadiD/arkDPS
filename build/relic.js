import fs from "fs"
fs.readFile("./public/data/relics.json", "utf8", (err, dataStr) => {
    const data = JSON.parse(dataStr)
    const relics = {}
    Object.keys(data).forEach(key => {
        const name = data[key].name
        relics[name] = {
            name: name,
            description: data[key].description,
            usage: data[key].usage,
            iconId: data[key].iconId,
            value: data[key].value
        }
    })
    getCollection(relics)
    // console.log(relics)
})

function getCollection(relics) {
    fs.readFile("./public/data/collection.json", "utf8", (err, dataStr) => {
        const data = JSON.parse(dataStr)
        data.forEach(relic => {
            const name = relic.name
            // 考虑不同等级的收藏品 -阿尔法
            if (relics[name] === undefined) {
                console.log(name)
                return
            }
            relic["description"] = relics[name]["description"]
            relic["usage"] = relics[name]["usage"]
            relic["iconId"] = relics[name]["iconId"]
            relic["cost"] = relics[name]["value"]
        })

        console.log(JSON.stringify(data))
    })
}