export interface EmailProvider {
    send(to:string, subject:string, body:string, options?:{[key:string]:any}):Promise<boolean>;
}