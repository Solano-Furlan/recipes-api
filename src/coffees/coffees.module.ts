import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm/connection/Connection';
import { COFFEE_BRANDS, COFFEE_CONNECTION, COFFEE_FACTORY, } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeeBrandsFactory {
    create() {
        return ['token'];
    }
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event,])],
    controllers: [CoffeesController,],
    providers: [CoffeesService, CoffeeBrandsFactory, {
        provide: COFFEE_BRANDS,
        useValue: process.env.NODE_ENV === 'development' ? ['dev', 'nescafe'] : ['prod']
    },
        {
            provide: COFFEE_FACTORY,
            inject: [CoffeeBrandsFactory],
            useFactory: (coffeeBrandsFactory) => coffeeBrandsFactory.create(),
        },
        {
            provide: COFFEE_CONNECTION,
            // Note "async" here, and Promise/Async event inside the Factory function 
            // Could be a database connection / API call / etc
            // In our case we're just "mocking" this type of event with a Promise
            useFactory: async (connection: Connection): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...');
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
                return coffeeBrands;
            },
            inject: [Connection],
        },

    ],
    exports: [CoffeesService,],
})
export class CoffeesModule { }
