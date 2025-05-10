import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentItemService } from '../content-item.service';
import { ContentItem } from '../../schemas/content-item.schema';
import { NotFoundException } from '@nestjs/common';

describe('ContentItemService', () => {
  let service: ContentItemService;
  let model: Model<ContentItem>;

  const mockContentItem = {
    name: 'Test Content',
    introImage: 'test-image.jpg',
    isExclusive: false,
    category: 'test-category',
    episodes: [],
  };

  const mockModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentItemService,
        {
          provide: getModelToken(ContentItem.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ContentItemService>(ContentItemService);
    model = module.get<Model<ContentItem>>(getModelToken(ContentItem.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new content item', async () => {
      const createContentItemDto = {
        name: 'Test Content',
        introImage: 'test-image.jpg',
        isExclusive: false,
        category: 'test-category',
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockContentItem as any);

      const result = await service.create(createContentItemDto);
      expect(result).toEqual(mockContentItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of content items', async () => {
      const contentItems = [mockContentItem];
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'find').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(contentItems),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(contentItems);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single content item', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(mockContentItem),
      } as any);

      const result = await service.findOne('test-id');
      expect(result).toEqual(mockContentItem);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if content item not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('test-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a content item', async () => {
      const updateContentItemDto = { name: 'Updated Content' };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue({ ...mockContentItem, ...updateContentItemDto }),
      } as any);

      const result = await service.update('test-id', updateContentItemDto);
      expect(result.name).toBe('Updated Content');
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if content item not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.update('test-id', {})).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a content item', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockContentItem),
      } as any);

      const result = await service.remove('test-id');
      expect(result).toEqual(mockContentItem);
    });

    it('should throw NotFoundException if content item not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('test-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addEpisode', () => {
    it('should add an episode to a content item', async () => {
      const updatedContentItem = { ...mockContentItem, episodes: ['episode-id'] };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(updatedContentItem),
      } as any);

      const result = await service.addEpisode('test-id', 'episode-id');
      expect(result.episodes).toContain('episode-id');
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if content item not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.addEpisode('test-id', 'episode-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEpisode', () => {
    it('should remove an episode from a content item', async () => {
      const updatedContentItem = { ...mockContentItem, episodes: [] };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(updatedContentItem),
      } as any);

      const result = await service.removeEpisode('test-id', 'episode-id');
      expect(result.episodes).not.toContain('episode-id');
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if content item not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.removeEpisode('test-id', 'episode-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
    });
  });
}); 