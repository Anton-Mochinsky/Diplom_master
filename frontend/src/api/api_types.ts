export const  STATUS_200_OK = '200';
export const  STATUS_201_OK = '201';
export const  STATUS_400_ERROR = '400';
export const  STATUS_401_ERROR = '401';
export const  STATUS_404_ERROR = '404';
export const  STATUS_500_ERROR = '500';

export const getStatusTextError = (code:string) : string => {
				if (code === STATUS_400_ERROR) return  `<span>Код ${code}, некорректный запрос</span><br/>`;
				if (code === STATUS_401_ERROR) return  `<span>Код ${code}, ошибка авторизации</span><br/>`;
				if (code === STATUS_404_ERROR) return  `<span>Код ${code}, объект не найден</span><br/>`;
				if (code === STATUS_500_ERROR) return  `<span>Код ${code}, серверная ошибка</span><br/>`;

				return `<span>Код ${code}</span><br/>`
}

export const getDataTextError = (data:any) : string => {
				if (typeof data === 'object') return JSON.stringify(data);
				else return data
}