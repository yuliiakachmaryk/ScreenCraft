import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Episode } from '../schemas/episode.schema';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectModel(Episode.name)
    private episodeModel: Model<Episode>,
  ) {}

  async create(createEpisodeDto: Partial<Episode>): Promise<Episode> {
    return this.episodeModel.create(createEpisodeDto);
  }

  async findAll(): Promise<Episode[]> {
    return this.episodeModel.find().exec();
  }

  async findOne(id: string): Promise<Episode> {
    const episode = await this.episodeModel.findById(id).exec();
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
    return episode;
  }

  async update(id: string, updateEpisodeDto: Partial<Episode>): Promise<Episode> {
    const updatedEpisode = await this.episodeModel
      .findByIdAndUpdate(id, updateEpisodeDto, { new: true })
      .exec();
    if (!updatedEpisode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
    return updatedEpisode;
  }

  async remove(id: string): Promise<Episode> {
    const deletedEpisode = await this.episodeModel.findByIdAndDelete(id).exec();
    if (!deletedEpisode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
    return deletedEpisode;
  }
} 