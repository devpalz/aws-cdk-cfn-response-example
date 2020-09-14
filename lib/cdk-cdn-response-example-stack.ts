import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';

export class CdkCfnResponseExample extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const exampleLambda = new NodejsFunction(this, 'MyFunction', {
      entry: 'lambdas/my-first-lambda.js',
      minify: true,
      runtime: Runtime.NODEJS_12_X
    });

    exampleLambda.addToRolePolicy(new PolicyStatement(
      {
        actions: ['ec2:DescribeInstances'],
        resources: ['*']
      })
    )
  }
}
