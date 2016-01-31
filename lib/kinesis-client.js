'use strict';

class KinesisClient {
  constructor(params) {
    this._kinesis = params.kinesis;
    this._streamName = params.streamName;
  }

  putRecord(data, partitionKey) {
    let putRecord = denodeify(this._kinesis, 'putRecord');
    return putRecord({
      StreamName: this._streamName,
      PartitionKey: partitionKey,
      Data: JSON.stringify(data)
    });
  }

  getAllRecordsFrom(shardId, sequenceNumber, limit) {
    function getWhile(shardIterator, scope, options) {
      return scope.getRecords(shardIterator, options)
        .then(function (result) {
          let iterator = result.NextShardIterator;
          let Records = result.Records;
          if (iterator && Records.length > 0) {
            return getWhile(iterator, scope, options)
              .then(innerResult => ({
                Records: result.Records.concat(innerResult.Records),
                NextShardIterator: innerResult.NextShardIterator
              }))
          } else {
            return result;
          }
        });
    }
    return this.getShardIterator(shardId, {
      ShardIteratorType: 'AT_SEQUENCE_NUMBER',
      StartingSequenceNumber: sequenceNumber
    })
    .then(result => getWhile(result.ShardIterator, this, {Limit: limit}))
  }

  getRecords(shardIterator, options) {
    let getRecords = denodeify(this._kinesis, 'getRecords');
    let params = Object.assign({}, options, {
      ShardIterator: shardIterator
    });
    return getRecords(params);
  }

  getShardIterator(shardId, options) {
    let getShardIterator = denodeify(this._kinesis, 'getShardIterator');
    let params = Object.assign({}, options, {
      StreamName: this._streamName,
      ShardId: shardId
    });
    return getShardIterator(params);
  }

  getShardIds() {
    return this._describeStream().then(result =>
      result.StreamDescription.Shards.map(shard => shard.ShardId));
  }

  _describeStream() {
    let describeStream = denodeify(this._kinesis, 'describeStream');
    return describeStream({
      StreamName: this._streamName
    });
  }
}

function denodeify(arg1, arg2) {
  let fn = arg2 ? arg1[arg2].bind(arg1) : arg1;
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
      fn.apply(null, args);
    });
  }
}

module.exports = KinesisClient;
