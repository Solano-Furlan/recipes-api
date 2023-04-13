import { HttpServer, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WrapResponseInterceptor } from 'src/common/interceptors/wrap-response/wrap-response.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception/http-exception.filter';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout/timeout.interceptor';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import * as request from 'supertest';

describe('[Feature] Coffees - /coffees', () => {
    const coffee = {
        name: 'Shipwreck Roast',
        brand: 'Buddy Brew',
        flavors: ['chocolate', 'vanilla'],
    };
    const expectedPartialCoffee = expect.objectContaining({ 'brand': 'Buddy Brew', 'description': null, 'flavors': [expect.objectContaining({ 'name': 'chocolate', }), expect.objectContaining({ 'name': 'vanilla', })] });

    let app: INestApplication;
    let httpServer: HttpServer;


    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CoffeesModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5433,
                    username: 'postgres',
                    password: 'pass123',
                    database: 'postgres',
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe(
            {
                whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: {
                    enableImplicitConversion: true,
                }
            }
        ));
        app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimeoutInterceptor(),);
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
        httpServer = app.getHttpServer();
    });

    it('Create [POST /]', async () => {
        return request(httpServer)
            .post('/coffees')
            .send(coffee as CreateCoffeeDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                expect(body['data']).toEqual(expectedPartialCoffee);
            });
    });
    it('Get All [GET /]', async () => {
        return request(httpServer)
            .get('/coffees')
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body['data'].length).toBeGreaterThan(0);
                expect(body['data'][0]).toEqual(expectedPartialCoffee);
            });
    });
    it('Get one [GET /:id]', async () => {
        return request(httpServer)
            .get('/coffees/1')
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body['data']).toEqual(expectedPartialCoffee);
            });
    });
    it('Update one [PATCH /:id]', async () => {
        return request(httpServer)
            .patch('/coffees/1')
            .send(coffee as CreateCoffeeDto).expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body['data']).toEqual(expectedPartialCoffee);
            });
    });
    it('Delete one [DELETE /:id]', () => {
        return request(httpServer)
            .delete('/coffees/1')
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});