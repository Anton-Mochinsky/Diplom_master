import {FC, useEffect, useState} from "react";
import backIcon from "../../images/back.svg";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {AuthData} from "../AuthWrapper/AuthWrapper";
import {IUserInfo} from "../AuthWrapper/auth_types";
import {UserRow} from "./UserRow";
import {IFileInfo, IPagination, IResponseFileList} from "../FileListForm/files_types";
import {userAPI} from "../../api/api";
import {IResponseUserList} from "./user_types";
import {showMessageError, showMessageInfo} from "../../redux/reducers/system/actions";
import {getDataTextError, getStatusTextError, STATUS_200_OK} from "../../api/api_types";
import {FileListForm} from "../FileListForm/FileListForm";
import './AdminForm.css'

export const AdminForm: FC = () =>{
				const dispatch = useDispatch()
				const navigate = useNavigate()
				const {user} = AuthData();

				const [token, setToken] = useState<string>('')
				const [userList, setUserList] = useState<IUserInfo[]>([])
				const [pagination, setPagination] = useState<IPagination>({count:0, total_pages:0})
				const [selectedUserFileList, setSelectedUserFileList] = useState<IUserInfo|null>(null)
				const showErrorWindow = (error :{ data: any, status: number }) => {
								showMessageError(getStatusTextError(error.status + '') + getDataTextError(error.data), dispatch)
				}
				const  setSortedUserList = ( lst : IUserInfo[]) => {
								lst = lst.sort( (a,b) => a.username > b.username ? -1 : 1)
							 setUserList(lst.filter(x=>x.id != user.data?.id))

				}
				const loadTable = async (page:number, m_token: string)=>{
								userAPI.user_list(page, m_token)
								.then((data: IResponseUserList) => {
												console.log(data, data.results)
												setSortedUserList(data.results)
												setPagination({count: data.count, total_pages: data.total_pages, next: data.next, prev: data.prev})
								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				useEffect( ()=>{
								setSelectedUserFileList(null)
				}, [])

				useEffect( ()=>{
								if (user && user.data) {
												setToken(user.data.auth_token);
												loadTable(1, user.data.auth_token)
								}
				}, [user])
				const onBack = () => navigate("/")
				const onDelete = (user:IUserInfo) => {
								userAPI.delete_user(user.id+'', token)
								.then(response=> {
												let {data, status} = response;
												if (status == +STATUS_200_OK) {
																showMessageInfo("Пользователь успешно удален", dispatch)
																setSortedUserList([...userList.filter(x => x.id !== user.id)])
												} else
																showErrorWindow({data, status})

								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				const onSetAdmin = (user:IUserInfo, is_staff:boolean) => {
								userAPI.set_user_admin(user.id + '', is_staff,  token)
								.then(response=> {
												let {data, status} = response;
												if (status == +STATUS_200_OK) {
																showMessageInfo("Права успешно изменены", dispatch)
																user.is_staff = is_staff;
																setSortedUserList([...userList.filter(x => x.id !== user.id), user])
												} else
																showErrorWindow({data, status})

								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				const onHideFileList = () =>{
								setSelectedUserFileList(null)
				}
				const onShowFileList = (user:IUserInfo) =>{
								setSelectedUserFileList(user)
				}

				return(
					<>
							{
									selectedUserFileList ? <FileListForm viewedUser={selectedUserFileList} onBackView={onHideFileList}/> :
										<div className="main main-files admin-form">
														<div className="files-window-header">
																		<div className="files-title"><img className="back-icon" src={backIcon} title="Назад" alt="back" onClick={onBack}/>Админка</div>
														</div>
														<table className="files-table">
																		<thead>
																		<tr className="files-header">
																						<th>Логин</th>
																						<th>ФИО</th>
																						<th>Email</th>
																						<th className="align-center">Фалов, шт</th>
																						<th className="align-center">Размер</th>
																						<th className="align-center">Админ</th>
																						<th className="align-right">Действия</th>
																		</tr>
																		</thead>
																		<tbody>
																		{
																						userList.map((x, i) =>
																							<UserRow key={"file_row_" + i} user_info={x} onDelete={onDelete} onSetAdmin={onSetAdmin} onShowFiles={onShowFileList}/>)
																		}
																		</tbody>
														</table>
														<div className="pagination">
																		{
																						(new Array(pagination.total_pages)).fill(0)
																						.map((_, i) =>
																							(<div onClick={() => loadTable(i + 1, token)} key={"page_number_" + i}>
																											{i + 1}
																							</div>)
																						)
																		}
														</div>
										</div>
							}
					</>
				)
}