import * as Minio from 'minio'

export default class MinioClient {
  constructor(config) {
    this.minio = new Minio.Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey
    })
  }

  listBuckets = () => {
    return new Promise((resolve, reject) => {
      this.minio.listBuckets((error, buckets) => {
        if (error) {
          reject(error)
        } else {
          resolve(buckets)
        }
      })
    })
  }

  makeBucket = (name = '', region = '') => {
    return new Promise((resolve, reject) => {
      this.minio.makeBucket(name, region, function (error) {
        if (error) {
          reject(error)
        } else {
          resolve(name)
        }
      })
    })
  }

  uploadFile = (bucket, fileName, filePath, contentType) => {
    return new Promise((resolve, reject) => {
      minioClient.fPutObject(bucket,
        fileName,
        filePath,
        { 'Content-Type': contentType },
        function (error, objInfo) {
          if (error) {
            reject(error)
          } else {
            resolve(objInfo)
          }
        }
      )
    })
  }

  uploadFileStream = (bucket, fileName, fileData, fileSize) => {
    return new Promise((resolve, reject) => {
      this.minio.putObject(bucket, fileName, fileData, fileSize, function (error, objInfo) {
        if (error) {
          reject(error)
        } else {
          resolve(objInfo)
        }
      })
    })
  }

  downloadFileStream = (bucket, fileName) => {
    return new Promise((resolve, reject) => {
      this.minio.getObject(bucket, fileName, function (error, dataStream) {
        if (error) {
          reject(error)
        } else {
          resolve(dataStream)
        }
      })
    })
  }
}