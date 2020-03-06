import { Router } from "express";

type Wrapper = ((router: Router) => void);

export const applyMiddleware = (middlewareList: Wrapper[], router: Router) => {
    for (const middleware of middlewareList) {
        middleware(router);
    }
};