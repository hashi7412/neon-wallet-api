// by: Leo Pawel 	<https://github.com/galaxy126>

// account module
declare interface ApiModuleType {
	[action:string]: (params: Array<string|number>|any) => Promise<any>
}


declare interface ApiSingleValueResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	string
}

declare interface ApiAccountBalanceMultiResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: Array<{
		account: string
		balance: string
	}>
}

declare interface ApiAccountTxlistResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: Array<{
		blockNumber:			string
		timeStamp:				string
		hash:					string
		nonce:					string
		blockHash:				string
		transactionIndex:		string
		from:					string
		to:						string
		value:					string
		gas:					string
		gasPrice:				string
		isError:				string
		txreceipt_status:		string
		input:					string
		contractAddress:		string
		cumulativeGasUsed:		string
		gasUsed:				string
		confirmations:			string
	}>
}

declare interface ApiAccountTxlistinternalResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: Array<{
		blockNumber:			string
		timeStamp:				string
		hash:					string
		from:					string
		to:						string
		value:					string
		contractAddress:		string
		input:					string
		type:					string
		gas:					string
		gasUsed:				string
		traceId:				string
		isError:				string
		errCode:				string
	}>
}

declare interface ApiAccountTokentxResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: Array<{
		blockNumber:			string
		timeStamp:				string
		hash:					string
		nonce:					string
		blockHash:				string
		from:					string
		contractAddress:		string
		to:						string
		value:					string
		tokenName:				string
		tokenSymbol:			string
		tokenDecimal:			string
		transactionIndex:		string
		gas:					string
		gasPrice:				string
		gasUsed:				string
		cumulativeGasUsed:		string
		input:					string
		confirmations:			string
	}>
}

declare interface ApiAccountTokennfttxResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: Array<{
		blockNumber:			string
		timeStamp:				string
		hash:					string
		nonce:					string
		blockHash:				string
		from:					string
		contractAddress:		string
		to:						string
		tokenID:				string
		tokenName:				string
		tokenSymbol:			string
		tokenDecimal:			string
		transactionIndex:		string
		gas:					string
		gasPrice:				string
		gasUsed:				string
		cumulativeGasUsed:		string
		input:					string
		confirmations:			string
	}>
}

declare interface ApiAccountGetminedblocksResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	Array<{
		blockNumber:			string
		timeStamp:				string
		blockReward:			string
	}>
}

declare interface ApiContractGetsourcecodeResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	Array<{
		SourceCode:				string
		ABI:					string
		ContractName:			string
		CompilerVersion:		string
		OptimizationUsed:		string
		Runs:					string
		ConstructorArguments:	string
		EVMVersion:				string
		Library:				string
		LicenseType:			string
		Proxy:					string
		Implementation:			string
		SwarmSource:			string
	}>
}

declare interface ApiTransactionGettxreceiptstatusResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	{
		status:	string
	}
}

declare interface ApiBlockGetblockrewardResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	{
		blockNumber:			string
		timeStamp:				string
		blockMiner:				string
		blockReward:			string
		uncles:					string[]
		uncleInclusionReward:	string
	}
}

declare interface ApiBlockGetblockcountdownResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	{
		CurrentBlock:			string
		CountdownBlock:			string
		RemainingBlock:			string
		EstimateTimeInSec:		string
	}
}


declare interface ApiGastrackerGasoracleResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	{
		LastBlock:				string
		SafeGasPrice:			string
		ProposeGasPrice:		string
		FastGasPrice:			string
		UsdPrice:				string
	}
}


declare interface ApiStatsPriceResponse {
	status:		string
	message:	"OK"|"NOTOK",
	result: 	{
		"ethbtc":"0.0000581131104068839",
		"ethbtc_timestamp":"1643024150",
		"ethusd":"1.955",
		"ethusd_timestamp":"1643024146"
	}
}