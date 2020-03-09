
import { SendGridEmailProvider } from './SendGridEmailProvider';
import sgMail = require("@sendgrid/mail");


// jest.mock("@sendgrid/mail");

describe("Send Grid Email Provider", () => {
    test("an empty query string", async () => {

        const mock = jest.spyOn(sgMail, 'send');
        mock.mockReturnValue(Promise.resolve(<any> true ));

        let provider = new SendGridEmailProvider();
        const result = await provider.send("test@test.com", "Example Subj", "Example Body");
        expect(result).toEqual(false);
    });
});