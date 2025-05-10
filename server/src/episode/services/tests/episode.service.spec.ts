import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EpisodeService } from '../episode.service';
import { Episode } from '../../schemas/episode.schema';
import { NotFoundException } from '@nestjs/common';

describe('EpisodeService', () => {
  let service: EpisodeService;
  let model: Model<Episode>;

  const mockEpisode = {
    name: 'Test Episode',
    isExclusive: false,
    likesNumber: 0,
    reviewed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
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
        EpisodeService,
        {
          provide: getModelToken(Episode.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<EpisodeService>(EpisodeService);
    model = module.get<Model<Episode>>(getModelToken(Episode.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new episode', async () => {
      const createEpisodeDto = {
        name: 'Test Episode',
        isExclusive: false,
        likesNumber: 0,
        reviewed: false,
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockEpisode as any);

      const result = await service.create(createEpisodeDto);
      expect(result).toEqual(mockEpisode);
    });
  });

  describe('findAll', () => {
    it('should return an array of episodes', async () => {
      const episodes = [mockEpisode];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(episodes),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(episodes);
    });
  });

  describe('findOne', () => {
    it('should return a single episode', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEpisode),
      } as any);

      const result = await service.findOne('test-id');
      expect(result).toEqual(mockEpisode);
    });

    it('should throw NotFoundException if episode not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('test-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an episode', async () => {
      const updateEpisodeDto = { name: 'Updated Episode' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockEpisode, ...updateEpisodeDto }),
      } as any);

      const result = await service.update('test-id', updateEpisodeDto);
      expect(result.name).toBe('Updated Episode');
    });

    it('should throw NotFoundException if episode not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.update('test-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an episode', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEpisode),
      } as any);

      const result = await service.remove('test-id');
      expect(result).toEqual(mockEpisode);
    });

    it('should throw NotFoundException if episode not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('test-id')).rejects.toThrow(NotFoundException);
    });
  });
}); 