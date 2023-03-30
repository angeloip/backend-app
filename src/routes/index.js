const { Router } = require("express");
const { readdirSync } = require("fs")

const pathRouter = `${__dirname}`
const router = Router();

const clearFileName = (fileName) => {
    const file = fileName.split(".").shift()
    return file
}

readdirSync(pathRouter).filter((fileName) => {
    const clearName = clearFileName(fileName)
    if(clearName !== "index"){
       router.use(`/api/${clearName}`, require(`./${clearName}`))
    }
})

router.all("*", (req, res, ) => {
    res.status(404).json({msg: "Not found"})
})

module.exports = router