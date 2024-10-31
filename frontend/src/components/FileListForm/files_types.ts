
export interface IFileInfo {
				id: string,
				file_name: string,
				file_size: number,
				description: string,
				count_download: number,
				downloaded: string,
				created: string,
				modified: string
}


export interface IPagination{
				count: number,
				total_pages: number,
				prev?: number,
				next?: number,
}
export interface IResponseFileList{
				count: number,
				total_pages: number,
				prev?: number,
				next?: number,
				results: IFileInfo[]
}