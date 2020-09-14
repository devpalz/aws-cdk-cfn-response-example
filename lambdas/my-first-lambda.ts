import AWS = require('aws-sdk');

export interface MyFirstLambdaResponse {
    message: string
}

export interface MyFirstLambdaRequest {
    id: string
}

export const handler = async (request: MyFirstLambdaRequest): Promise<MyFirstLambdaResponse> => {

    console.log("Recieved request", request)

    const ec2 = new AWS.EC2();

    const describeResponse = await ec2.describeInstances().promise()

    if (describeResponse.Reservations) {
        return { message: `Response was... ${JSON.stringify(describeResponse.Reservations)}` }
    } else {
        return { message: 'Nothing to report here!' }
    }
}