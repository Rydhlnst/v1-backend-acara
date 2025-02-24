import multer from "multer"


// File hanya lewat saja dan tidak menyimpan di harddisk
const storage = multer.memoryStorage();
const upload = multer({
    storage,
})


export default {
    single(fieldName: string) {
        return upload.single(fieldName) 
    },
    multiple(fieldName: string) {
        return upload.array(fieldName)
    }
}