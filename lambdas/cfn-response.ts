import { CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse, Context } from "aws-lambda";
import https = require("https");
import url = require("url");

export interface CloudFormationResponseOptions {

    /**
     * Provide a human readable reason for the 'SUCCESS' or 'FAILED' status.
     * 
     * @default to the value of status
     */
    readonly reason?: string

    /**
     * Indicates whether to mask the output of the custom resource when retrieved by using the Fn::GetAtt function.
     * If set to true, all returned values are masked with asterisks (*****), except for those stored in the Metadata section of the template. 
     * CloudFormation does not transform, modify, or redact any information you include in the Metadata section.
     * 
     * @default false
     */
    readonly noEcho?: boolean

    /**
     * The custom resource provider-defined name-value pairs to send with the response.
     * You can access the values provided here by name in the template with Fn::GetAtt.
     * 
     * @optional
     */
    readonly data?: any
}

export type CfnResponseStatus = "SUCCESS" | "FAILED";


export class CfnResponse {

    public static readonly SUCCESS: CfnResponseStatus = "SUCCESS";
    public static readonly FAILED: CfnResponseStatus = "FAILED";


    public static submitResponse(status: 'SUCCESS' | 'FAILED', event: CloudFormationCustomResourceEvent, context: Context, opts: CloudFormationResponseOptions = {}) {

        const json: CloudFormationCustomResourceResponse = {
            Status: status,
            Reason: opts.reason || status,
            StackId: event.StackId,
            RequestId: event.RequestId,
            PhysicalResourceId: context.logStreamName,
            LogicalResourceId: event.LogicalResourceId,
            NoEcho: opts.noEcho,
            Data: opts.data,
        };

        console.log('Submitted response to cloudformation', json);

        const responseBody = JSON.stringify(json);

        const parsedUrl = url.parse(event.ResponseURL);
        const options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "PUT",
            headers: {
                "content-type": "",
                "content-length": responseBody.length,
            },
        };

        return new Promise((resolve, reject) => {
            try {
                const request = https.request(options, resolve);
                request.on('error', reject);
                request.write(responseBody);
                request.end();
            } catch (e) {
                reject(e);
            }
        });

    }

}



