import {
    DetectModerationLabelsCommand,
    DetectModerationLabelsCommandOutput,
    RekognitionClient
} from "@aws-sdk/client-rekognition";

import { DefinedErrorCodes, ValidationError } from "errors";
import { CheckImageContentOpts } from "services";

/**
 * Service used to interact with AWS Rekgonition
 *
 * @see [AWS Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html)
 * @see [Developer Guide](https://docs.aws.amazon.com/rekognition/latest/APIReference/Welcome.html)
 */
class AwsRekognition {
    private client: RekognitionClient;

    constructor() {
        this.client = new RekognitionClient({
            credentials: {
                accessKeyId: process?.env?.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process?.env?.AWS_SECRET_KEY || ""
            },
            region: process?.env?.AWS_REKOGNITION_REGION || ""
        });
    }

    /**
     * Returns any moderation data detected by AWS Rekognition
     *
     * @param opts Parameters to pass to AWS
     * @returns Moderation label data
     */
    public async getImageModerationLabels(
        opts: CheckImageContentOpts
    ): Promise<DetectModerationLabelsCommandOutput> {
        try {
            const { Bytes, MinConfidence = 55 } = opts;

            return await this.client.send(
                new DetectModerationLabelsCommand({
                    Image: { Bytes },
                    MinConfidence
                })
            );
        } catch (error) {
            throw new ValidationError(DefinedErrorCodes.KMPW0019, [
                error?.message || ""
            ]).setErrorCode("KMPW0019");
        }
    }

    /**
     * Returns whether or not the service is active within the application
     *
     * @returns `true` if it is active, `false` if not
     */
    public static isServiceActive(): boolean {
        return Boolean(parseInt(process?.env?.AWS_REKOGNITION));
    }
}

export default AwsRekognition;
export { AwsRekognition };
