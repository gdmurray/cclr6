import { ArraySchema } from 'yup'

declare module 'yup' {
    interface ArraySchema {
        unique(message: string, mapper: any): ArraySchema;
    }
}
