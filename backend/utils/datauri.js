import DataUriParser from "datauri/parser.js"

import path from "path";
//just sending a file as argument and it will retrun file back after making chages to it
const getDataUri = (file) => {
    if (!file) {
        throw new Error("File is missing from the request");
    }
    if (!file.buffer || !file.originalname) {
        throw new Error("File properties are missing");
    }
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

export default getDataUri;