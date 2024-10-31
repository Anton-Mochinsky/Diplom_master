import {FC} from "react";
import {IUserInfo} from "../AuthWrapper/auth_types";

import deleteIcon from "../../images/close.svg";
import adminIcon from "../../images/admin.svg";
import goIcon from "../../images/share.svg";



interface IProps  {
				user_info: IUserInfo;
				onDelete?:(val:IUserInfo)=> void
				onShowFiles?:(val:IUserInfo)=> void
				onSetAdmin?:(val:IUserInfo, is_staff:boolean)=> void
}
export const UserRow:FC<IProps> = ({user_info, onDelete,onSetAdmin, onShowFiles}) =>{
				const onDeleteEvent = () => {
								if (!window.confirm(`Вы действительно хотите  удалить пользователя ${user_info.username} ?`)) return
								if (onDelete) onDelete(user_info)
				}

				const onSetAdminEvent = () => {
								if (!window.confirm(`Вы действительно хотите сменить административные права у пользователя ${user_info.username} ?`)) return
								if (onSetAdmin) onSetAdmin(user_info, !user_info.is_staff)
				}
				const onShowFilesEvent = () => {
								if (onShowFiles) onShowFiles(user_info)
				}
				return (
					<tr className="file-row">
									<td className="file-row-name">{user_info.username}</td>
									<td className="file-row-name">{user_info.first_name + user_info.last_name}</td>
									<td className="file-row-name">{user_info.email}</td>
									<td className="align-center">{user_info.count_files} </td>
									<td className="align-center">{user_info.total_size? Math.round(user_info.total_size/1024).toFixed(1) : 0} Kb</td>
									<td className="file-row-admin">{user_info.is_staff ? 'да' : 'нет'}</td>
									<td className="file-row-actions-td">
													<div className="file-row-actions user-row-actions">
																	<div className="file-row-delete" onClick={onDeleteEvent}><img title='Удалить' src={deleteIcon} alt="del"/></div>
																	<div className="file-row-rename" onClick={onSetAdminEvent}><img title='Сделать админов/убрать из админов' src={adminIcon} alt="edit"/></div>
																	<div className="file-row-rename" onClick={onShowFilesEvent}><img title='Перейти к файлам пользователя' src={goIcon} alt="edit"/></div>

													</div>
									</td>
					</tr>
				)
}