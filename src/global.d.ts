import { ArraySchema } from 'yup'
import * as password from 'yup-password'

declare module 'yup' {
    interface ArraySchema {
        unique(message: string, mapper: any): ArraySchema;
    }
}
