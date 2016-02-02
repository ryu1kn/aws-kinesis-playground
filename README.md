
# aws-kinesis-playground

```
$ npm install
$ npm start
```

`app.conf` should have the following values

```javascript
{
  "aws.accessKeyId": "AWS ACCESS KEY ID",
  "aws.secretAccessKey": "AWS SECRET ACCESS KEY",
  "aws.region": "AWS REGION",
  "aws.kinesis.partitionKey": "PARTITION KEY",
  "aws.kinesis.streamName": "STREAM NAME",

  // Kinesis stream's starting serial number
  "aws.kinesis.StartingSequenceNumber": "STARTING SEQUENCE NUMBER"
}
```
