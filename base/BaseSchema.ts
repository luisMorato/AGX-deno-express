import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose'

export class BaseSchema {
  public schema: Schema
  private schemaOptions: SchemaOptions

  constructor(
    schema: SchemaDefinition,
    options: SchemaOptions = {},
  ) {
    this.schemaOptions = options

    Object.assign(schema, {
      createdAt: {
        type: Date,
        default: new Date(),
      },
    })

    this.schemaOptions = {
      versionKey: false,
    }

    this.schema = new Schema(
      {
        ...schema,
        // __v: { type: Number, select: false },
      },
      this.schemaOptions,
    )
  }
}
