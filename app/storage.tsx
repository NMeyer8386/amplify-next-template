// src/lib/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, fetchUserAttributes} from '@aws-amplify/auth'
import { list, getUrl } from "@aws-amplify/storage";

const REGION = "ca-central-1";           // your bucket’s region
const BUCKET = "my-app-docs";            // your single bucket name
const PREFIX = "private";                // assuming you’re using a private/<userId>/… prefix

async function getS3Client() {
    const { credentials } = await fetchAuthSession();
    if (!credentials) {
      throw new Error("No AWS credentials available");
    }
    return new S3Client({
      region: REGION,
      credentials: {
        accessKeyId:     credentials.accessKeyId!,
        secretAccessKey: credentials.secretAccessKey!,
        sessionToken:    credentials.sessionToken,
      },
    });
  }

const checkAttributeVerification = async () => {
    const attributes = await fetchUserAttributes();

    const emailVerified = isTruthyString(attributes.email_verified);
    const phoneVerified = isTruthyString(attributes.phone_number_verified);
  }
  
const isTruthyString = (value:string | undefined) => {
return (
    value && typeof value.toLowerCase === 'function' && value.toLowerCase() === 'true'
);
}

/**
 * List all files under private/<identityId>/
 */
export async function listMyFiles(): Promise<string[]> {

    const {identityId} = await fetchAuthSession();
    if (!identityId){
        throw new Error("Not signed in");
    }
    const client     = await getS3Client();

    const cmd = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: `${PREFIX}/${identityId}/`
    });
    const resp = await client.send(cmd);
    return (resp.Contents ?? []).map(o => o.Key!.replace(`${PREFIX}/${identityId}/`, ""));
    }

/**
 * Download a user’s file as a Blob
 */
export async function downloadMyFile(key: string): Promise<Blob> {
    const { identityId } = await fetchAuthSession();
    if (!identityId) {
      throw new Error('Not signed in');
    }
    const client = await getS3Client();
    const cmd = new GetObjectCommand({
      Bucket: BUCKET,
      Key: `${PREFIX}/${identityId}/${key}`
    });
    const url = await getSignedUrl(client, cmd, { expiresIn: 300 });
    const res = await fetch(url);
    return res.blob();
  }

/**
 * Upload (or overwrite) a Blob under private/<identityId>/<key>
 */
export async function uploadMyFile(key: string, file: Blob): Promise<void> {
    const { identityId } = await fetchAuthSession();
    if (!identityId) {
      throw new Error('Not signed in');
    }
    const client = await getS3Client();
    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${PREFIX}/${identityId}/${key}`,
      Body: file,
      ContentType: file.type
    });
    await client.send(cmd);
  }

export async function listObjectsFromS3(){
    try {
        const result = await list({
            path: 'public/',
            options: {
                listAll: true
            }
        });
    } catch (error){
        console.log(error);
    }
}

export async function getFileLinks(fileName : string){
    const getUrlResult = await getUrl({
        path: `public/${fileName}`,
        options: {
            validateObjectExistence: true
        }
    });
    console.log('signed URL: ', getUrlResult.url);
    console.log('URL expires at: ', getUrlResult.expiresAt);
}
