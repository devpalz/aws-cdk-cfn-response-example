import AWS = require('aws-sdk');
import { Callback, CloudFormationCustomResourceEvent, Context } from "aws-lambda";
import { CfnResponse } from './cfn-response';

export interface MyFirstLambdaResponse {
    message: string
}

export interface MyFirstLambdaRequest {
    id: string
}

export const handler = async (event: CloudFormationCustomResourceEvent, context: Context, callback?: Callback): Promise<void> => {

    console.log("Recieved event", event)

    const ec2 = new AWS.EC2();

    const describeResponse = await ec2.describeInstances().promise()

    if (describeResponse.Reservations) {

        const response: MyFirstLambdaResponse = {
            message: `I described and you have ${describeResponse.Reservations.length} EC2 Instance`
        }

        CfnResponse.submitResponse(CfnResponse.SUCCESS, event, context, { data: response })
    } else {
        CfnResponse.submitResponse(CfnResponse.FAILED, event, context)
    }
}