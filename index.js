'use strict';

let AWS = require('aws-sdk');

let JsConfig = require('./lib/config');
let KinesisClient = require('./lib/kinesis-client');

let config = new JsConfig('./app.conf');

let kinesis = new AWS.Kinesis({
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretAccessKey'),
  region: config.get('aws.region')
});

let kinesisClient = new KinesisClient({
  kinesis,
  streamName: config.get('aws.kinesis.streamName')
});

// kinesisClient.putRecord({a: generateRandom()}, config.get('aws.kinesis.partitionKey'))
// .then(data => {
//   console.log(data);
// })

return kinesisClient.getShardIds()
.then(data => {
  let startingSequenceNumber = config.get('aws.kinesis.StartingSequenceNumber');
  let limit = 2;
  return kinesisClient.getAllRecordsFrom(data[0], startingSequenceNumber, limit);
}).then(data => {
  console.log('NextShardIterator', data.NextShardIterator);
  data.Records.forEach(record => {
    console.log(JSON.parse(record.Data.toString()));
  });
}).catch(e => {
  console.error(e.stack);
});

function generateRandom() {
  return Math.floor(Math.random() * 1000);
}
