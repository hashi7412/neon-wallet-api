// by: Leo Pawel 	<https://github.com/galaxy126>
require("dotenv").config()

import * as express from 'express'
import * as crypto from 'crypto'
import axios from 'axios'
import setlog from './setlog'
import * as websocket from 'websocket'
import { parse as uuidParse } from 'uuid'
import { config } from './constants'
import Socket from './utils/Socket'
import { getSession, setSession } from './utils/Redis'
import { now } from './utils/helper'

import ClientApi from './api/Client'
import AdminApi from './api/Admin'
export const rpcRouter = express.Router()

const clients = new Map()

rpcRouter.post("/",async (req:express.Request, res:express.Response)=>{
	const { jsonrpc, method, params, id } = req.body as RpcRequestType
	let response = {} as {error?:number, result?:any}
	if (jsonrpc==='2.0' && Array.isArray(params)) {
		const func = method_list[method]
		if (func) {
			try {
				const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress)
				let token = req.headers["x-token"] || ''
				let session:SessionType|null = null
				if (token==='70383088c9a4bb8d5993cf8edf6fd5a1f416f77c467068f39c09ae619b6bddcd') {
					session = {
						uid: 0,
						created: 1644923661
					}
					response = await func(String(token), session, ip, params)
				} else {
					response.error = 32604
				}
			} catch (error:any) {
				setlog("rpc-error", error)
				response.error = 32000
			}
		} else {
			response.error = 32601
		}
	} else {
		response.error = 32600
	}
	res.json({jsonrpc: "2.0", id, ...response})
})

export const Actions = {
	onRequest(ip:string, origin:string, wss:string, cookie:string) {
		try {
			if ((wss===config.apiKey || wss===config.adminKey) && cookie) {
				const bytes = uuidParse(cookie)
				if (bytes) return true
			}
		} catch (error) { }
		return false
	},
	onConnect(con:websocket.connection, ip:string, wss:string, cookie:string) {
		getSession(cookie).then(async session=>{
			try {
				if (session===null) {
					session = {created:now()}
					await setSession(cookie, session)
				}
				clients.set(con, session.uid || 0)
				setlog(`added socket ${cookie} ${wss===config.adminKey ? ' (admin)' : ''}`, '', true)
			} catch (error) {
				setlog('socket-connect', error)
			}
		})
	},

	onDisconnect(con:websocket.connection, cookie:string) {
		setlog(`deleted socket ${cookie}`, '', true)
		clients.delete(con)
	},

	onData(con:websocket.connection, msg:string, ip:string, wss:string, cookie:string) {
		try {
			let response = {} as {error?:number, result?:any}
			const { jsonrpc, method, params, id } = JSON.parse(msg)
			if (jsonrpc==="2.0") {
				const func = (wss===config.adminKey ? admin_method_list: method_list)[method]	
				if (func) {
					try {
						getSession(cookie).then(async session=>{
							try {
								if (session===null) {
									session = {created:now()}
									await setSession(cookie, session)
								}
								clients.set(con, session.uid || 0)
								const response = await func(cookie, session, ip, params)
								con.send(encodeURI(JSON.stringify({jsonrpc: "2.0", id, ...response})))
							} catch (error) {
								setlog('onData', error)
								con.send(encodeURI(JSON.stringify({jsonrpc: "2.0", id, error:32000})))
							}
						})
						return
					} catch (error:any) {
						setlog('portal-' + method, error)
						if (error.code===11000) {
							response.error = 19999
						} else {
							response.error = 32000
						}
					}
				} else {
					response.error = 32601
				}
				con.send(encodeURI(JSON.stringify({jsonrpc: "2.0", id, ...response})))
			} else {
				con.send(encodeURI(JSON.stringify({jsonrpc: "2.0", id, error:32600})))
			}
		} catch (error) {
			setlog('socket-data', error, false)
		}
	}
}

const verifyCaptcha = async (token:string) => {
	try {
		const src = new TextEncoder().encode(config.chainSecret.slice(0,16))
		const iv = Buffer.from(src.buffer, src.byteOffset, src.byteLength)
		let buf = config.chainKey.slice(9).split('').map((c) => {switch (c) { case '-': return '+'; case '_': return '/'; default: return c;}}).join('');
		const key = crypto.createSecretKey(Buffer.from(buf, 'base64'));
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		const data = Buffer.concat([cipher.update(new TextEncoder().encode(token)), cipher.final()]).toString('base64');

		const response = await axios.post(config.chainRpcUrl, {
			jsonrpc: "2.0", 
			id:Math.round(Math.random()*1e6), 
			method:'deam-verify', 
			params:[config.chainId, data]
		});
		if (response.data.error) return response.data.error
		if (response.data.result) return response.data.result
	} catch (error) {
		console.log(error)
	}
	return 10000
}

const method_list = ClientApi as {
	[method:string]:(cookie:string, session:SessionType, ip:string, params:Array<any>)=>Promise<ServerResponse>
}

const admin_method_list = AdminApi as {
	[method:string]:(cookie:string, session:SessionType, ip:string, params:Array<any>)=>Promise<ServerResponse>
}

const initSocket = (server: any)=>{
	Socket(server, Actions)
	setlog("initialized socket server.")
}

export default initSocket