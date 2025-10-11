// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './module/test.module';
import { FdModule } from './module/fd.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
   envFilePath: [
    join(process.cwd(), '.env'),      
    join(__dirname, '..', '.env'),    
    '.env',                           
  ],
   
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = config.get<string>('DB_PORT');
        const user = config.get<string>('DB_USER');
        const pass = config.get<string>('DB_PASS');
        const name = config.get<string>('DB_NAME');

        console.log('[DB-CONFIG]', { host, port, user, name });

        if (!host || !port || !user || !name) {
          throw new Error('ENV not loaded! Check envFilePath / working dir / .env location');
        }

        return {
          type: 'mysql' as const,
          host,
          port: parseInt(port, 10),
          username: user,
          password: pass,
          database: name,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: config.get('DB_SYNC', 'false') === 'true',
          logging: false,
          retryAttempts: 10,
          retryDelay: 3000,
          charset: 'utf8mb4',
          extra: {
            charset: 'utf8mb4_unicode_ci',
          },
        };
      },
    }),
    TestModule,
    FdModule,
  ],
  

})
export class AppModule {}
