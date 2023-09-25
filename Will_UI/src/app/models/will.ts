export interface Will {
    userId: string;
    id: number;
    messageContent: string;
    filePath: string;
    fileName: string;
    image: File;
    PublishDate: string;

}

export interface WillUpdate {
    messageContent: string;
}