const AWS = require("aws-sdk")
const uuid = require('short-uuid')
const assert = require('chai').assert

describe('dynamodb', async function() {
  it('update and scan', async function() {
    const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1", endpoint: "http://localhost:4569" });

    const firstId = uuid.generate()
    let params = {
      TableName: 'test-table',
      Key: {
        first: firstId,
        second: 900
      },
      UpdateExpression: 'set middle = :middle, surname = :surname',
      ExpressionAttributeValues: {
        ':middle' : 'Samuel',
        ':surname' : 'Boxer'
      }
    };

    try {
      await ddb.update(params).promise()
    } catch(err) {
      console.log(err, err.stack)
    }

    try {
      let params = {
        TableName: 'test-table',
        KeyConditionExpression: '#first = :firstValue',
        ExpressionAttributeNames:{
          "#first": "first"
        },
        ExpressionAttributeValues: {
          ':firstValue': firstId
        }
      }

      let data = await ddb.query(params).promise()
      let foundFirstId = data.Items[0].first
      assert.equal(foundFirstId, firstId)
    } catch(err) {
      console.log(err, err.stack)
    }
  })
})
