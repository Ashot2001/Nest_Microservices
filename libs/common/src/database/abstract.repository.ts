import { Model, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<Tdocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<Tdocument>) {}

  async create(document: Omit<Tdocument, '_id'>): Promise<Tdocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as Tdocument;
  }

  async findOne(filterQuery: FilterQuery<Tdocument>): Promise<Tdocument> {
    if (filterQuery._id && !Types.ObjectId.isValid(filterQuery._id)) {
      throw new NotFoundException('Invalid identifier format');
    }

    const document = await this.model
      .findOne(filterQuery)
      .lean<Tdocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findOneAndUpdate(
    fillterQuery: FilterQuery<Tdocument>,
    update: UpdateQuery<Tdocument>,
  ): Promise<Tdocument> {
    const document = await this.model
      .findOneAndUpdate(fillterQuery, update, {
        new: true,
      })
      .lean<Tdocument>(true);

    if (!document) {
      this.logger.warn(
        'Document was not found with fillterQuery',
        fillterQuery,
      );
      throw new NotFoundException('Document was not found');
    }
    return document;
  }

  async find(filterQuery: FilterQuery<Tdocument>): Promise<Tdocument[]> {
    return this.model.find(filterQuery).lean<Tdocument[]>(true);
  }

  async findOneAndDelete(
    fillterQuery: FilterQuery<Tdocument>,
  ): Promise<Tdocument> {
    return this.model.findOneAndDelete(fillterQuery).lean<Tdocument>(true);
  }
}
