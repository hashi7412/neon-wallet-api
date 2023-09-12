// by: Leo Pawel 	<https://github.com/galaxy126>

import * as http from 'http'
import express from 'express'
import cors from 'cors'
import os from 'os'
import formData from 'express-form-data'
const path = require("path");  

import setlog from './setlog'
import Model from './Model'
import { config } from './constants'
import socketServer from './socketServer'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
process.env.NODE_NO_WARNINGS = "1"

process.on("uncaughtException", (err:Error) => setlog('exception',err))
process.on("unhandledRejection", (err:Error) => setlog('rejection',err))

Model.open().then(async ()=>{
	try {
		/* await Redis.connect(); */
		const app = express();
		const server = http.createServer(app);
        socketServer(server);

		app.use(cors({
			origin: function(origin, callback){
				return callback(null, true)
			}
		}));

		app.use(express.json());
		app.use(express.urlencoded());
		const options = {
			uploadDir: os.tmpdir(),
			autoClean: true
		};
		app.use(formData.parse(options));
		app.get('/image/:file(*)', (req, res) => {
			let file = req.params.file;
			let fileLocation = path.join(__dirname, '../upload', file);

			res.sendFile(`${fileLocation}`);
		})

		app.get("/download-neon-wallet/:file(*)", (req, res) => {
			let file = req.params.file;
			let fileName = "1.png";
			if (file === "extension") {
				fileName = "extension.png";
			} else if (file === "iphone") {
				fileName = "iphone.png";
			} else if (file === "android") {
				fileName = "android.png";
			}

			const directoryPath = "../api/downloads/wallet/";

			res.download(directoryPath + fileName, fileName, (err) => {
				if (err) {
					res.status(500).send({
						message: "Could not download the file. " + err,
					});
				}
			});
		});
		  
		let time = +new Date();
		await new Promise(resolve=>server.listen({ port: config.httpPort, host:'0.0.0.0' }, ()=>resolve(true)));
		setlog(`Started HTTP service on port ${config.httpPort}. ${+new Date()-time}ms`);

		return app;
	} catch (error) {
		setlog("init", error);
		process.exit(1);
	}
})
