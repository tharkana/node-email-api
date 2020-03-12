import { EmailController } from '../services/email/EmailController';

import {Range, RecurrenceRule, scheduleJob} from 'node-schedule';

export class EmailScheduler {

    private static readonly RECURENCE_RULE = "0 0 8 * * 1-5";

    static start(){

        console.info("Crone Job Triggered");

        // let job = scheduleJob(EmailScheduler.RECURENCE, (date) => {
        let job = scheduleJob(EmailScheduler.RECURENCE_RULE, (date) => {
            console.info("Cron Job started");
            EmailController.resendQueuedEmails()
                .then((data) => {
                    if(data && data.length > 0){
                        console.log("Emails sent");
                        console.debug(data);
                    }
                })
                .catch((errpr) => {
                    //TODOTK: Write these to a file. To refer later 
                    console.log("Something went wrong in cron job");
                    console.log("Error: " + JSON.stringify(errpr));
                });
        });

        

    }

}