awslocal s3 mb s3://test-delivery-bucket

awslocal iam create-role --role-name test-delivery-role --assume-role-policy-document "{\"Version\": \"2012-10-17\", \"Statement\": { \"Effect\": \"Allow\", \"Action\": \"s3:*\", \"Resource\": \"arn:aws:s3:::*\"}}"

awslocal firehose create-delivery-stream --delivery-stream-name test-delivery-stream --delivery-stream-type DirectPut \
    --s3-destination-configuration "RoleARN=arn:aws:iam::000000000000:role/test-delivery-role,BucketARN=arn:aws:s3:::test-delivery-bucket,BufferingHints={SizeInMBs=5,IntervalInSeconds=300},CompressionFormat=UNCOMPRESSED"

awslocal firehose put-record --delivery-stream-name test-delivery-stream --record '{"Data":"{\"attribute\":1}"}'

awslocal s3 ls s3://test-delivery-bucket --recursive
