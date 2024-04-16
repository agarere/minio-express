import express from 'express'
import multer from 'multer'
import MinioClient from './lib/minio/MinioClient.js'
import 'dotenv/config'
import * as fs from 'fs'

const app = express();
const port = 3000;

const minioClient = new MinioClient({
  endPoint: process.env.ENDPOINT,
  port: Number(process.env.PORT),
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const metaData = {
    'Content-Type': file.mimetype,
  };

  minioClient.uploadFileStream('mybucket', file.originalname, file.buffer, metaData)
    .then(objInfo => {
      console.log("Uploaded File objInfo: ", objInfo)
      res.json({ message: 'File uploaded successfully' });
    })
    .catch(error => {
      console.log("There is something wrong, Error: ", error)
      res.status(500).json({ message: 'There is something wrong', error })
    })
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;

  minioClient.downloadFileStream('mybucket', filename)
    .then(dataStream => {
      dataStream.pipe(res)
    })
    .catch(error => {
      console.log("There is something wrong, Error: ", error)
      res.status(404).json({ message: 'The file could not find', error });
    })
});

app.listen(port, () => {
  console.log(`Express server running on ${port}`);
});
