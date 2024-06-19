import { ContainerTypes } from 'express-joi-validation'
import { RequiredHeaders } from './header.model';

export interface ValidatedRequestBody<T> extends RequiredHeaders {
    [ContainerTypes.Body]: T
}
