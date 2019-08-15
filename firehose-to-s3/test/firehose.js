const AWS = require("aws-sdk")

async function listAllObjectsFromS3Bucket(s3, bucket, prefix) {
    let objects = [];
    let isTruncated = true;
    let marker;
    while (isTruncated) {
        let params = {Bucket: bucket};
        if (prefix) params.Prefix = prefix;
        if (marker) params.Marker = marker;
        try {
            const response = await s3.listObjects(params).promise();
            response.Contents.forEach(item => {
                objects.push(item.Key);
            });
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                marker = response.Contents.slice(-1)[0].Key;
            }
        } catch (error) {
            throw error;
        }
    }
    return objects
}

describe('firehose', async function () {
    it('inject into firehose', async function () {
        const firehose = new AWS.Firehose({region: 'us-east-1', endpoint: "http://localhost:4573"})
        const ts = new Date().getTime()
        try {
            let putRecordResponse = await firehose.putRecord({
                DeliveryStreamName: 'test-delivery-stream',
                Record: {Data: `${ts}|testing|container|-|my-test-string\n`}
            }).promise()
        } catch (err) {
            console.log(err, err.stack)
        }
    })

    it('check s3', async function () {
        const s3 = new AWS.S3({s3ForcePathStyle: true, region: 'us-east-1', endpoint: "http://localhost:4572"})
        // s3ForcePathStyle: true is required for localstack
        // TODO - look into LOCALSTACK_HOSTNAME
        let objects = await listAllObjectsFromS3Bucket(s3, 'test-delivery-bucket')
        console.log(objects)
    })
})
