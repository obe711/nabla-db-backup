// const AWS = require('aws-sdk');

const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const config = require('../config/config');



const s3 = new S3(config.s3.config);

/**
 * Download a stream from AWS bucket
 * @param {string} fileKey
 * @param {string} bucket
 * @returns {Stream}
 */
const downloadStream = (fileKey, bucket) => {
  const params = {
    Bucket: bucket,
    Key: fileKey,
  };
  const command = new GetObjectCommand(params);
  return s3.send(command);
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
 * List objects in AWS bucket
 * @returns {Promise}
 */
const listAllObjects = (bucketName) => {
  return s3
    .listObjects({
      Bucket: bucketName,
    })
};

const getFirmwareDownloadLink = (bucket, fileName) => {
  const command = new GetObjectCommand({ Bucket: bucket, Expires: 3000, Key: fileName });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

/**
 * Lists the folders and files in an S3 bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the folders and files.
 */
async function getFoldersAndFilesList(bucketName, prefix = "", delimiter = "/") {
  const params = {
    Bucket: bucketName,
    Delimiter: delimiter, // Important for differentiating folders (prefixes)
    Prefix: prefix // Specify the folder path here
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));
    console.log(data);
    const folders = data?.CommonPrefixes?.map(prefix => prefix.Prefix);
    const files = data?.Contents?.map(content => content.Key);


    return {
      folders,
      files
    };
  } catch (error) {
    console.error("Error listing folders and files:", error);
    throw error;
  }
}


async function getFileList(bucketName, prefix = "") {
  const params = {
    Bucket: bucketName,
    Prefix: prefix, // Specify the folder path here
    // Delimiter is intentionally left out to list all objects
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));
    // Filter out any keys that end with '/' to exclude folders
    const fileNames = data?.Contents?.filter(content => !content.Key.endsWith('/'))
      .map(content => content.Key);

    return fileNames;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

const getSignedDownloadLink = (bucket, fileName, exp = 3000) => {
  const command = new GetObjectCommand({ Bucket: bucket, Expires: 3000, Key: fileName });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

module.exports = {
  s3,
  downloadStream,
  uploadStream,
  getFirmwareDownloadLink,
  listAllObjects,
  getFileList,
  getFoldersAndFilesList,
  getSignedDownloadLink
};