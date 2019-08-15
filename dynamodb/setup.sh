awslocal dynamodb create-table --table-name test-table \
  --attribute-definitions AttributeName=first,AttributeType=S AttributeName=second,AttributeType=N \
  --key-schema AttributeName=first,KeyType=HASH AttributeName=second,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

awslocal dynamodb put-item --table-name test-table --item '{"first":{"S":"Jack"},"second":{"N":"42"}}'

awslocal dynamodb scan --table-name test-table
