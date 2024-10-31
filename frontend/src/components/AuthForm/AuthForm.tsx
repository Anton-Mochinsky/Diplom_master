import {FC, useState} from "react";
import {useDispatch} from "react-redux";
import './AuthForm.css'
import {AuthData} from "../AuthWrapper/AuthWrapper";
import {validateEmail, validatePassword, validateUsername} from "./utils";
import {showMessageError} from "../../redux/reducers/system/actions";
export const AuthForm: FC = () => {
				const dispatch = useDispatch();
				const {login, sign_in} = AuthData();

				const [loginUsername, setLoginUsername] = useState<string>('');
				const [loginPassword, setLoginPassword] = useState<string>('');

				const [username, setUsername] = useState<string>('');
				const [password, setPassword] = useState<string>('');
				const [email, setEmail] = useState<string>('');
				const [firstName, setFirstName] = useState<string>('');
				const [lastName, setLastName] = useState<string>('');
				const onLoginClick = async () => {
								if (login)
												await login(loginUsername, loginPassword)
				}
				const onSignUpClick = async () => {

								if (!validateUsername(username))
												return showMessageError("Логин должен содержать только латинские буквы и цифры, " +
																																									"первый символ — буква, длина от 4 до 20 символов", dispatch)
								if (!validateEmail(email))
												return showMessageError("Введите корректный  адрес email", dispatch)

								if (!validatePassword(password))
												return showMessageError("Пароль  должен быть не менее 6 символов и содержать как минимум одну заглавная букву, " +
																																									"одну цифру и один специальный символ", dispatch)

							if (sign_in)
											await sign_in(username, password, email, firstName, lastName)
				}

				return (
					<div className="main">
									<input type="checkbox" id="chk" aria-hidden="true"/>

									<div className="signup">

																	<label htmlFor="chk" aria-hidden="true">Регистрация</label>
																	<input type="text" name="user" placeholder="Логин" value={username}
																	       onChange={(e)=>setUsername(e.currentTarget.value)}/>
																	<input type="email" name="email" placeholder="Email" value={email}
																	       onChange={(e)=>setEmail(e.currentTarget.value)} />

																	<input type="text"  placeholder="Имя"  value={firstName}
																	       onChange={(e)=>setFirstName(e.currentTarget.value)}/>
																	<input type="text"  placeholder="Фамилия" value={lastName}
																	       onChange={(e)=>setLastName(e.currentTarget.value)}/>
 																<input type="password" placeholder="Пароль" value={password}
																	       onChange={(e)=>setPassword(e.currentTarget.value)}/>
																	<div className="button" onClick={onSignUpClick}>Регистрация</div>

									</div>
									<div className="login">

																	<label htmlFor="chk" aria-hidden="true">Вход</label>
																	<input type="text" name="user" placeholder="Логин" value={loginUsername}
																	       onChange={(e)=>setLoginUsername(e.currentTarget.value)}/>
																	<input type="password" name="pswd" placeholder="Пароль" value={loginPassword}
																	       onChange={(e)=>setLoginPassword(e.currentTarget.value)}/>
													<div className="button" onClick={onLoginClick}>войти</div>

									</div>
					</div>
				)
}

export default AuthForm;