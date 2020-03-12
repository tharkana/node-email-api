import { HTTP404Error, HTTP400Error } from '../../utils/httpErrors';
import { EmailController } from './EmailController';
import { Request, Response } from "express";

export default [
	{
		path: "/api/v1/email",
		method: "post",
		handler: async (req: Request, res: Response) => {

			let { to, content, subject } = req.body;

			if (!to && !subject && !content) {
				throw new HTTP400Error("Email Should have body");
			}

			const result = await EmailController.sendEmail(to, subject, content);
			let respond = {
				id : result.uid,
				status : result.status
			};
			res.send(respond);
		}
	},
	{
		path: "/api/v1/email/:id",
		method: "get",
		handler: async (req: Request, res: Response) => {

			let email = EmailController.getEmail(req.params.id);

			if (email) {
				let respond = {
					id: email.uid,
					status: email.status
				};
				res.send(respond);
			} else {
				throw new HTTP404Error("Email Not found");
			}

		}
	},
	{
		path: "/api/v1/email/:id",
		method: "delete",
		handler: async (req: Request, res: Response) => {

			let email = EmailController.deleteEmail(req.params.id);

			//TODOTK: Think of a time where deleted goes as false;
			if (email) {
				let respond = {
					id: email.uid,
					deleted: true,
				};
				res.send(respond);
			} else {
				throw new HTTP404Error("Email not found")
			}

		}
	}

];