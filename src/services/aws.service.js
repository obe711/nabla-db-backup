// const AWS = require('aws-sdk');

const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3, GetObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/config');


const s3 = new S3({ region: config.aws.region });

/**
 * Download a stream from AWS bucket
 * @param {string} fileKey
 * @param {string} bucket
 * @returns {Stream}
 */
const downloadStream = (fileKey, bucket) => {
  return s3
    .getObject({
      Bucket: bucket,
      Key: fileKey,
    })
    .createReadStream();
};

/**
 * Upload a file buffer stream to AWS bucket
 * @param {string} fileName
 * @param {Buffer} file
 * @param {string} bucket
 * @returns {Promise}
 */
const uploadStream = async (fileName, file, bucket) => {
  return new Upload({
    client: s3,

    params: {
      Bucket: bucket,
      Key: fileName,
      Body: file,
    },
  }).done();
};

/**
 * Compress file buffer to gzip then upload to AWS bucket
 * @param {string} fileName
 * @param {Buffer} file
 * @param {string} bucket
 * @returns {Promise}
 */
// const uploadAndCompressStream = async (fileName, file, bucket) => {
//   const result = await pipeline(file, zlib.createGzip(), (compressed) =>
//     s3
//       .upload({
//         Bucket: bucket,
//         Key: fileName,
//         Body: compressed,
//       })
//       .promise()
//   );

//   const objectData = await s3
//     .headObject({
//       Bucket: bucket,
//       Key: result.Key,
//     })
//     .promise();

//   return {
//     ...result,
//     size: objectData.ContentLength,
//   };
// };

/**
 * List objects in AWS bucket
 * @returns {Promise}
 */
const listAllObjects = () => {
  return s3
    .listObjects({
      Bucket: config.aws.ota_bucket,
    })
    .promise();
};

const getFirmwareDownloadLink = (fileName) => {
  const command = new GetObjectCommand({ Bucket: config.aws.backup_bucket, Expires: 3000, Key: fileName });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

module.exports = {
  s3,
  downloadStream,
  uploadStream,
  getFirmwareDownloadLink,
  listAllObjects,
};