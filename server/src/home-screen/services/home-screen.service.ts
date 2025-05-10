import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeScreenConfig } from '../schemas/home-screen.schema';

@Injectable()
export class HomeScreenService {
  constructor(
    @InjectModel(HomeScreenConfig.name)
    private homeScreenModel: Model<HomeScreenConfig>,
  ) {}

  async create(createHomeScreenDto: Partial<HomeScreenConfig>): Promise<HomeScreenConfig> {
    return this.homeScreenModel.create(createHomeScreenDto);
  }

  async findAll(): Promise<HomeScreenConfig[]> {
    return this.homeScreenModel
      .find()
      .populate('recomendaciones')
      .populate('topCharts')
      .populate('mostTrending')
      .populate('mostPopular')
      .exec();
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