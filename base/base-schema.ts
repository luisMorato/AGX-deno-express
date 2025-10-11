import { Schema, SchemaDefinition } from 'mongoose'

export class BaseSchema {
    public schema: Schema
    constructor(schema: SchemaDefinition) {
        Object.assign(schema, {
            createdAt: {
            type: Date,
            default: new Date(),
            },
        })

        this.schema = new Schema(
            schema
        )
    }
}