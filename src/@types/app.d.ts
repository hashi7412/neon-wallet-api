// by: Leo Pawel 	<https://github.com/galaxy126>

declare type AddressType = 'none'|'Contract'|'ERC20'|'ERC721'|'ERC1155'
declare type SocialType = "email"|"blog"|"reddit"|"twitter"|"facebook"|"git"|"tg"|"discord"|"cmc"|"coingecko"
declare type EvmVersionType = "default"|"homestead"|"tangerineWhistle"|"spuriousDragon"|"byzantium"|"constantinople"|"petersburg"|"istanbul"
declare type CodeFormatType = "solidity-single-file"|"solidity-standard-json-input"
declare type LicenseType = "none"|"Unlicense"|"MIT"|"GPLv2"|"GPLv3"|"LGPLv2.1"|"LGPLv3"|"BSC2Clause"|"MPL2"|"OSL3"|"Apache2"|"AGPLv3"|"BSL11"

// export const CodeFormats = [
//     {label: "Solidity (Single file)", 			title: "A simple interface for solidity code that fits or concatenated into a single file"},
//     {label: "Solidity (Multi-Part files)", 		title: "Support for multi-part/file solidity code with imports"},
//     {label: "Solidity (Standard-Json-Input)",	title: "The recommended way to interface with the Solidity compiler especially for more complex and automated setups"},
//     {label: "Vyper (Experimental)", 			title: "Experimental support for the Vyper smart contract development language"},
// ]

// export const EvmVersions = [
//     {key: 'default',			label: 'default (compiler defaults)'},
// 	{key: 'homestead',			label: 'homestead (oldest version)'},
// 	{key: 'tangerineWhistle',	label: 'tangerineWhistle'},
// 	{key: 'spuriousDragon',		label: 'spuriousDragon'},
// 	{key: 'byzantium',			label: 'byzantium (default for &lt;= v0.5.4)'},
// 	{key: 'constantinople',		label: 'constantinople'},
// 	{key: 'petersburg',			label: 'petersburg (default for &gt;= v0.5.5)'},
// 	{key: 'istanbul',			label: 'istanbul (default for &gt;= v0.5.14)'},
// ]

// export const LicenseTypes = [
// 	'No License (None)',
// 	'The Unlicense (Unlicense)',
// 	'MIT License (MIT)',
// 	'GNU General Public License v2.0 (GNU GPLv2)',
// 	'GNU General Public License v3.0 (GNU GPLv3)',
// 	'GNU Lesser General Public License v2.1 (GNU LGPLv2.1)',
// 	'GNU Lesser General Public License v3.0 (GNU LGPLv3)',
// 	'BSD 2-clause "Simplified" license (BSD-2-Clause)',
// 	'BSD 3-clause "New" Or "Revised" license (BSD-3-Clause)',
// 	'Mozilla Public License 2.0 (MPL-2.0)',
// 	'Open Software License 3.0 (OSL-3.0)',
// 	'Apache 2.0 (Apache-2.0)',
// 	'GNU Affero General Public License (GNU AGPLv3)',
// 	']Business Source License (BSL 1.1)',
// ]

declare interface LatestBlockObject {
	number: 				number
	miner?: 				string
	txn: 			        number
	gasUsed?:               number
	rewards: 				number
	created: 				number
}

declare interface LatestTxObject {
	txId: 					string
	from: 					string
	to: 					string
	value: 					number
	created: 				number
}

declare interface BlockObject {
	latestBlock?:			number
	blockNumber: 			number
	hash: 					string
	parentHash:				string
	miner: 					string				// always be 0x0000000000000000000000000000000000000000 in Lachesis 
	txn: 					number				// transaction count
	txnIn: 					number				// internal transaction count
	rewards: 				number				// in wei
	difficulty: 			number				// always be 0 in POS
	totalDifficulty: 		number				// always be 0 in POS
	size: 					number
	gasUsed: 				number				// in ether
	sha3Uncles: 			string
	nonce: 					number
	timestamp: 				number
}

declare interface SimpleTxObject {
	txId: 					string
	blockNumber?:			number
	method?:				string
	n:						number
	from: 					string
	to: 					string
	value: 					number
	nonce: 					number
	gasPrice?: 				number
	gasLimit?: 				number
	fee?: 					number
	creation?:				boolean
	timestamp: 				number
}

declare interface SfcObject {
	baseRewardPerSecond: 	number
	totalSupply: 			number
	currentSealedEpoch: 	number
	epoch: 					number
	lastValidatorID: 		number
	totalStake: 			number
	totalActiveStake: 		number
	totalSlashedStake: 		number
}

declare interface ValidatorObject {
	id: 					number
	address: 				string
	name: 					string
	logo: 					string
	downtime: 				number
	totalStaked: 			number
	stakedAmount: 			number
	delegatedAmount: 		number
	stakingStartEpoch: 		number
	status:					number
	createdEpoch:			number
	deactivatedTime:		number
	deactivatedEpoch:		number
	created: 				number
}

declare interface TransferObject {
	from:					string
	to:						string
	value:					number
}
declare interface TokenTransferObject {
	from:					string
	to:						string
	token:					string
	type?:					AddressType
	name?:					string
	symbol?:				string
	tokenId?:				string
	value?:					number|string
}

declare interface ContractCreationObject {
	from:					string
	to:						string
	type:					AddressType
	name?:					string
	symbol?:				string
}
declare interface TxLogObject {
	address:				string
	topics:					string[]
	data:					string
}

declare interface ServerEpochObject {
    id:						number
	endTime:				number
	epochFee:				number
	totalStake:				number
	totalSupply:			number
	txRewardWeight:			number
	baseRewardWeight:		number
}
declare interface ServerTxObject {
	latestBlockNumber:		number
	txId: 					string
	blockNumber:			number
	method:					string
	from: 					string				// account.id
	to: 					string|null			// account.id, if to=0, means null
	toIsContract:			boolean
	// contract: 				string|null			// account.id, if to=0, means null
	n: 						number				// transactionIndex
	value: 					number
	gasPrice: 				number
	gasLimit: 				number
	gasUsed: 				number
	maxFeePerGas?: 			number
	maxPriorityFeePerGas?:  number
	cumulativeGasUsed: 		number
	input: 					string
	nonce: 					number
	status:					boolean
	error?:					string
	timestamp:				number
	transfers:				Array<TransferObject>
	creates:				Array<ContractCreationObject>
	tokens:					Array<TokenTransferObject>
	logs: 					Array<TxLogObject>
}

declare interface ServerTxListItem {
	txId: 					string
	blockNumber:			number
	from: 					string
	to: 					string
	timestamp:				number
	fromIsContract?: 		boolean
	toIsContract?: 			boolean
	method?:				string
	type?:					string
	creation?: 				boolean
	value?: 				string|number
	fee?: 					number
	status?:				boolean
	token?:					string
	tokenId?:				string
	name?:					string
	symbol?:				string
}
declare interface ServerVerifiedContract {
	address:				string
	name:					string
	compiler:				string
	version:				string
	balance:				number
	txn:					number
	optimized:				boolean
	hasArgs:				boolean
	license: 				string
	audited:				number
	created:				number
}
declare interface ServerNftListItem {
	tokenId: 				string
	owner:					string
	value?:					number
	updated:				number
	created:				number
}


declare interface ServerTopAccountObject {
	rank:					number
	address:				string
	isContract?:			boolean
	value:					number
	txn:					number
}

declare interface ServerTokenBalanceObject {
	token: 				string
	name:				string
	symbol:				string
	value:				string|number
}

declare interface ServerAddressObject {
	address:				string
	value:					number
	type?:					AddressType
	name?:					string
	symbol?:				string
	name?:					string
	symbol?:				string
	decimals?:				number
	tag?: 					string
	creator?:				string
	txId?:					string
	validated?:				boolean
	verified?:				boolean
	logoUri?:				string
	website?:				string
	socials?:				Array<{
		type:				SocialType
		url:				string
	}>
	txn:					number	// normal transactions
	txn20:					number
	txn721:					number
	txn1155:				number
	txnIn:					number	// internal transactions
	erc20: 					Array<ServerTokenBalanceObject>
	erc721: 				Array<ServerTokenBalanceObject>
	erc1155: 				Array<ServerTokenBalanceObject>
	validator?:				ValidatorObject
}
declare interface ServerTokenObject {
	address:				string
	type:					AddressType
	name:					string
	symbol:					string
	decimals?:				number
	holderCount:			number
	transferCount:			number
	validated:				boolean
	creator:				string
	txId:					string
}

declare interface NormalizedTxObject {
	id:						number
	txId: 					string
	blockNumber:			number
	method:					string
	from: 					string				// account.id
	to: 					string				// account.id, if to=0, means null
	// contract: 				string|null			// account.id, if to=0, means null
	creation:				boolean
	n: 						number				// transactionIndex
	value: 					mongodb.Decimal128
	gasPrice: 				mongodb.Long
	gasLimit: 				number
	gasUsed: 				number
	maxFeePerGas?: 			mongodb.Long
	maxPriorityFeePerGas?:  mongodb.Long
	cumulativeGasUsed: 		number
	input: 					string
	nonce: 					number
	timestamp:				number
	txIns:					number
	tx20:					number
	tx721:					number
	tx1155:					number
	evtn:					number
	status:					boolean
	error?:					string
	logs: 					Array<TxLogObject>
}

declare interface ContractObject {
	type:					AddressType
	txId?:					string
	validated?:				boolean
	name?:					string
	symbol?:				string
	decimals?:				number

	//	used scanning
	creator?:				string
	address?:				string
	hash?:					string
	timestamp?:				number
}

declare interface AccountDataType {
	address:			string
	type:				AddressType
	value:				string
	txn:				number	// normal transactions
	txn20:				number
	txn721:				number
	txn1155:			number
	txnIn:				number	// internal transactions
	hash?:				string
	txId?:				string
	validated?:			boolean
	name?:				string
	symbol?:			string
	decimals?:			number
	creator?:			string
	timestamp:			number
}

declare interface ServerUserApiKey {
	id:						number
	appName: 				string
	apiKey: 				string
	usage: 					number
	created: 				number
}

declare interface AccountObject {
	[address:string]: AccountDataType
}

declare interface TokenObject {
	[address:string]: {
		[token:string]: 		{
			type: 			AddressType
			tokenIds: 		{[tokenId:string]: number} // number is blockNumber if erc20, tokenId should be 0
		}
	}
}

declare interface TokenBalanceObject {
	type: 					AddressType
	token: 					string
	tokenId?: 				string|null
	address?: 				string
	value?: 				string
	timestamp:				number
}

declare interface ApiQuotaObject {
	email:					number
	address:				number
	txnote:					number
	tag:					number
	apikey:					number
	verifiedAddress:		number
}

declare interface SvcGlobalType {
	conf:				SchemaConfig
	charts:				{[timestamp: number]: SchemaCharts}
	// times:				{},
	blocks:				SchemaBlock[]
	txs:				NormalizedTxObject[]
	txInternals: 		SchemaTxInternal[]
	contracts: 			{[address: string]: ContractObject}
	contractNfts: 		Array<{address: string, type: AddressType}>
	blockInternalTxs: 	{[blockNumber: number]: number}
	events: 			SchemaEvent[]
	accounts: 			AccountObject
	tokens: 			TokenObject
}