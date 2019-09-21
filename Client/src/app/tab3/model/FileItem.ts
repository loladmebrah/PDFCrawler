import { File_ } from './File';

export interface FileItem {
    category: String;
    file: File_;
    name: String;
    isDownloadable: Boolean;
    imgSrc: String;
    imgHeight: Number;
 }