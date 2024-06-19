import {ContainerTypes} from 'express-joi-validation'
import {RequiredHeaders} from './header.model';

export interface ValidatedRequestParams<T> extends RequiredHeaders {
    [ContainerTypes.Params]: T
}
