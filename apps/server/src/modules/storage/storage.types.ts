export type UploadFileData = {
    data: Buffer;
    contentType: string;
}

export type UploadFileResult = {
    ressourceUrl: string;
}

export type DownloadFileResult = {
    data: Buffer;
    contentType: string;
}

export type GetStreamResult = {
    stream: ReadableStream;
    contentType: string;
}
