import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";

//For ease of development
export const handleCors = (router: Router) =>
    router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
    router.use(parser.urlencoded({ extended: true }));
    router.use(parser.json());
};

//TODO: Can remove it.
export const handleCompression = (router: Router) => {
    router.use(compression());
};