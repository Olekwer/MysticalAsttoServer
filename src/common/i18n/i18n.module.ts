import { Module } from '@nestjs/common';
import { I18nModule as NestI18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { I18nService } from './i18n.service';
import { I18nResolverService } from './i18n-resolver';

@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../../i18n/'),
        watch: true,
      },
      typesOutputPath: join(__dirname, '../../i18n/generated-types.ts'),
      resolvers: [I18nResolverService],
    }),
  ],
  providers: [I18nService, I18nResolverService],
  exports: [I18nService],
})
export class I18nModule {}
