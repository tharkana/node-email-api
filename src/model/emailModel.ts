import moment from 'moment';
import uuid from 'uuid';

export interface Email {
    uid?: string;
    to: string;
    body: string;
    subject: string;
    status: string;
    createdDate?: number;
    modifiedDate?: number;
}

export default class EmailModel {

    emailList: Array<Email>;


    constructor() {
        this.emailList = [{ uid: '123', to: 'tharkana.infor@gmail.com', body: "test", subject: "yellow", status: 'SENT' },
        { uid: '213', to: 'tharkana.infor@gmail.com', body: "test", subject: "yellow", status: 'QUEUED' }
    
            ];
    }

    create(email: Email) {
        const newEmail: Email = {
            uid: uuid.v4(),
            to: email.to,
            body: email.body,
            subject: email.subject,
            status: email.status,
            createdDate: moment.now(),
            modifiedDate: moment.now()
        };
        this.emailList.push(newEmail);
        return newEmail
    }

    findOne(uid: string) {
        return this.emailList.find(email => email.uid === uid);
    }

    findAll() {
        return this.emailList;
    }

    findByStatus(status: string) {
        return this.emailList.filter((email) => email.status == status);
    }

    update(data: Email) {
        if (data && data.uid) {
            const email = this.findOne(data.uid);
            if (email) {
                const index = this.emailList.indexOf(email);
                this.emailList[index].body = data.body || email.body;
                this.emailList[index].to = data.to || email.to;
                this.emailList[index].subject = data.subject || email.subject;
                this.emailList[index].status = data.status || email.status;
                this.emailList[index].modifiedDate = moment.now()
                return this.emailList[index];
            } else {
                throw new Error("record not found");
            }
        } else {
            throw new Error('Should Provide uid in Email object');
        }
    }

    delete(id: string) {
        const email = this.findOne(id);
        if (email) {
            const index = this.emailList.indexOf(email);
            this.emailList.splice(index, 1);
            return email;
        } else {
            return undefined;
        }
    }
}