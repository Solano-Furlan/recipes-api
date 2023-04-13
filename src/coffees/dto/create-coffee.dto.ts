import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCoffeeDto {
    @ApiProperty({ description: 'The name of a coffee.', default: 'West Coast' })
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'The brand of a coffee.', default: 'Buddy Coffee' })
    @IsString()
    readonly brand: string;

    @ApiProperty({ description: 'The flavot of a coffee.', default: ['Vanilla', 'Chocolate',] })
    @IsString({ each: true, })
    readonly flavors: string[];
}
