const fse = require("fs-extra")
const fs = require("fs")
const { LoremIpsum } = require("lorem-ipsum");

const log = (args) => {
    process.stdout.write(args)
}

const createFolderAndFiles = async () => {
    console.log(".....")
    try {
        log("creating folder")
        fse.ensureDir("./output/js01");
        log("generating data")
        const loremIpsum = new LoremIpsum()
        const data = loremIpsum.generateSentences(10);
        log("writing file")
        fs.writeFileSync("./output/js01/file01.txt", data);
        
        log("done")
    } catch (error) {
        console.log(error);
        process.stderr.write(error.message)
    }
    
}

createFolderAndFiles()