import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeScreenService, PaginatedResponse } from '../home-screen.service';
import { HomeScreenConfig } from '../../schemas/home-screen.schema';
import { NotFoundException } from '@nestjs/common';

describe('HomeScreenService', () => {
  let service: HomeScreenService;
  let model: Model<HomeScreenConfig>;

  const mockHomeScreenConfig = {
    recomendaciones: [],
    topCharts: [],
    mostTrending: [],
    mostPopular: [],
    isActive: false,
    save: jest.fn(),
  };

  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockModel = {
    create: jest.fn().mockResolvedValue(mockHomeScreenConfig),
    find: jest.fn().mockReturnValue(mockQuery),
    findOne: jest.fn().mockReturnValue(mockQuery),
    findById: jest.fn().mockReturnValue(mockQuery),
    findByIdAndUpdate: jest.fn().mockReturnValue(mockQuery),
    findByIdAndDelete: jest.fn().mockReturnValue(mockQuery),
    updateMany: jest.fn().mockReturnValue(mockQuery),
    countDocuments: jest.fn().mockReturnValue(mockQuery),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeScreenService,
        {
          provide: getModelToken(HomeScreenConfig.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<HomeScreenService>(HomeScreenService);
    model = module.get<Model<HomeScreenConfig>>(getModelToken(HomeScreenConfig.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new home screen configuration', async () => {
      const createHomeScreenDto = {
        recomendaciones: [],
        topCharts: [],
        mostTrending: [],
        mostPopular: [],
        isActive: false,
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockHomeScreenConfig as any);

      const result = await service.create(createHomeScreenDto);
      expect(result).toEqual(mockHomeScreenConfig);
    });
  });

  describe('findAll', () => {
    it('should return a paginated array of home screen configurations', async () => {
      const configs = [mockHomeScreenConfig];
      const total = 1;
      const page = 1;
      const limit = 10;

      mockQuery.exec.mockResolvedValueOnce(configs);
      mockQuery.exec.mockResolvedValueOnce(total);

      const result = await service.findAll(page, limit);
      
      expect(result).toEqual({
        items: configs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
      
      expect(model.find).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ isActive: -1, updatedAt: -1 });
      expect(mockQuery.skip).toHaveBeenCalledWith((page - 1) * limit);
      expect(mockQuery.limit).toHaveBeenCalledWith(limit);
      expect(mockQuery.populate).toHaveBeenCalledTimes(4);
    });
  });

  describe('findOne', () => {
    it('should return a single home screen configuration', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(mockHomeScreenConfig),
      } as any);

      const result = await service.findOne('test-id');
      expect(result).toEqual(mockHomeScreenConfig);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('test-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });
  });

  describe('findActive', () => {
    it('should return the active home screen configuration', async () => {
      const activeConfig = { ...mockHomeScreenConfig, isActive: true };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findOne').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(activeConfig),
      } as any);

      const result = await service.findActive();
      expect(result).toEqual(activeConfig);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException if no active configuration found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findOne').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findActive()).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });
  });

  describe('update', () => {
    it('should update a home screen configuration', async () => {
      const updateHomeScreenDto = { isActive: true };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue({ ...mockHomeScreenConfig, ...updateHomeScreenDto }),
      } as any);

      const result = await service.update('test-id', updateHomeScreenDto);
      expect(result.isActive).toBe(true);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.update('test-id', {})).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });
  });

  describe('setActive', () => {
    it('should set a configuration as active when no other screen is active', async () => {
      const activeConfig = { ...mockHomeScreenConfig, isActive: true };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(model, 'updateMany').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      } as any);
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(activeConfig),
      } as any);

      const result = await service.setActive('test-id');
      expect(result.isActive).toBe(true);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw error if another screen is already active', async () => {
      const existingActiveScreen = { ...mockHomeScreenConfig, _id: 'existing-id', isActive: true };
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingActiveScreen),
      } as any);

      await expect(service.setActive('test-id')).rejects.toThrow('Another home screen is already active');
    });

    it('should allow reactivating the same screen', async () => {
      const activeConfig = { ...mockHomeScreenConfig, _id: 'test-id', isActive: true };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(activeConfig),
      } as any);
      jest.spyOn(model, 'updateMany').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      } as any);
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(activeConfig),
      } as any);

      const result = await service.setActive('test-id');
      expect(result.isActive).toBe(true);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(model, 'updateMany').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      } as any);
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.setActive('test-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });
  });

  describe('remove', () => {
    it('should remove a home screen configuration', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHomeScreenConfig),
      } as any);

      const result = await service.remove('test-id');
      expect(result).toEqual(mockHomeScreenConfig);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('test-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addContentItem', () => {
    it('should add a content item to a section', async () => {
      const updatedConfig = {
        ...mockHomeScreenConfig,
        recomendaciones: ['content-item-id'],
      };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(updatedConfig),
      } as any);

      const result = await service.addContentItem('test-id', 'recomendaciones', 'content-item-id');
      expect(result.recomendaciones).toContain('content-item-id');
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.addContentItem('test-id', 'recomendaciones', 'content-item-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });
  });

  describe('removeContentItem', () => {
    it('should remove a content item from a section', async () => {
      const updatedConfig = {
        ...mockHomeScreenConfig,
        recomendaciones: [],
      };
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(updatedConfig),
      } as any);

      const result = await service.removeContentItem('test-id', 'recomendaciones', 'content-item-id');
      expect(result.recomendaciones).not.toContain('content-item-id');
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.removeContentItem('test-id', 'recomendaciones', 'content-item-id')).rejects.toThrow(NotFoundException);
      expect(mockPopulate).toHaveBeenCalledTimes(4);
    });
  });
}); 