import {
  EC2Client,
  RunInstancesCommand,
  RunInstancesCommandInput,
} from "@aws-sdk/client-ec2";
import { DynamoDBStreamEvent } from "aws-lambda";
import { encode } from "js-base64";
import { nanoid } from "nanoid";

const ec2Client = new EC2Client({});

export const handler = async (event: DynamoDBStreamEvent) => {
  try {
    const tableName = process.env.TABLE_NAME;
    const fileBucketName = process.env.FILE_BUCKET_NAME;
    const scriptsBucketName = process.env.SCRIPTS_BUCKET_NAME;
    const instanceProfileVarName = process.env.INSTANCE_PROFILE_VAR_NAME;
    if (
      tableName === undefined ||
      fileBucketName === undefined ||
      scriptsBucketName === undefined ||
      instanceProfileVarName === undefined
    ) {
      throw new Error("Missing environment variable");
    }

    const scriptUri = `${scriptsBucketName}/task.sh`;

    const record = event.Records[0];
    if (record["eventName"] == "INSERT") {
      const new_id = nanoid();
      const original_id = record.dynamodb!.NewImage!.id.S;
      const textInput = record.dynamodb!.NewImage!.textInput.S;
      const InputFilePath = record.dynamodb!.NewImage!.InputFilePath.S;
      if (InputFilePath === undefined || textInput === undefined) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Programatically added by ec2" }),
        };
      }
      /* CHANGED FLOW ACCORDING TO REQUIREMENTS FOR textInput / fileInput. GETTING DATA FROM DYNAMODB FROM SCRIPT AS REQUESTED */

      const input = {
        ImageId: "ami-0ddda618e961f2270", // Amazon Linux 2023
        InstanceType: "t2.micro",
        MaxCount: 1,
        MinCount: 1,
        InstanceInitiatedShutdownBehavior: "terminate",
        IamInstanceProfile: {
          Name: instanceProfileVarName,
        },
        UserData: encode(
          `#!/bin/bash\naws s3 cp "s3://${scriptUri}" task.sh\nbash task.sh ${original_id} ${tableName} ${new_id}\nshutdown -h now`
        ),
      } as RunInstancesCommandInput;

      const command = new RunInstancesCommand(input);
      const response = await ec2Client.send(command);

      console.log("Response", response);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: response }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Wrong DB Action" }),
    };
  } catch (error) {
    console.error("Error running EC2 instance:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error running EC2 instance" }),
    };
  }
};
