import { Test, TestingModule } from '@nestjs/testing';
import { CookieParserService } from './cookie-parser.service';

describe('CookieParserService', () => {
  let service: CookieParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieParserService],
    }).compile();

    service = module.get<CookieParserService>(CookieParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
