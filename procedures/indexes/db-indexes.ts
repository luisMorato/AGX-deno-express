import { Model, IndexOptions } from 'mongoose'

export interface IDBIndexes<T> {
  model: Model<T>
  indexes: {
    keys: {
      [field in keyof T]?: number | string
    }
    options?: IndexOptions
  }[]
}

export type TIndexes = IDBIndexes<any>[]