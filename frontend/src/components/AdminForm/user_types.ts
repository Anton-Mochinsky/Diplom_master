import {IUserInfo} from "../AuthWrapper/auth_types";



export interface IResponseUserList{
				count: number,
				total_pages: number,
				prev?: number,
				next?: number,
				results: IUserInfo[]
}