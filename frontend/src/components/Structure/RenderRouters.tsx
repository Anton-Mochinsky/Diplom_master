import {AuthData} from "../AuthWrapper/AuthWrapper";
import {Routes, Route} from "react-router-dom";
import {navigationUrls} from "./navigation";

export const RenderRouters = () => {

				const {user} = AuthData();

				return (
								<Routes >
												{
																navigationUrls.map( (r,i)=> {
																				if (r.isPrivate && user.isAuthenticated) return <Route key={"route_"+i} path={r.path} element={r.element}/>
																				if (!r.isPrivate) return <Route  key={"route_"+i} path={r.path} element={r.element}/>
																				return false
																})
												}
								</Routes>
				)

}