import {
    handleCors,
    handleBodyRequestParsing,
    handleCompression
} from "./common";

//whatever middleware we are creating. We can add it here.
export default [handleCors, handleBodyRequestParsing, handleCompression]