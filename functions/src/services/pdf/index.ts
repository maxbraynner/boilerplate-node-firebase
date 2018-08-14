'use strict';

import * as pdf from "html-pdf";
import * as ejs from "ejs";
import { Stream } from "stream";
import TemplatePDF from "../../enums/templates";
import * as admin from "firebase-admin";
import * as QRCode from 'qrcode';


// imagens do cabeçalho e rodapé devem estar em base64
const assets = require("./templates/components/assets.json");

export class RenderPdf {

    private path: string;

    constructor() {
        this.path = `${__dirname}/templates/`
    }

    /**
     * Return a URL to PDF or create it and return a URL
     * @param data
     * @param filePath caminho no Storage (Firebase)  
     * @param template 
     */
    async getURL(data, filePath: string, template: TemplatePDF) {
        //get the bucket
        const bucket = admin.storage().bucket();

        const file = bucket.file(`${filePath}.pdf`);

        return this.createFile(file, data, template);

        //check if file exists
        const exists = await file.exists();

        let url;
        if (exists[0]) {
            // if exists: return the url
            url = await this.createUrl(file);
        } else {
            // if not exists: create the file and url
            url = await this.createFile(file, data, template);
        }

        return url;
    }

    /**
     * Create the PDF and return the URL
     * @param file 
     * @param data 
     */
    private createFile(file, data, template: TemplatePDF) {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await this.toStream(template, data);

                stream.pipe(file.createWriteStream())
                    .on('error', err => reject(err))
                    .on('finish', () => {
                        resolve(this.createUrl(file));
                    });
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * Create a URL to access the PDF
     * @param file 
     */
    private async createUrl(file) {
        // date for the token
        const date = new Date();
        date.setDate(date.getDate() + 1);

        const url = await file.getSignedUrl({ action: 'read', expires: date.toDateString() });

        return url;
    }

    /**
     * Render a template and return the stream
     * @param template 
     * @param data 
     */
    public toStream(template: string, data: any): Promise<Stream> {

        return new Promise(async (resolve, reject) => {
            // create a qrcode
            assets.qrcode = await QRCode.toDataURL(data.id)
                .catch(err => reject(err));

            ejs.renderFile(this.path + template, { data, assets }, (errEjs, html) => {
                if (errEjs) {
                    reject(errEjs);
                }

                const options = {
                    width: "612px",
                    height: "858px",
                    footer: {
                        "height": "55mm",
                    }
                }

                pdf.create(html, options).toStream((errPdf, stream) => {
                    if (errPdf) {
                        reject(errPdf);
                    }
                    resolve(stream);
                });
            })
        })
    }
}

function init() {
    return new RenderPdf();
}

export default init;