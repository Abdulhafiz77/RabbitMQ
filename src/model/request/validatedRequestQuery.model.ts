import { ContainerTypes } from 'express-joi-validation'
import { RequiredHeaders } from './header.model';

export interface ValidatedRequestQuery<T> extends RequiredHeaders {
    [ContainerTypes.Query]: T
}
