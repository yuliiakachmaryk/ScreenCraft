import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ContentItemService } from '../services/content-item.service';
import { ContentItem } from '../schemas/content-item.schema';

@Controller('content-items')
export class ContentItemController {
  constructor(private readonly contentItemService: ContentItemService) {}

  @Post()
  create(@Body() createContentItemDto: Partial<ContentItem>) {
    return this.contentItemService.create(createContentItemDto);
  }

  @Get()
  findAll() {
    return this.contentItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentItemDto: Partial<ContentItem>) {
    return this.contentItemService.update(id, updateContentItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentItemService.remove(id);
  }

  @Put(':id/episodes/:episodeId')
  addEpisode(@Param('id') id: string, @Param('episodeId') episodeId: string) {
    return this.contentItemService.addEpisode(id, episodeId);
  }

  @Delete(':id/episodes/:episodeId')
  removeEpisode(@Param('id') id: string, @Param('episodeId') episodeId: string) {
    return this.contentItemService.removeEpisode(id, episodeId);
  }
} 