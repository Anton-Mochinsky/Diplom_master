export const SET_FILE_LIST = 'SET_FILE_LIST';



export class FileInfo {
				id="";
				driver_id="";
				TIN = "";
				draft = true;
				// type : EnumUserTinType = EnumUserTinType.NON_LEGAL;
				// multiple_car_owner : boolean = false;
				// person = { full_name :"", phone_number:"", email :"" };
				// banking : BankingInfo = new BankingInfo();
				// passport : PassportInfo = new PassportInfo();
				// cars : VehicleInfo[] = [];
				// recommendations : RecommendationsInfo[]  = [];
				// accept_agreement : boolean = false;
				// drivers: DriverInfo[] = [];
				// msv?: boolean = true;
}

export interface FilesState {
				authenticated: boolean;
				driver_id: string;
				full_name: string;
				current_coordinates : {lon:number,lat:number} | null,
				has_tracker: string,
}

export interface SetFileListAction {
			 type: typeof SET_FILE_LIST
				file_list: string[];

}

// export type UserActionTypes = SetAuthenticatedAction | SetStatusAction | SetUserInfoAction | LogOutAction | SetCurrentCoordinateAction | SetUserTrackerAction;
export type FilesActionTypes = SetFileListAction ;