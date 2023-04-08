import { Coffee } from "src/coffees/entities/coffee.entity";
import { Flavor } from "src/coffees/entities/flavor.entity";
import { CoffeeRefactor1680888346249 } from "src/migrations/1680888346249-CoffeeRefactor";
import { SchemaSync1680888502045 } from "src/migrations/1680888502045-SchemaSync";
import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: [Coffee, Flavor,],
    migrations: [CoffeeRefactor1680888346249, SchemaSync1680888502045,],
});