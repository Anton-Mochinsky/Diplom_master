
import {FilesState, SET_FILE_LIST, SetFileListAction} from "./files_types";

export const setFileList = (  file_list  : string[]): SetFileListAction => ({
				type: SET_FILE_LIST,
				file_list:file_list
});