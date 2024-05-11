import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

export const handler = async (event: { body: string }) => {
  try {
    if (!process.env.BUCKET_NAME)
      throw new Error("Missing environment variable BUCKET_NAME");

    const body = JSON.parse(event.body);
    const fileName = body.fileName as string | undefined;

    if (!fileName) throw new Error("fileName is required in the body");

    const signedUrlCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
    });

    const urlOptions = { expiresIn: 60 };
    const signedUrl = await getSignedUrl(
      s3Client,
      signedUrlCommand,
      urlOptions
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl: signedUrl }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Failed to generate pre-signed URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to generate pre-signed URL" }),
    };
  }
};
