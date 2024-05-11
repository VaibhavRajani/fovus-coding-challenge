import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";

const dynamoDBClient = new DynamoDBClient({});

export const handler = async (event: {
  body: string;
}): Promise<{ statusCode: number; body: string; headers: unknown }> => {
  const { TABLE_NAME, BUCKET_NAME } = process.env;

  if (!TABLE_NAME || !BUCKET_NAME) {
    throw new Error("Required environment variables are missing");
  }

  const parsedBody = JSON.parse(event.body);
  const textInput = parsedBody.textInput as string | undefined;
  const inputFilePath = parsedBody.InputFilePath as string | undefined;

  if (!textInput || !inputFilePath) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "textInput and InputFilePath are required",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  const uniqueId = nanoid();
  const putCommand = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      id: { S: uniqueId },
      textInput: { S: textInput },
      InputFilePath: { S: `${BUCKET_NAME}/${inputFilePath}` },
    },
  });

  await dynamoDBClient.send(putCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Data successfully added to DynamoDB",
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
