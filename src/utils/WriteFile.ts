import fs from "fs";

const WriteFile = async (dirname: string, name: string, data: any) => {

    try {
        fs.writeFile(dirname + name, Buffer.from(data), function (err) {
            if (err) {
                console.log("There was an error writing the image" + err)
            }
            else {
                console.log("The sheel file was written")
            }
        });
        return { result: true };
    } catch (err) {
        return { error: err };
    }
}

export default WriteFile;