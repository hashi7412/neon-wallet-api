import express from "express";
import fs from "fs";
import { ethers } from "ethers";
import path from "path";
import { DAdmin, DVerifiedToken, DConfig } from "../Model";
import { now, nowDate, validateEmail } from "../utils/helper";
import WriteFile from "../utils/WriteFile";

const RPCURL = "https://data-seed-prebsc-1-s1.binance.org:8545";
const provider = new ethers.providers.JsonRpcProvider(RPCURL);

const ClientAip = {
	"get-wallet-links": async (cookie, session, ip, params) => {
		try {
			const conf = await DConfig.findOne({_id: 1});
			return { result: conf.downLinks };
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},

	"upload": async (cookie, session, ip, params) => {
		const [name, data, opt] = params as [name: string, data: any, opt: {contract:string, key:string}];
		console.log(name);
		const dirname = "./upload/";
		try {
			await WriteFile(dirname, name, data);

			if (opt.key === "license") {
				DVerifiedToken.updateOne({contract: opt.contract}, {$set: {businesslicensescreenshot: name}});
			}

			if (opt.key === "tokenimage") {
				DVerifiedToken.updateOne({contract: opt.contract}, {$set: {tokenimage: name}});
			}
			return { result: true };
		} catch (err) {
			console.log(err);
			return {error: err};
		}
	},

	"check-address": async (cookie, session, ip, params) => {
		const [address] = params as [address: string];
		try {
			const res = await DVerifiedToken.findOne({ contract: address });
			if (res) {
				return { error: 20203 };
			}

			if (ethers.utils.isAddress(address)) {
				const code = await provider.getCode(address);
				if (code) {
					return { result: true };
				} else {
					return { error: 20202 };
				}
			} else {
				return { error: 20201 };
			}
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"get-contractdata": async (cookie, session, ip, params) => {
		const [address] = params as [address: string,];
		try {
			const contract = new ethers.Contract(address, ["function owner() view returns (address)"], provider);

			const creator = "";
			let owner = "";
			const msg = "[Neon chain " + nowDate() + "] I, hereby verify that I am the owner/creator of the address [" + address + "]";

			const code = await provider.getCode(address);

			if (code || code.length <= 2) {
				if (code.includes(ethers.utils.id("owner()").slice(2, 10))) {
					owner = await contract.owner();
				}
			}

			return { result: [creator, owner, msg] };
		} catch (err) {
			return { error: err };
		}
	},
	"verify-ownership": async (cookie, session, ip, params) => {
		const [address, identifier, signature, msgToSign] = params as [address: string, identifier: string, signature: string, msgToSign: string];
		try {
			const signerAddress = ethers.utils.recoverAddress(ethers.utils.hashMessage(msgToSign), signature);

			return { result: (signerAddress === identifier) };
		} catch (err) {
			return { error: err };
		}
	},
	"get-contractinfo": async (cookie, session, ip, params) => {
		const [address] = params as [address: string];
		try {
			const contract = new ethers.Contract(
				address,
				[
					"function name() view returns (string)",
					"function symbol() view returns (string)",
					"function decimals() view returns (uint8)",
					"function totalSupply() view returns (uint256)"
				],
				provider
			);

			let name: string = null;
			let symbol: string = null;
			let decimals: number = null;
			let totalSupply: string = null;

			const code = await provider.getCode(address);

			if (code || code.length <= 2) {
				if (code.includes(ethers.utils.id("name()").slice(2, 10))) {
					name = await contract.name();
				}
				if (code.includes(ethers.utils.id("symbol()").slice(2, 10))) {
					symbol = await contract.symbol();
				}
				if (code.includes(ethers.utils.id("decimals()").slice(2, 10))) {
					decimals = await contract.decimals();
				}
				if (code.includes(ethers.utils.id("totalSupply()").slice(2, 10))) {
					const tsHex = await contract.totalSupply();
					totalSupply = ethers.BigNumber.from(tsHex).toString();
				}
			}

			return { result: [name, symbol, decimals, totalSupply] };
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"get-token-info": async (cookie, session, ip, params) => {
		const [address, page, limit] = params as [address: string, page: number, limit: number];
		try {
			const rows = await DVerifiedToken.find().toArray();
			return { result: rows };
		} catch (err) {
			console.log(err);
			return {error: err};
		}
	},
	"get-token": async (cookie, session, ip, params) => {
		const [address, page, limit] = params as [address: string, page: number, limit: number];
		try{
			const rows = await DVerifiedToken.find({ owner: address }).sort({created: 1}).skip(page*limit).limit(limit).toArray();
			const documentSize = await DVerifiedToken.countDocuments({ owner: address });
			return { result: { data: rows, count: documentSize, page: page, total: parseInt(String((documentSize - 1) / limit + 1)), limit: limit } };
		} catch (err) {
			console.log(err);
			return {error: err};
		}
	},
	"get-token-one": async (cookie, session, ip, params) => {
		const [address] = params as [address: string];
		try{
			const rows = await DVerifiedToken.find({ contract: address }).toArray();
			return { result: rows[0] };
		} catch (err) {
			console.log(err);
			return {error: err};
		}
	},
	"get-token-all": async (cookie, session, ip, params) => {
		try{
			const rows = await DVerifiedToken.find().toArray();
			return { result: { data: rows } };
		} catch (err) {
			console.log(err);
			return {error: err};
		}
	},
	"insert-token": async (cookie, session, ip, params) => {
		try {
			const [
				contract,
				owner,
				companyName,
				officialWebsite,
				twitterHandle,
				companyresidentialaddress,
				phonenumber,
				businessEmail,
				businesslicensescreenshot,
				tokenName,
				tokenSymbol,
				tokenDecimals,
				tokenTotalSupply,
				tokenimage,
				tokentype,
				totalmarketcap,
				marketpair,
				socialUrl,
			] = params as [
				contract: string,
				owner: string,
				companyName: string,
				officialWebsite: string,
				twitterHandle: string,
				companyresidentialaddress: string,
				phonenumber: string,
				businessEmail: string,
				businesslicensescreenshot: string,
				tokenName: string,
				tokenSymbol: string,
				tokenDecimals: string,
				tokenTotalSupply: string,
				tokenimage: string,
				tokentype: string,
				totalmarketcap: string,
				marketpair: string,
				socialUrl: string[],
			];

			const screenshotname = [contract, now(), "license", businesslicensescreenshot.slice(0, 10)].join("_");
			const tokenimagename = [contract, now(), "tokenim", tokenimage.slice(0, 10)].join("_");

			const res = await DVerifiedToken.insertOne({
				contract: contract,
				owner: owner,
				companyName: companyName,
				officialWebsite: officialWebsite,
				twitterHandle: twitterHandle,
				companyresidentialaddress: companyresidentialaddress,
				phonenumber: phonenumber,
				businessEmail: businessEmail,
				businesslicensescreenshot: screenshotname,
				tokenName: tokenName,
				tokenSymbol: tokenSymbol,
				tokenDecimals: tokenDecimals,
				tokenTotalSupply: tokenTotalSupply,
				tokenimage: tokenimagename,
				tokentype: tokentype,
				totalmarketcap: totalmarketcap,
				marketpair: marketpair,
				socialUrl: socialUrl,
				advice: "",
				created: now(),
				status: "pending"
			});

			return { result: [screenshotname, tokenimagename] }
		} catch (err) {
			return { error: err };
		}
	},
	"update-token": async (cookie, session, ip, params) => {
		try {
			const [
				contract,
				owner,
				companyName,
				officialWebsite,
				twitterHandle,
				companyresidentialaddress,
				phonenumber,
				businessEmail,
				businesslicensescreenshot,
				tokenName,
				tokenSymbol,
				tokenDecimals,
				tokenTotalSupply,
				tokenimage,
				tokentype,
				totalmarketcap,
				marketpair,
				socialUrl,
			] = params as [
				contract: string,
				owner: string,
				companyName: string,
				officialWebsite: string,
				twitterHandle: string,
				companyresidentialaddress: string,
				phonenumber: string,
				businessEmail: string,
				businesslicensescreenshot: string,
				tokenName: string,
				tokenSymbol: string,
				tokenDecimals: string,
				tokenTotalSupply: string,
				tokenimage: string,
				tokentype: string,
				totalmarketcap: string,
				marketpair: string,
				socialUrl: string[],
			];

			const screenshotname = [contract, now(), "license", businesslicensescreenshot.slice(0, 10)].join("_");
			const tokenimagename = [contract, now(), "tokenim", tokenimage.slice(0, 10)].join("_");
			console.log(contract, companyName);

			const res = await DVerifiedToken.updateOne({ contract: contract }, {
				$set: {
					companyName: companyName,
					officialWebsite: officialWebsite,
					twitterHandle: twitterHandle,
					companyresidentialaddress: companyresidentialaddress,
					phonenumber: phonenumber,
					businessEmail: businessEmail,
					tokenName: tokenName,
					tokenSymbol: tokenSymbol,
					tokenDecimals: tokenDecimals,
					tokenTotalSupply: tokenTotalSupply,
					tokentype: tokentype,
					totalmarketcap: totalmarketcap,
					marketpair: marketpair,
					socialUrl: socialUrl,
					created: now(),
					status: "pending"
				}
			});

			return { result: [screenshotname, tokenimagename] }
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	}
} as {
	[method: string]: (cookie: string, session: SessionType, ip: string, params: Array<string | number | boolean>) => Promise<ServerResponse>
}

export default ClientAip;
