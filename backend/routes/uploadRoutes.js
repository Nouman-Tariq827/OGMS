import path from 'path'
import fs from 'fs'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const rootDir = path.resolve()
    // If we're already in the backend folder, don't add it again
    const uploadDir = rootDir.endsWith('backend') 
      ? path.join(rootDir, 'uploads') 
      : path.join(rootDir, 'backend', 'uploads')
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})


function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.post('/', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ message: `Multer Error: ${err.message}` })
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err })
    }

    // Everything went fine.
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    res.send(`/uploads/${req.file.filename}`)
  })
})

export default router
