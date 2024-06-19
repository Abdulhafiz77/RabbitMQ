import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation'

export interface RequiredHeaders extends ValidatedRequestSchema {

    [ContainerTypes.Headers]: {
        authorization: string;
        language: 'ru' | 'en' | 'uz';
    }
}
