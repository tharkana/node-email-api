import { Email } from './../../model/emailModel';
import { Constants } from './../../config/constant';
import { HTTP400Error } from './../../utils/httpErrors';
import { SendGridEmailProvider } from './providers/SendGridEmailProvider';
import { EmailProvider } from './providers/EmailProviderInterface';
import moment = require('moment');
import EmailModel from '../../model/emailModel';

export class EmailController {

    //TODOTK: Replace this with DI system. Can use awilix
    private static emailClient: EmailProvider = new SendGridEmailProvider();
    private static emailModel: EmailModel = new EmailModel();

    constructor() {
        // this.emailClient = new SendGridEmailProvider();
    }

    static async sendEmail(to: string, subject: string, body: string): Promise<Email> {

        const SYDNEY_UTC_OFFSET = 660;

        let now = moment().utcOffset(SYDNEY_UTC_OFFSET);

        let morning = moment([now.year(), now.month(), now.date(), 8, 0, 0]);
        let evening = moment([now.year(), now.month(), now.date(), 17, 0, 0]);

        let emailObject: Email = this.emailModel.create({ to, subject, body, status: Constants.EMAIL_STATUS.QUEUED });

        if (now.diff(morning) > 0 && evening.diff(now) > 0) {
            
            try {
                emailObject = await EmailController.sendAndUpdateDb(emailObject);
            } catch (error) {
                emailObject.status = Constants.EMAIL_STATUS.FAILED;
                console.error(error);
            }

            return { ...emailObject };
        } else {
            // Send it later
            // let tomorrow = morning.add(1, 'day');
            return { ...emailObject };
            // return this.emailClient.send(to, subject, body);
        }

    }

    static async resendQueuedEmails() {

        console.info("Send Queued Emails");

        let resendEmailList = this.emailModel.findByStatus(Constants.EMAIL_STATUS.QUEUED);

        if (resendEmailList && resendEmailList.length > 0) {

            let promises : any = [];

            resendEmailList.forEach(email => {
                promises.push(EmailController.sendAndUpdateDb(email));
            });

            //TODOTK: Make this synchronous and use events/pub sub system to update the consumer.
            return Promise.all(promises);

        } else {
            // If there are no queued emails
            return Promise.resolve(undefined);
        }
    }

    private static async sendAndUpdateDb(email: Email) {

        if (email && email.status == Constants.EMAIL_STATUS.QUEUED) {
            let updatedEmail = await EmailController.send(email);

            try {
                updatedEmail = this.emailModel.update(updatedEmail);
            } catch (error) {
                //TODOTK: If the save failed what should be the output. Since the email is already sent should we assume this is sent..? 
                //NOTE: Assuming if DB failed email action also failed.
                updatedEmail.status = updatedEmail.status == Constants.EMAIL_STATUS.SENT ? Constants.EMAIL_STATUS.SENT : Constants.EMAIL_STATUS.FAILED;
                console.error(error);
            }

            return updatedEmail;
        }

        return email;

    }

    private static async send(email: Email) {
        let status;
        let { to, subject, body } = email;
        console.info(`Email: ${to} Subject: ${subject} body: ${body}`);
        try {
            let response = await this.emailClient.send(to, subject, body);
            status = response ? Constants.EMAIL_STATUS.SENT : Constants.EMAIL_STATUS.FAILED;
        } catch (error) {
            status = Constants.EMAIL_STATUS.FAILED;
            console.error(error);
        }

        let returnObj = { ...email };
        returnObj.status = status;

        return returnObj;

    }

    static getEmail(id: string) {

        return id ? this.emailModel.findOne(id) : undefined;
    }

    static deleteEmail(id: string) {
        if (id) {
            let deletedEmail = this.emailModel.delete(id);
            if (deletedEmail) {
                return deletedEmail;
            } else {
                return undefined;
            }

        } else {
            return undefined;
        }
    }
}