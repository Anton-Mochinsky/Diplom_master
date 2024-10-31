import {EnumWindowMessageType, SET_WINDOW_MESSAGE, ShowWindowMessageAction} from "./system_types";

export const showWindowMessage = ( msg : {type: EnumWindowMessageType, text:string} | null): ShowWindowMessageAction => ({
				type: SET_WINDOW_MESSAGE,
				window_message: msg
});

export const  showMessageError = (text:string, dispatch:any) => dispatch(showWindowMessage({type:EnumWindowMessageType.Error, text:text}));
export const  showMessageInfo = (text:string, dispatch:any) => dispatch(showWindowMessage({type:EnumWindowMessageType.Info, text:text}));
export const  hideMessageWindow = (dispatch:any) => dispatch(showWindowMessage(null));
