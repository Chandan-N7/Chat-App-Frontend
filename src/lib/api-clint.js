import {HOST} from "../utils/constants"
import axios from "axios";


const apiClint = axios.create({
    baseURL:HOST,

});
export default apiClint;