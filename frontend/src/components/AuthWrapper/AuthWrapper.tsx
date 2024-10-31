import {createContext, useContext, useState} from "react";
import {RenderRouters} from "../Structure/RenderRouters";
import {IUserInfo} from "./auth_types";
import {userAPI} from "../../api/api";
import {getDataTextError, getStatusTextError, STATUS_200_OK, STATUS_201_OK} from "../../api/api_types";
import {showMessageError, showMessageInfo} from "../../redux/reducers/system/actions";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

interface IUserContext {
				data: IUserInfo | undefined;
				isAuthenticated: boolean;
}
interface IThemeContext {
				user: IUserContext;
				login?: (username: string, password: string) => void ;
				logout?: () => void  ;
				sign_in?: (username: string, password: string, email: string, first_name:string, last_name:string) => void  ;
				save?: (current_password: string, new_password: string, first_name:string, last_name:string) => void  ;
}

const defaultContextState:IThemeContext = {user : {data: undefined, isAuthenticated: false}}

const AuthContext = createContext<IThemeContext>(defaultContextState);
export const AuthData = () => useContext(AuthContext);

export  const AuthWrapper = () =>{
				const dispatch = useDispatch();
				const navigate = useNavigate();

				const [ user, setUser ] = useState<IUserContext>({data: undefined, isAuthenticated: false})
				const login = async (username: string, password: string) => {
								let {data, status} = await userAPI.login(username, password);
								if (status === +STATUS_200_OK )
												setUser({data, isAuthenticated: data.auth_token && data.is_active})
								else
												showMessageError(getStatusTextError(status) + getDataTextError(data), dispatch)
				}
				const logout = async () => {
								if (!user.data) return;
								let {data, status} = await userAPI.logout(user.data.auth_token);
								if (status === +STATUS_200_OK )
				        setUser({data: undefined, isAuthenticated: false})
								else
												showMessageError(getStatusTextError(status) + getDataTextError(data), dispatch)
				}

				const sign_in = async (username: string, password: string, email: string, first_name:string, last_name:string) => {
								//@ts-ignore
								console.log('sign_in', this?.args)
								let {data, status} = await userAPI.sign_in(username, password, email, first_name, last_name);
								if (status === +STATUS_201_OK ) {
												console.log('setUser', data, data.auth_token && data.is_active)
												setUser({data, isAuthenticated: data.auth_token && data.is_active})
								}
							 else
												showMessageError(getStatusTextError(status) + getDataTextError(data), dispatch)
				}

				const save = async (current_password: string, new_password: string, first_name:string, last_name:string) => {
								if (!user.data) return;
								let {data, status} = await userAPI.update(current_password, new_password, first_name, last_name, user.data.auth_token);
								if (status === +STATUS_200_OK ) {
												setUser({data:{...user.data, first_name, last_name}, isAuthenticated: user.isAuthenticated})
												showMessageInfo("Данные успешно обновлены", dispatch)
								}
							 else
												showMessageError(getStatusTextError(status) + getDataTextError(data), dispatch)
				}

				return (
					<AuthContext.Provider value={{user, login, logout, sign_in, save}} >
									<RenderRouters/>
					</AuthContext.Provider>
				)
}
