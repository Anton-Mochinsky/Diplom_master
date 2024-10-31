import {HomeForm} from "../HomeForm/HomeForm";
import {FileListForm} from "../FileListForm/FileListForm";
import {AdminForm} from "../AdminForm/AdminForm";
import {ProfileForm} from "../ProfileForm/ProfileForm";

interface INavElement{
				path: string;
				name: string;
				isPrivate: boolean;
				element: any;

}

export const navigationUrls: INavElement[] = [
				{path: "/index.html", name: "Home",  isPrivate: false, element:  <HomeForm />},
				{path: "/", name: "Home",  isPrivate: false, element:  <HomeForm />},
				{path: "/files", name: "Home",  isPrivate: true, element:  <FileListForm />},
				{path: "/admin", name: "Home",  isPrivate: true, element:  <AdminForm />},
				{path: "/profile", name: "Home",  isPrivate: true, element:  <ProfileForm />},

];
