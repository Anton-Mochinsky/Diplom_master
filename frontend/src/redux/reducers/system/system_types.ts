export const SET_WINDOW_MESSAGE = 'SET_WINDOW_MESSAGE';


export enum EnumWindowMessageType {
				None=0,Error,Warning,Info
}
interface IKey {
				[key: string]: string
}
export const WindowMessageType:IKey = {
				0:'',
				1:'error',
				2:'warning',
				3:'info',

}
export interface ShowWindowMessageAction {
				type: typeof SET_WINDOW_MESSAGE;
				window_message: {type:EnumWindowMessageType, text :string} | null;
}

export interface IWindowMessage {
	type:EnumWindowMessageType;
	text :string
}
export interface SystemState {
				window_message: IWindowMessage | null;
}

export type SystemActionTypes = ShowWindowMessageAction;