import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

export async function deleteFromS3(keys = []) {
  if (!keys.length) return;

  const validKeys = keys.filter(Boolean);

  if (!validKeys.length) return;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Delete: {
      Objects: validKeys.map((Key) => ({ Key })),
      Quiet: false,
    },
  };

  await s3.send(new DeleteObjectsCommand(params));
}

export function extractKeyFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.slice(1);
  } catch {
    return null;
  }
}
