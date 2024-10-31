import axios, {AxiosRequestConfig} from "axios";
import {ResponseType} from "axios/index";

const instanceServer = axios.create({
	baseURL: process.env.REACT_APP_BASE_API_URL,
});



export const userAPI = {
				getHeaders (token: string, responseType: ResponseType = 'json') : AxiosRequestConfig  {
								return {
												headers: { "Authorization": "Token " + token,},
												responseType:  responseType,
								}
				},

				login(username: string, password: string) {
								let requestData = {username, password};
								return instanceServer.post('/users/login', requestData)
																												 .then(response =>  response )
																												 .catch(error => error.response);
				},
				logout(token:string) {
								let requestData = {};
								return instanceServer.post('/users/logout', requestData, this.getHeaders(token))
																												 .then(response =>  response )
																												 .catch(error => error.response);
				},
				sign_in(username: string, password: string, email: string, first_name:string, last_name:string) {
								let requestData = {username, password, email, first_name, last_name};
								return instanceServer.post('/users/register', requestData)
																												 .then(response =>  response )
																												 .catch(error => error.response);
				},
				update( current_password: string, new_password: string, first_name:string, last_name:string, token:string) {
								let requestData = {current_password, new_password, first_name, last_name};
								return instanceServer.post('/users/update', requestData, this.getHeaders(token))
																												 .then(response =>  response )
																												 .catch(error => error.response);
				},
				file_list(page:number=1, token:string, user_id:string = '') {

								return instanceServer.get(`/files/list?page=${page}`+(user_id? `&user_id=${user_id}`:''),  this.getHeaders(token))
								.then(response =>  response.data )
								.catch(error => error.response);
				},
				download(file_id:string, file_name:string, is_blob:number, token:string) {
								let rt : ResponseType = is_blob ? 'blob' : 'text';
								return instanceServer.get(   `/files/download?uuid=${file_id}&blob=${is_blob}`, this.getHeaders(token, rt) )
													.then((response) => {

																if (rt != 'blob') return response;
																// create file link in browser's memory
																const href = URL.createObjectURL(response.data);
																// create "a" HTML element with href to file & click
																const link = document.createElement('a');
																link.href = href;
																link.setAttribute('download', file_name); //or any other extension
																document.body.appendChild(link);
																link.click();
																// clean up "a" element & remove ObjectURL
																document.body.removeChild(link);
																URL.revokeObjectURL(href);
												});
				},

				change_file_name( file_id:string, file_name:string, description:string, token:string) {
								let requestData = {id:file_id, filename:file_name, description:description};
								return instanceServer.post('/files/update', requestData, this.getHeaders(token))
								.then(response =>  response )
								.catch(error => error.response);
				},
				delete_file( file_id:string,  token:string) {
								let requestData = {id:file_id};
								return instanceServer.post('/files/delete', requestData, this.getHeaders(token))
								.then(response =>  response )
								.catch(error => error.response);
				},

				upload(file: any,  token:string) {
								let formData = new FormData();

								formData.append("file", file);

								return instanceServer.post("/files/upload", formData, {
												headers: {
																"Content-Type": "multipart/form-data",
																"Authorization": "Token " + token,
												},
									}).then(response =>  response )
								.catch(error => error.response);
				},
				share( file_id:string,  token:string) {
								let requestData = {user_file_id:file_id};
								return instanceServer.post('/files/create-share', requestData, this.getHeaders(token))
								.then(response =>  response )
								.catch(error => error.response);
				},

				user_list(page:number=1, token:string) {
								return instanceServer.get(`/users/list?page=${page}`,  this.getHeaders(token))
								.then(response =>  response.data )
								.catch(error => error.response);
				},

				delete_user( user_id:string,  token:string) {
								let requestData = {user_id};
								return instanceServer.post('/users/delete', requestData, this.getHeaders(token))
								.then(response =>  response )
								.catch(error => error.response);
				},
				set_user_admin( user_id:string, is_staff:boolean,  token:string) {
								let requestData = {user_id, is_staff};
								return instanceServer.post('/users/set-admin', requestData, this.getHeaders(token))
								.then(response =>  response )
								.catch(error => error.response);
				},
};


