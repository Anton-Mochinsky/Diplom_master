import {IFileInfo} from "./files_types";
import {FC} from "react";
import deleteIcon from '../../images/close.svg'
import shareIcon from '../../images/share.svg'
import openIcon from '../../images/open.svg'
import editIcon from '../../images/edit.svg'
import downloadIcon from '../../images/download.svg'

interface IProps  {
				file_info: IFileInfo;
				onDelete?:(val:IFileInfo)=> void
				onChange?:(val:IFileInfo, new_file_name:string, new_desc:string)=> void
				onShare?:(val:IFileInfo)=> void
				onDownload?:(val:IFileInfo, is_blob:number)=> void
}
export const FileRow:FC<IProps> = ({file_info, onDelete, onChange, onDownload, onShare})=> {
				const onDeleteEvent = () => {
								if (window.confirm("Вы действительно хотите удалить выбранный файл ?")) {
												//window.open("exit.html", "Thanks for Visiting!");
												if (onDelete) onDelete(file_info)
								}
				}


				const onChangeDescriptionEvent = () =>{
								let new_desc = window.prompt("Введите новое описание файла", file_info.description);
								if (!new_desc || !new_desc.trim() || new_desc == file_info.file_name ) return;
								if (onChange) onChange(file_info,file_info.file_name, new_desc);
				}
				const onChangeNameEvent = () => {
								let new_name = window.prompt("Введите новое имя файла", file_info.file_name);
								if (!new_name || !new_name.trim() || new_name == file_info.file_name ) return;
								if (onChange) onChange(file_info,new_name,file_info.description);

				}
				const onDownloadEvent = () => {
        if (onDownload) onDownload(file_info, 1)
				}

				const onOpenEvent = () => {
								if (onDownload) onDownload(file_info, 0)
				}

				const onShareEvent = () => {
								if (onShare) onShare(file_info)
				}

				return(
					<tr className="file-row">
									<td className="file-row-name">{file_info.file_name}
															<span className="file-row-description">{file_info.description}
																			<img title='Изменить описание файла' src={editIcon} alt="edit" onClick={onChangeDescriptionEvent}/>
															</span>
									</td>
									<td className="file-row-size">{Math.round(file_info.file_size/1024).toFixed(1)} Кб</td>
									<td className="file-row-date file-row-date-download">
													{file_info.count_download} раз(а)<br/>last: {file_info.downloaded != file_info.created ? file_info.downloaded : ''}
									</td>
									<td className="file-row-date">{file_info.created}</td>
									<td className="file-row-actions-td">
													<div className="file-row-actions">
																	<div className="file-row-delete" onClick={onDeleteEvent}><img title='Удалить' src={deleteIcon} alt="del"/></div>
																	<div className="file-row-rename" onClick={onChangeNameEvent}><img title='Изменить имя файла' src={editIcon} alt="edit"/></div>
																	<div className="file-row-download" onClick={onDownloadEvent}><img title='Скачать' src={downloadIcon}  alt="download"/></div>
																	<div className="file-row-open" onClick={onOpenEvent}><img title='Открыть' src={openIcon} alt="open"/></div>
																	<div className="file-row-share" onClick={onShareEvent}><img title='Сделать общий доступ' src={shareIcon}  alt="share"/></div>
													</div>
									</td>
					</tr>
				)
}