import {FC, useState} from "react";
import {AuthData} from "../AuthWrapper/AuthWrapper";
import {Link} from "react-router-dom";
import './ProfileForm.css'
import {validatePassword} from "../AuthForm/utils";
import {showMessageError} from "../../redux/reducers/system/actions";
import {useDispatch} from "react-redux";

export const ProfileForm: FC = () =>{
				const dispatch = useDispatch();
				const {user, save} = AuthData();


				const [password, setPassword] = useState<string>('');
				const [newPassword, setNewPassword] = useState<string>('');
				const [firstName, setFirstName] = useState<string>(user && user.data ? user.data.first_name :'');
				const [lastName, setLastName] = useState<string>(user && user.data ? user.data.last_name :'');

				const onSaveClick = async () =>{
								if (newPassword !=="" && !validatePassword(newPassword))
												return showMessageError("Пароль  должен быть не менее 6 символов и содержать как минимум одну заглавная букву, " +
																																							  "одну цифру и один специальный символ", dispatch)

								if (save)
												await save(password, newPassword, firstName, lastName)
				}
				return(
					<div className="main main-profile">
									{user && user.data ?
													<div className="profile">
																	<label aria-hidden="true">{ user.data.username}</label>
																	<label className="small-text">{ user.data.email}</label>
																	<input type="text"  placeholder="Имя"  value={firstName}
																	       onChange={(e)=>setFirstName(e.currentTarget.value)}/>
																	<input type="text"  placeholder="Фамилия" value={lastName}
																	       onChange={(e)=>setLastName(e.currentTarget.value)}/>
																	<input type="password" placeholder="Новый Пароль" value={newPassword}
																	       onChange={(e)=>setNewPassword(e.currentTarget.value)}/>
																	<input type="password" placeholder="Текущий Пароль *" value={password} required={true}
																	       onChange={(e)=>setPassword(e.currentTarget.value)}/>
																	<div className="button" onClick={onSaveClick}>Сохранить</div>
																	<div className="menuItem"><Link to={'/'}>Домой</Link></div>
													</div> :
										<div>
														<label>Ошибка авторизации</label>
										</div>
									}
					</div>
				)
}