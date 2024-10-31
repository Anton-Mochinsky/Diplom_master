import {FilesActionTypes, FilesState} from "./files_types";

let initialState: FilesState = {
				authenticated: false,
				driver_id: "",
				full_name: "",


				current_coordinates: null,
				has_tracker: '',
}

const userReducer = (state = initialState, action: FilesActionTypes): FilesState => {
				switch (action.type) {
								// case SET_AUTHENTICATED:
								// 				action.authenticated ? setCookie("driver_id", action.driver_id, 100) : setCookie("driver_id", "", 0);
								// 				return {
								// 								...state,
								// 								authenticated: action.authenticated,
								// 								driver_id: action.driver_id,
								// 								full_name: action.full_name,
								// 				}
								// case SET_STATUS:
								// 				return {
								// 								...state,
								// 								status: action.status
								// 				}
								// case SET_USER_INFO:
								// 				let data = action.data;
								// 				if (!data.drivers) data.drivers = [];
								// 				if (!data.cars) data.cars = [];
								// 				if (!data.hasOwnProperty('multiple_car_owner')) data.multiple_car_owner = data.cars.length > 1 || data.drivers.length > 1;
								// 				if (!data.hasOwnProperty('type')) data.type = EnumUserTinType.SELF_EMPLOYED;
								// 				if (!data.recommendations) data.recommendations = [];
								//
								// 				return {
								// 								...state,
								// 								data: data,
								// 								full_name: action.data && action.data.passport?  action.data.passport.full_name : '',
								// 								driver_id: action.data && action.data.driver_id?  action.data.driver_id : state.driver_id,
								// 				}
								//
								// case LOG_OUT:
								// 				return {
								// 								...state,
								// 								authenticated: false,
								// 								driver_id: '',
								// 								full_name: '',
								// 								status: UserStatus.Unauthenticated
								// 				}
								//
								// case SET_USER_TRACKER:
								// 				return {
								// 								...state,
								// 								has_tracker: action.has_tracker
								// 				}
								//
								// case SET_CURRENT_COORDINATE:
								// 				return {
								// 								...state,
								// 								current_coordinates: action.current_coordinates
								// 				}
								default:
												return state;
				}
}


export default userReducer;