import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose'

export class BaseSchema {
  public schema: Schema

  constructor(
    schema: SchemaDefinition,
    options: SchemaOptions = {},
  ) {
    const schemaOptions: SchemaOptions = {
      versionKey: false,
    }

    Object.assign(schema, {
      createdAt: {
        type: Date,
        default: new Date(),
      },
    })

    Object.assign(schemaOptions, options)

    this.schema = new Schema(
      {
        ...schema,
        __v: { type: Number, select: false },
      },
      schemaOptions,
    )
  }
}
