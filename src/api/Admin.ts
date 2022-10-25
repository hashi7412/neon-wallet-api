import express from "express";
import fs from "fs";
import path from "path";
import { DAdmin, DVerifiedToken, DConfig } from "../Model";
import { validateUrl } from "../utils/helper";
import WebCrypto from "../utils/WebCrypto";

const Apis = {
	"signin": async (cookie, session, ip, params) => {
		try {
			const [email, password] = params as [email: string, password: string];

			const user = await DAdmin.findOne({ email });
			if (user) {
				if (user.password === WebCrypto.hash(password)) {
					return { result: { email: user.email, name: user.alias } }
				} else {
					return { error: 10001 }
				}
			}

			return { error: 10000 };
		} catch (err) {
			return { error: err };
		}
	},
	"reset-password": async (cookie, session, ip, params) => {
		try {
			const [email, pass, newpass] = params as [email: string, pass: string, newpass: string];

			const user = await DAdmin.findOne({ email: email, password: WebCrypto.hash(pass) });

			console.log(email, pass);

			if (user) {
				await DAdmin.updateOne({ email: email }, { $set: { password: WebCrypto.hash(newpass) } });
				return { result: true };
			} else {
				return { error: 20010 };
			}
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"accept-token": async (cookie, session, ip, params) => {
		try {
			const [contract, advice] = params as [contract: string, advice: string];

			await DVerifiedToken.updateOne({ contract: contract }, { $set: { status: "verified", advice: advice } })
			return { result: true };
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"reject-token": async (cookie, session, ip, params) => {
		try {
			const [contract, advice] = params as [contract: string, advice: string];

			await DVerifiedToken.updateOne({ contract: contract }, { $set: { status: "rejected", advice: advice } })
			return { result: true };
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"images": async (cookie, session, ip, params) => {
		try {
			express.static(path.join(__dirname, "/uploads"));
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"get-wallet": async (cookie, session, ip, params) => {
		try {
			const conf = await DConfig.findOne({_id: 1});
			return {result: conf.downLinks};
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"set-wallet": async (cookie, session, ip, params) => {
		const [key, url] = params as [key: string, url: string];

		try {
			const conf = await DConfig.findOne({_id: 1});
			if (conf) {
				if (conf.downLinks[key]===undefined) return {result: false};
				if (!validateUrl(url)) return {result: false};
				await DConfig.updateOne({_id: 1}, {$set: { downLinks: {...conf.downLinks, [key]: url}}});
			}
			return { result: true };
		} catch (err) {
			console.log(err);
			return { error: err };
		}
	},
	"get-tokens": async (cookie, session, ip, params) => {
		const [page, limit] = params as [page: number, limit: number];
		try {
			const rows = await DVerifiedToken.find().sort({created: 1}).skip(page * limit).limit(limit).toArray();
			const documentSize = await DVerifiedToken.countDocuments();
			return { result: { data: rows, count: documentSize, page: page, total: parseInt(String((documentSize - 1) / limit + 1)), limit: limit } };
		} catch (err) {
			return {error:err}
		}
	}
} as {
	[method: string]: (cookie: string, session: SessionType, ip: string, params: Array<string | number | boolean>) => Promise<ServerResponse>
}

export default Apis;
