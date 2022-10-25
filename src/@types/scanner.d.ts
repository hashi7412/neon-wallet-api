// by: Leo Pawel 	<https://github.com/galaxy126>

declare interface RawBlockObject {
	difficulty: 			string
	extraData: 				string
	gasLimit: 				string
	gasUsed: 				string
	hash: 					string
	logsBloom: 				string
	miner: 					string
	mixHash: 				string
	nonce: 					string
	number: 				string
	parentHash: 			string
	receiptsRoot: 			string
	sha3Uncles: 			string
	size: 					string
	stateRoot: 				string
	timestamp: 				string
	totalDifficulty: 		string
	transactions: 			RawTransactionObject[],
	transactionsRoot: 		string
	uncles: 				[]
}

declare interface RawTransactionObject {
	blockHash: 				string
	blockNumber: 			string
	from: 					string
	gas: 					string
	gasPrice: 				string
	maxFeePerGas?: 			string
	maxPriorityFeePerGas?:  string
	hash: 					string
	input: 					string
	nonce: 					string
	to: 					string
	transactionIndex: 		string
	value: 					string
	type: 					string
	v: 						string
	r: 						string
	s: 						string
}

declare interface RawTransactionLogObject {
	address: 			string
	topics: 			string[],
	data: 				string
	blockNumber: 		string
	transactionHash: 	string
	transactionIndex: 	string
	blockHash: 			string
	logIndex: 			string
	removed: 			boolean
}

declare interface RawReceiptTransactionObject {
	blockHash: 				string
	blockNumber: 			string
	contractAddress: 		string|null
	cumulativeGasUsed: 		string
	effectiveGasPrice: 		string
	from: 					string
	gasUsed: 				string
	logsBloom: 				string
	status: 				string
	to: 					string|null
	transactionHash: 		string
	transactionIndex: 		string
	type: 					string
	logs: 					RawTransactionLogObject[]
}