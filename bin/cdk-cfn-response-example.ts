#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CdkCfnResponseExample } from '../lib/cdk-cdn-response-example-stack';

const app = new cdk.App();
new CdkCfnResponseExample(app, 'CdkParcelLambdaExampleStack');
