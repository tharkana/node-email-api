import {
    handleCors,
    handleBodyRequestParsing,
    handleCompression
} from "./common";

import { handleAPIDocs } from "./apiDocs";

//whatever middleware we are creating. We can add it here.
export default [handleCors, handleBodyRequestParsing, handleCompression, handleAPIDocs]