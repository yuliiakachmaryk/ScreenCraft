import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EpisodeService } from '../services/episode.service';
import { Episode } from '../schemas/episode.schema';

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  create(@Body() createEpisodeDto: Partial<Episode>) {
    return this.episodeService.create(createEpisodeDto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.episodeService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.episodeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEpisodeDto: Partial<Episode>) {
    return this.episodeService.update(id, updateEpisodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.episodeService.remove(id);
  }
} 