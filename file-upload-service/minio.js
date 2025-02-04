// test-minio.js
const Minio = require('minio');

// Initialize MinIO client
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'UpcdoQgnk5Z8liDwyaXp',
    secretKey: 'N9WYPZlYUMroTdIsnZwlZQVFTI6pQ5pFi55kC9UD'
});

const filePath = '/Users/mzitoh/Desktop/a-beginners-guide-to-data-and-analytics.pdf';
const bucketName = 'test-bucket';
const fileName = 'guide.pdf';

async function uploadTest() {
    try {
        // Check and create bucket
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            console.log('Bucket created successfully');
        }

        // Upload file
        await minioClient.fPutObject(bucketName, fileName, filePath);
        console.log('File uploaded successfully');

        // Generate URL
        const url = await minioClient.presignedGetObject(bucketName, fileName, 24*60*60);
        console.log('File URL:', url);

    } catch (err) {
        console.error('Error:', err);
    }
}

uploadTest();