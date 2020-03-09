import { Constants } from './../../../config/constant';
import { EmailProvider } from './EmailProviderInterface';
import { SendGridError } from './../../../utils/httpErrors';

import sgMail = require("@sendgrid/mail");

import dotenv from "dotenv";


dotenv.config();


export class SendGridEmailProvider implements EmailProvider {


    constructor() {
        const key = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '';
        sgMail.setApiKey(key);

    }


    send(to:string, subject:string, body:string, options?:{[key:string]:any}):Promise<boolean>{

       
        const msg = <any> {
            to: to,
            from: Constants.FROM_EMAIL,
            subject: subject,
            text: body
        };

        //can't use this. We can't delete the email. Has limitation.
        if(options && options.send_at){
            msg.send_at = options.sendAt;
        }

        return sgMail.send(msg)
            .then((data) => {

                console.log(JSON.stringify(data));

                if(data && Array.isArray(data) && data.length > 0 && data[0].statusCode == 202){
                    return Promise.resolve(true);
                }else {
                    //TODOTK: Figure out what to do here
                    return Promise.resolve(false);
                }
            })
            .catch((error) => {
                //https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html
                throw new SendGridError(error);
            });
    }

}