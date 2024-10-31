import {SET_WINDOW_MESSAGE, SystemActionTypes, SystemState} from "./system_types";


const initialState: SystemState = {
				window_message: null
}

const systemReducer = (state = initialState, action: SystemActionTypes) => {
				switch (action.type) {
								case SET_WINDOW_MESSAGE:{
												return {
																...state,
																window_message: action.window_message
												}
								}
								default:
												return state;
				}
}

export default systemReducer;
