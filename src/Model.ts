import * as mongodb from 'mongodb'
import { config } from './constants'
import setlog from './setlog'
import { now } from './utils/helper'
import WebCrypto from './utils/WebCrypto'

const client = new mongodb.MongoClient('mongodb://localhost:27017')
const db = client.db(config.database)

export interface SchemaConfig {
	_id:					number
	downLinks:				{[key: string]: string}
}

export interface SchemaAdmin {
	alias:					string
	email:					string
	password: 				string
	updated: 				number
	created: 				number
	lastLogged:				number
	loginCount:				number
	active:					boolean
}

export interface SchemaWallet {
	extension:				string
	iphone:					string
	android:				string
}

export interface SchemaVerifiedToken {
	contract:						string
	owner:							string
	companyName:					string
	officialWebsite:				string
	twitterHandle:					string
	companyresidentialaddress:		string
	phonenumber:					string
	businessEmail:					string
	businesslicensescreenshot:		string
	tokenName?:						string
	tokenSymbol?:					string
	tokenDecimals?:					string
	tokenTotalSupply?:				string
	tokenimage:						string
	tokentype:						string
	totalmarketcap:					string
	marketpair:						string
	socialUrl:						string[]
	advice:							string
	created:						number
	updated?:						number
	status:							"verified" | "pending" | "rejected"
}

export const DAdmin = 				db.collection<SchemaAdmin>('admins');
export const DConfig = 				db.collection<SchemaConfig>('config');
/* export const DWallet = 				db.collection<SchemaWallet>('wallet'); */
export const DVerifiedToken =		db.collection<SchemaVerifiedToken>('verifiedtoken');

const open = async () => {
	try {
		await client.connect();
		setlog('connected to MongoDB');

		const admins = await DAdmin.find().toArray();
		if (admins.length === 0) {
			DAdmin.insertOne({
				alias:					config.defaultAdmin.alias,
				email:					config.defaultAdmin.email,
				password: 				WebCrypto.hash(config.defaultAdmin.password),
				updated: 				0,
				created: 				now(),
				lastLogged:				0,
				loginCount:				0,
				active:					true
			});
		}

		const wallets = await DConfig.find().toArray();
		if (wallets.length === 0) {
			DConfig.insertOne({
				_id: 1,
				downLinks: {
					extension:				"https://neonlink.io/wallet/extension",
					iphone:					"https://neonlink.io/wallet/iphone",
					android:				"https://neonlink.io/wallet/android"
				}
			});
		}
	} catch (error) {
		setlog('Connection to MongoDB failed', error);
		process.exit();
	}
}

const close = async () => {
	try {
		await client.close();
	} catch (error) {
		process.exit();
	}
}

// export const getLastUID = async (): Promise<number> => {
// 	const row = await DConfig.findOne({id: 1})
// 	if (row===null) return 100001
// 	return row._id || 100001
// }

export default {open, close}