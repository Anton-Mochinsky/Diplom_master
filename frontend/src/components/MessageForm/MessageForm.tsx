import {FC} from "react";
import {useDispatch} from "react-redux";

import './MessageForm.css'

import {IWindowMessage, WindowMessageType} from "../../redux/reducers/system/system_types";
import {hideMessageWindow} from "../../redux/reducers/system/actions";

interface IProps{message:IWindowMessage}
export const MessageForm: FC<IProps> = ({message}) =>{
				const dispatch = useDispatch();

			 const onClose = () => {
							 hideMessageWindow(dispatch)
			 }
				return(
					<div className={"message-container " + (WindowMessageType[message.type])}>
									<div className="overlay"></div>
									<div className="message-window">
													<div className="message-text" dangerouslySetInnerHTML={{__html:message.text}}></div>
													<div className="button" onClick={onClose}>Закрыть</div>
									</div>
					</div>
				)
}