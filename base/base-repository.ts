import {
  Model,
  UpdateQuery,
  FilterQuery,
  PipelineStage,
} from "mongoose";

export class BaseRepository<T> {
    public model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async findMany(query: FilterQuery<T>) {
        const data = await this.model.find(query)

        return data
    }

    async findOne(query: FilterQuery<T>) {
        const data = await this.model.findOne(query)

        return data
    }
    
    async findById(id: string) {
        const data = await this.model.findById(id)

        return data
    }

    async insertOne(data: T) {
        await this.model.create([data])
    }

    async updateById(id: string, data: UpdateQuery<T>) {
        await this.model.updateOne({ _id: id }, data)
    }

    async updateOne(updateQuery: FilterQuery<T>, data: UpdateQuery<T>) {
        await this.model.updateOne(updateQuery, data)
    }

    async deleteOne(id: string) {
        await this.model.deleteOne({ _id: id })
    }

    async aggregate(aggregatePipeline: PipelineStage[]) {
        return await this.model.aggregate(aggregatePipeline)
    }
}