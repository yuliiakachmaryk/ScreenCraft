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
    videoLink: 'https://example.com/video.mp4',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
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
        videoLink: 'https://example.com/video.mp4',
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockEpisode as any);

      const result = await service.create(createEpisodeDto);
      expect(result).toEqual(mockEpisode);
    });
  });

  describe('findAll', () => {
    it('should return an array of episodes with pagination', async () => {
      const episodes = [mockEpisode];
      const page = 1;
      const limit = 10;
      
      mockModel.exec.mockResolvedValueOnce(episodes);
      mockModel.countDocuments = jest.fn().mockReturnThis();
      mockModel.exec.mockResolvedValueOnce(1); // Mock total count

      const result = await service.findAll(page, limit);
      
      expect(result).toEqual({ episodes, total: 1 });
      expect(mockModel.find).toHaveBeenCalled();
      expect(mockModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockModel.skip).toHaveBeenCalledWith(0);
      expect(mockModel.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should return a single episode', async () => {
      mockModel.exec.mockResolvedValueOnce(mockEpisode);

      const result = await service.findOne('test-id');
      expect(result).toEqual(mockEpisode);
      expect(mockModel.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if episode not found', async () => {
      mockModel.exec.mockResolvedValueOnce(null);

      await expect(service.findOne('test-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an episode', async () => {
      const updateEpisodeDto = { name: 'Updated Episode' };
      mockModel.exec.mockResolvedValueOnce({ ...mockEpisode, ...updateEpisodeDto });

      const result = await service.update('test-id', updateEpisodeDto);
      expect(result.name).toBe('Updated Episode');
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith('test-id', updateEpisodeDto, { new: true });
    });

    it('should throw NotFoundException if episode not found', async () => {
      mockModel.exec.mockResolvedValueOnce(null);

      await expect(service.update('test-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an episode', async () => {
      mockModel.exec.mockResolvedValueOnce(mockEpisode);

      const result = await service.remove('test-id');
      expect(result).toEqual(mockEpisode);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if episode not found', async () => {
      mockModel.exec.mockResolvedValueOnce(null);

      await expect(service.remove('test-id')).rejects.toThrow(NotFoundException);
    });
  });
}); 