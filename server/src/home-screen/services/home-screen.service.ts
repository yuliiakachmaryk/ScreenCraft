import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeScreenConfig } from '../schemas/home-screen.schema';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class HomeScreenService {
  constructor(
    @InjectModel(HomeScreenConfig.name)
    private homeScreenModel: Model<HomeScreenConfig>,
  ) {}

  async create(createHomeScreenDto: Partial<HomeScreenConfig>): Promise<HomeScreenConfig> {
    return this.homeScreenModel.create(createHomeScreenDto);
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<HomeScreenConfig>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.homeScreenModel
        .find()
        .sort({ isActive: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('recomendaciones')
        .populate('topCharts')
        .populate('mostTrending')
        .populate('mostPopular')
        .exec(),
      this.homeScreenModel.countDocuments().exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findById(id)
      .populate('recomendaciones')
      .populate('topCharts')
      .populate('mostTrending')
      .populate('mostPopular')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async findActive(): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findOne({ isActive: true })
      .populate('recomendaciones')
      .populate('topCharts')
      .populate('mostTrending')
      .populate('mostPopular')
      .exec();
    if (!config) {
      throw new NotFoundException('No active home screen configuration found');
    }
    return config;
  }

  async update(id: string, updateHomeScreenDto: Partial<HomeScreenConfig>): Promise<HomeScreenConfig> {
    const updatedConfig = await this.homeScreenModel
      .findByIdAndUpdate(id, { ...updateHomeScreenDto, updatedAt: new Date() }, { new: true })
      .populate('recomendaciones')
      .populate('topCharts')
      .populate('mostTrending')
      .populate('mostPopular')
      .exec();
    if (!updatedConfig) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return updatedConfig;
  }

  async setActive(id: string): Promise<HomeScreenConfig> {
    try {
      const activeScreen = await this.homeScreenModel.findOne({ isActive: true }).exec();
      if (activeScreen && (activeScreen as any)._id.toString() !== id) {
        throw new Error('Another home screen is already active. Please deactivate it first.');
      }

      await this.homeScreenModel.updateMany({}, { isActive: false }).exec();
      const config = await this.homeScreenModel
        .findByIdAndUpdate(id, { isActive: true, updatedAt: new Date() }, { new: true })
        .populate('recomendaciones')
        .populate('topCharts')
        .populate('mostTrending')
        .populate('mostPopular')
        .exec();
      if (!config) {
        throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
      }
      return config;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.message.includes('already active')) {
        throw new Error(error.message);
      }
      throw new Error('Failed to set home screen as active');
    }
  }

  async remove(id: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel.findByIdAndDelete(id).exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async addContentItem(id: string, section: string, contentItemId: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { [section]: contentItemId }, updatedAt: new Date() },
        { new: true },
      )
      .populate('recomendaciones')
      .populate('topCharts')
      .populate('mostTrending')
      .populate('mostPopular')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async removeContentItem(id: string, section: string, contentItemId: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { $pull: { [section]: contentItemId }, updatedAt: new Date() },
        { new: true },
      )
      .populate('recomendaciones')
      .populate('topCharts')
      .populate('mostTrending')
      .populate('mostPopular')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }
} 