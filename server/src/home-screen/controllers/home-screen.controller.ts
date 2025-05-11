import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { HomeScreenService, PaginatedResponse } from '../services/home-screen.service';
import { HomeScreenConfig } from '../schemas/home-screen.schema';

@Controller('home-screen')
export class HomeScreenController {
  constructor(private readonly homeScreenService: HomeScreenService) {}

  @Post()
  create(@Body() createHomeScreenDto: Partial<HomeScreenConfig>) {
    return this.homeScreenService.create(createHomeScreenDto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResponse<HomeScreenConfig>> {
    return this.homeScreenService.findAll(page, limit);
  }

  @Get('active')
  findActive() {
    return this.homeScreenService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeScreenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeScreenDto: Partial<HomeScreenConfig>) {
    return this.homeScreenService.update(id, updateHomeScreenDto);
  }

  @Put(':id/activate')
  setActive(@Param('id') id: string) {
    return this.homeScreenService.setActive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeScreenService.remove(id);
  }

  @Post(':id/content-items/:contentItemId')
  addContentItem(
    @Param('id') id: string,
    @Param('contentItemId') contentItemId: string,
    @Body('section') section: string,
  ) {
    return this.homeScreenService.addContentItem(id, section, contentItemId);
  }

  @Delete(':id/content-items/:contentItemId')
  removeContentItem(
    @Param('id') id: string,
    @Param('contentItemId') contentItemId: string,
    @Body('section') section: string,
  ) {
    return this.homeScreenService.removeContentItem(id, section, contentItemId);
  }
} 