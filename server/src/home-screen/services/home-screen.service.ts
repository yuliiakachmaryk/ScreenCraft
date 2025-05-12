import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeScreenConfig, Section } from '../schemas/home-screen.schema';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BulkWriteOperation {
  updateOne: {
    filter: Record<string, any>;
    update: Record<string, any>;
  };
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
        .populate('sections.items')
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
      .populate('sections.items')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async findActive(): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findOne({ isActive: true })
      .populate('sections.items')
      .exec();
    if (!config) {
      throw new NotFoundException('No active home screen configuration found');
    }
    return config;
  }

  async update(id: string, updateHomeScreenDto: Partial<HomeScreenConfig>): Promise<HomeScreenConfig> {
    const updatedConfig = await this.homeScreenModel
      .findByIdAndUpdate(id, { ...updateHomeScreenDto, updatedAt: new Date() }, { new: true })
      .populate('sections.items')
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
        .populate('sections.items')
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

  async addSection(id: string, section: Section): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { 
          $push: { 
            sections: {
              $each: [section],
              $sort: { order: 1 }
            }
          },
          updatedAt: new Date() 
        },
        { new: true }
      )
      .populate('sections.items')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async updateSection(id: string, sectionName: string, sectionData: Partial<Section>): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel.findById(id).exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }

    const currentSection = config.sections.find(s => s.name === sectionName);
    if (!currentSection) {
      throw new NotFoundException(`Section ${sectionName} not found`);
    }

    if (sectionData.order !== undefined) {
      const sections = [...config.sections];
      const oldOrder = currentSection.order;
      const newOrder = sectionData.order;

      const sectionToMove = sections.find(s => s.name === sectionName);
      if (sectionToMove) {
        sectionToMove.order = newOrder;
      }

      sections.forEach(section => {
        if (section.name !== sectionName) {
          if (newOrder > oldOrder) {
            if (section.order > oldOrder && section.order <= newOrder) {
              section.order--;
            }
          } else {
            if (section.order >= newOrder && section.order < oldOrder) {
              section.order++;
            }
          }
        }
      });

      sections.sort((a, b) => a.order - b.order);
      sections.forEach((section, index) => {
        section.order = index;
      });

      const updatedConfig = await this.homeScreenModel
        .findByIdAndUpdate(
          id,
          { 
            $set: { 
              sections,
              updatedAt: new Date() 
            }
          },
          { new: true }
        )
        .populate('sections.items')
        .exec();

      if (!updatedConfig) {
        throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
      }
      return updatedConfig;
    }

    const updatedConfig = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { 
          $set: { 
            'sections.$[section]': { 
              ...currentSection,
              ...sectionData,
              name: sectionName,
              items: currentSection.items 
            },
            updatedAt: new Date() 
          }
        },
        { 
          arrayFilters: [{ 'section.name': sectionName }],
          new: true 
        }
      )
      .populate('sections.items')
      .exec();

    if (!updatedConfig) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return updatedConfig;
  }

  async removeSection(id: string, sectionName: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { 
          $pull: { sections: { name: sectionName } },
          updatedAt: new Date() 
        },
        { new: true }
      )
      .populate('sections.items')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async addContentItem(id: string, sectionName: string, contentItemId: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { 
          $addToSet: { 'sections.$[section].items': contentItemId },
          updatedAt: new Date() 
        },
        { 
          arrayFilters: [{ 'section.name': sectionName }],
          new: true 
        }
      )
      .populate('sections.items')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }

  async removeContentItem(id: string, sectionName: string, contentItemId: string): Promise<HomeScreenConfig> {
    const config = await this.homeScreenModel
      .findByIdAndUpdate(
        id,
        { 
          $pull: { 'sections.$[section].items': contentItemId },
          updatedAt: new Date() 
        },
        { 
          arrayFilters: [{ 'section.name': sectionName }],
          new: true 
        }
      )
      .populate('sections.items')
      .exec();
    if (!config) {
      throw new NotFoundException(`Home screen configuration with ID ${id} not found`);
    }
    return config;
  }
} 