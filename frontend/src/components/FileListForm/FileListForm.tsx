import {FC, useEffect, useRef, useState} from "react";
import './FileListForm.css'
import {IFileInfo, IPagination, IResponseFileList} from "./files_types";
import {userAPI} from "../../api/api";
import {AuthData} from "../AuthWrapper/AuthWrapper";
import {showMessageError, showMessageInfo} from "../../redux/reducers/system/actions";
import {getDataTextError, getStatusTextError, STATUS_200_OK, STATUS_201_OK} from "../../api/api_types";
import {useDispatch} from "react-redux";
import {FileRow} from "./FileRow";
import backIcon from '../../images/back.svg'
import {useNavigate} from "react-router-dom";
import {IUserInfo} from "../AuthWrapper/auth_types";

interface IProps{
				viewedUser?: IUserInfo
				onBackView?:()=>void
}
export const FileListForm: FC<IProps> = ({viewedUser, onBackView}) =>{
				const dispatch = useDispatch()
				const navigate = useNavigate()
				const {user} = AuthData();

				const [token, setToken] = useState<string>('')
				const [fileList, setFileList] = useState<IFileInfo[]>([])
				const [pagination, setPagination] = useState<IPagination>({count:0, total_pages:0})
				const [page, setPage] = useState<number>(1)


				const fileInput = useRef<HTMLInputElement>(null);

				const showErrorWindow = (error :{ data: any, status: number }) => {
								showMessageError(getStatusTextError(error.status + '') + getDataTextError(error.data), dispatch)
				}

				const  setSortedFileList = ( lst : IFileInfo[]) => {
								lst = lst.sort( (a,b) => a.id > b.id ? -1 : 1)
								setFileList(lst)
				}
				const loadTable = async (page:number, m_token: string)=>{
								setPage(page);
								userAPI.file_list(page, m_token, viewedUser ? viewedUser.id+'' : '')
								.then((data: IResponseFileList) => {
												console.log(data, data.results)
												setSortedFileList(data.results)
												setPagination({count: data.count, total_pages: data.total_pages, next: data.next, prev: data.prev})
								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				useEffect( ()=>{
								if (user && user.data) {
												setToken(user.data.auth_token);
												loadTable(1, user.data.auth_token)
								}
				}, [user])


				const onDownload = (file: IFileInfo, is_blob: number) => {
								userAPI.download(file.id, file.file_name, is_blob, token)
															.then(response=> {
																			if (is_blob || !response) return;
																			console.log(response)
																			showMessageInfo(response.data, dispatch)
															})
														 .catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				const onChange =  (file: IFileInfo, new_name: string, new_desc:string) => {
								userAPI.change_file_name(file.id, new_name, new_desc, token)
								.then(response=> {
												let {data, status} = response;
												if (status == +STATUS_200_OK) {
																file.file_name = new_name;
																file.description = new_desc;
																setSortedFileList([...fileList.filter(x => x.id !== file.id), file])
												} else
																showErrorWindow({data, status})

								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				const onDelete = (file: IFileInfo) => {
								userAPI.delete_file(file.id, token)
								.then(response=> {
												let {data, status} = response;
												if (status == +STATUS_200_OK) {
																showMessageInfo("Файл успешно удален", dispatch)
																setSortedFileList([...fileList.filter(x => x.id !== file.id)])
												} else
																showErrorWindow({data, status})

								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				const onStartUpload = () => {
								if (fileInput && fileInput.current)
											fileInput.current.click()
				}
				const onUpload = (event: any) => {
								if (event.target.files.length != 1)
												return showMessageError("Одновременно может быть загружен только один файл", dispatch)
        userAPI.upload(event.target.files[0], token)
            .then(response=> {
								        let {data, status} = response;
								        if (status == +STATUS_201_OK) {
												        showMessageInfo("Файл успешно загружен", dispatch)
												        setSortedFileList([...fileList, data])
								        } else
												        showErrorWindow({data, status})

        })
        .catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				const onBack = () => onBackView ? onBackView() : navigate("/")

				const onShare = (file:IFileInfo) => {

								userAPI.share(file.id, token)
								.then(response=> {
												let {data, status} = response;
												if (status == +STATUS_200_OK) {
															 let	href = process.env.REACT_APP_BASE_API_URL + `/files/get-share?uuid=${data.id}`;
																showMessageInfo(`Файл успешно расшарен адрес публичной ссылки<Br> <a href='${href}'>${href}</a>`, dispatch)
												} else
																showErrorWindow({data, status})

								})
								.catch((error: { data: any, status: number }) => showErrorWindow(error))
				}

				return(
					<div className="main main-files">
									<div className="files-window-header">
											<div className="files-title"><img className="back-icon" src={backIcon} title="Назад" alt="back" onClick={onBack}/>Файлы</div>
													{!viewedUser &&
																	<div className="button" onClick={onStartUpload}>Загрузить файл
																			<input type="file" ref={fileInput} onChange={onUpload} className="hidden" />
															  </div>
													}
									</div>
									<table className="files-table">
													<thead>
																	<tr className="files-header">
																					<th>Имя файла</th>
																					<th >Размер</th>
																					<th className="align-center">Скачано</th>
																					<th className="align-center">Создан</th>
																					<th className="align-right">Действия</th>
																	</tr>
													</thead>
													<tbody>
																		{
																				  fileList.map((x,i)=>
																					   <FileRow key={"file_row_"+i} file_info={x}
																					            onChange={onChange} onDelete={onDelete} onShare={onShare} onDownload={onDownload}/>)
																		}
													</tbody>
									</table>
									<div className="pagination">
													{
																	(new Array(pagination.total_pages)).fill(0)
																	.map((_,i)=>
																		(<div onClick={()=>loadTable(i+1, token)} key={"page_number_" + i}>
																						{i+1}
																		</div>)
																	)
													}
									</div>
					</div>
				)
}