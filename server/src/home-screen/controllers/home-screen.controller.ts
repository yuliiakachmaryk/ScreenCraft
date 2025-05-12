import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
import { HomeScreenService, PaginatedResponse } from '../services/home-screen.service';
import { HomeScreenConfig } from '../schemas/home-screen.schema';

@Controller('home-screens')
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
  async setActive(@Param('id') id: string) {
    try {
      return await this.homeScreenService.setActive(id);
    } catch (error) {
      if (error.message.includes('already active')) {
        throw new HttpException({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
          error: 'Conflict'
        }, HttpStatus.CONFLICT);
      }
      if (error.message.includes('not found')) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to set home screen as active',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeScreenService.remove(id);
  }

  @Post(':id/sections')
  addSection(
    @Param('id') id: string,
    @Body() section: { name: string; order: number; items: any[] }
  ) {
    return this.homeScreenService.addSection(id, section);
  }

  @Patch(':id/sections/:sectionName')
  updateSection(
    @Param('id') id: string,
    @Param('sectionName') sectionName: string,
    @Body() sectionData: { order?: number }
  ) {
    return this.homeScreenService.updateSection(id, sectionName, sectionData);
  }

  @Delete(':id/sections/:sectionName')
  removeSection(
    @Param('id') id: string,
    @Param('sectionName') sectionName: string
  ) {
    return this.homeScreenService.removeSection(id, sectionName);
  }

  @Post(':id/sections/:section/content')
  addContentItem(
    @Param('id') id: string,
    @Param('section') section: string,
    @Body('contentItemId') contentItemId: string
  ) {
    return this.homeScreenService.addContentItem(id, section, contentItemId);
  }

  @Delete(':id/sections/:section/content/:contentItemId')
  removeContentItem(
    @Param('id') id: string,
    @Param('section') section: string,
    @Param('contentItemId') contentItemId: string
  ) {
    return this.homeScreenService.removeContentItem(id, section, contentItemId);
  }
} 