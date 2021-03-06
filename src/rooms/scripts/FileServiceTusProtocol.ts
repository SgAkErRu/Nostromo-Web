import { FileServiceConstants, FileServiceRequest, HttpMethod, IncomingHttpHeaders } from "nostromo-shared/types/FileServiceTypes";
import { Buffer } from "buffer/";

export class TusHeadRequest implements FileServiceRequest
{
    public method: HttpMethod = "HEAD";
    public path: string = FileServiceConstants.FILES_ROUTE;
    public headers: IncomingHttpHeaders = {
        "Tus-Resumable": FileServiceConstants.TUS_VERSION
    };
    public badTusVersionStatusCode = 412;
    public notFoundStatusCode = 404;
    public notOwnerStatusCode = 403;
    public successfulStatusCode = 204;

    constructor(fileId: string)
    {
        this.path += `/${fileId}`;
    }
}

export class TusPatchRequest implements FileServiceRequest
{
    public method: HttpMethod = "PATCH";
    public path: string = FileServiceConstants.FILES_ROUTE;
    public headers: IncomingHttpHeaders = {
        "Tus-Resumable": FileServiceConstants.TUS_VERSION,
        "Content-Type": "application/offset+octet-stream"
    };
    public badTusVersionStatusCode = 412;
    public notFoundStatusCode = 404;
    public notOwnerStatusCode = 403;
    public wrongMediaTypeStatusCode = 415;
    public wrongOffsetStatusCode = 409;
    public lengthRequiredStatusCode = 411;
    public wrongContentLengthStatusCode = 400;
    public successfulStatusCode = 204;
    constructor(fileId: string, uploadOffset: string)
    {
        this.path += `/${fileId}`;
        this.headers["Upload-Offset"] = uploadOffset;
    }
}

export class TusOptionsRequest implements FileServiceRequest
{
    public method: HttpMethod = "OPTIONS";
    public path: string = FileServiceConstants.FILES_ROUTE;
    public successfulStatusCode = 204;
}

export class TusPostCreationRequest implements FileServiceRequest
{
    public method: HttpMethod = "POST";
    public path: string = FileServiceConstants.FILES_ROUTE;
    public headers: IncomingHttpHeaders = {
        "Tus-Resumable": FileServiceConstants.TUS_VERSION
    };
    public badTusVersionStatusCode = 412;
    public badUploadLentghStatusCode = 400;
    public tooLargeFileStatusCode = 413;
    public successfulStatusCode = 201;
    constructor(filename: string, filetype: string, uploadLength: number, roomId: string)
    {
        const filenameBase64 = Buffer.from(filename, "utf-8").toString("base64");
        const filetypeBase64 = Buffer.from(filetype, "utf-8").toString("base64");

        this.headers["Upload-Length"] = String(uploadLength);
        this.headers["Upload-Metadata"] = `filename ${filenameBase64},filetype ${filetypeBase64}`;
        this.headers["Room-Id"] = roomId;
    }
}