import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentItem } from '../schemas/content-item.schema';

@Injectable()
export class ContentItemService {
  constructor(
    @InjectModel(ContentItem.name)
    private contentItemModel: Model<ContentItem>,
  ) {}

  async create(createContentItemDto: Partial<ContentItem>): Promise<ContentItem> {
    return this.contentItemModel.create(createContentItemDto);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ contentItems: ContentItem[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [contentItems, total] = await Promise.all([
      this.contentItemModel
        .find()
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate('episodes')
        .exec(),
      this.contentItemModel.countDocuments().exec()
    ]);

    return {
      contentItems,
      total
    };
  }

  async findOne(id: string): Promise<ContentItem> {
    const contentItem = await this.contentItemModel.findById(id).populate('episodes').exec();
    if (!contentItem) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    return contentItem;
  }

  async update(id: string, updateContentItemDto: Partial<ContentItem>): Promise<ContentItem> {
    const updatedContentItem = await this.contentItemModel
      .findByIdAndUpdate(id, updateContentItemDto, { new: true })
      .populate('episodes')
      .exec();
    if (!updatedContentItem) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    return updatedContentItem;
  }

  async remove(id: string): Promise<ContentItem> {
    const deletedContentItem = await this.contentItemModel.findByIdAndDelete(id).exec();
    if (!deletedContentItem) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    return deletedContentItem;
  }

  async addEpisode(id: string, episodeId: string): Promise<ContentItem> {
    const contentItem = await this.contentItemModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { episodes: episodeId } },
        { new: true },
      )
      .populate('episodes')
      .exec();
    if (!contentItem) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    return contentItem;
  }

  async removeEpisode(id: string, episodeId: string): Promise<ContentItem> {
    const contentItem = await this.contentItemModel
      .findByIdAndUpdate(
        id,
        { $pull: { episodes: episodeId } },
        { new: true },
      )
      .populate('episodes')
      .exec();
    if (!contentItem) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    return contentItem;
  }
} 