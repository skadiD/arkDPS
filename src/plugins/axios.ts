import type {AxiosError, AxiosInstance} from "axios";
import axios from "axios";
import {handleAxiosError} from "./axiosHelper";

export const service = axios.create({
    // baseURL: "https://api.dps.ltsc.vip/",
});
service.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        const fail: Service.FailedResult = {
            error,
            data: null,
            message: "error",
            code: error.code as number,
        };
        return fail;
    }
);
type RequestMethod = "get" | "post" | "put" | "delete";
interface RequestParam {
    url: string;
    method: RequestMethod;
    data?: any;
    token?: string;
    isSSE?: boolean;
}
async function getRequestResponse(params: {
    instance: AxiosInstance;
    method: RequestMethod;
    url: string;
    data?: any;
}) {
    const { instance, method, url, data } = params;
    let res: any;
    if (method === "get" || method === "delete") {
        res = await instance[method](url);
    } else {
        res = await instance[method](url, data);
    }
    return res;
}

async function asyncRequest<T>(
    param: RequestParam
): Promise<Service.RequestResult<T>> {
    const { url } = param;
    const method = param.method || "get";
    return (await getRequestResponse({
        instance: service,
        method,
        url,
        data: param.data,
    })) as Service.RequestResult<T>;
}
function post<T>(url: string, data?: any) {
    return asyncRequest<T>({ url, method: "post", data });
}
function get<T>(url: string) {
    return asyncRequest<T>({ url, method: "get" });
}
export const getCharsData = () => 
    get('https://raw.githubusercontent.com/fexli/ArknightsResource/main/gamedata/excel/character_table.json')

export const getChars = () => get('/data/chars.json')
export const getCollection = () => get('/data/collection.json')
export const getSKillData = () => get('https://raw.githubusercontent.com/fexli/ArknightsResource/main/gamedata/excel/skill_table.json')
export const getEnemies = () => get('/data/enemies.json')
export const fetchChar = (charId: string) => get(`https://api.dps.ltsc.vip/`)