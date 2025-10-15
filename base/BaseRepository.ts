import { MongooseUpdateQueryOptions } from 'mongoose'
import { FilterQuery, Model, PipelineStage, UpdateQuery } from 'mongoose'

export class BaseRepository<
  T,
  TVirtuals = object, // TVirtuals: Interface for virtual properties
  TQueryHelpers = object, // TQueryHelpers: Interface for query helper methods
  TInstanceMethods = object, // TInstanceMethods: Interface for instance methods
> {
  public model: Model<T, TQueryHelpers, TInstanceMethods, TVirtuals>

  constructor(model: Model<T, TQueryHelpers, TInstanceMethods, TVirtuals>) {
    this.model = model as Model<T, TQueryHelpers, TInstanceMethods, TVirtuals>
  }

  findMany(query: FilterQuery<T>) {
    const data = this.model.find(query)

    return data
  }

  findOne(query: FilterQuery<T>) {
    const data = this.model.findOne(query)

    return data
  }

  findById(id: string) {
    const data = this.model.findById(id)

    return data
  }

  insertOne(data: T) {
    return this.model.create([data])
  }

  updateById(id: string, data: UpdateQuery<T>, options?: MongooseUpdateQueryOptions) {
    return this.model.updateOne({ _id: id }, data, options)
  }

  updateOne(updateQuery: FilterQuery<T>, data: UpdateQuery<T>, options?: MongooseUpdateQueryOptions) {
    return this.model.updateOne(updateQuery, data, options)
  }

  deleteOne(id: string) {
    return this.model.deleteOne({ _id: id })
  }

  aggregate(aggregatePipeline: PipelineStage[]) {
    return this.model.aggregate(aggregatePipeline)
  }

  paginate() {
    this.model
  }
}
