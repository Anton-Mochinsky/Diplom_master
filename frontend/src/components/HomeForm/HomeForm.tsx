import {FC} from "react";
import {Link} from "react-router-dom";
import {AuthData} from "../AuthWrapper/AuthWrapper";
import AuthForm from "../AuthForm/AuthForm";

import "./HomeForm.css"
export const HomeForm: FC = () =>{
				const {user, logout, } = AuthData();
				return(
					<>
									{user && user.isAuthenticated ?
													<div className="main">
																	<div className="menuItemList">
																					<div className="menuItem"><Link to={"/profile"}>Профиль</Link></div>
																					{user && user.data?.is_staff && <div className="menuItem"><Link to={"/admin"}>Админка</Link></div>}
																					<div className="menuItem"><Link to={"/files"}>Файлы</Link></div>
																					<div className="menuItem" onClick={logout}>Выход</div>
																	</div>
													</div> : <AuthForm/>
									}
					</>
				)
}