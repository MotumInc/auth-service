import { wrapAPI } from "../util/api";
import { author, name, version, description } from "../../package.json";

export default wrapAPI(async req => ({
    "service": name,
    author, 
    version,
    description
}))