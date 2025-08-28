import {Module} from "@nestjs/common"
import { HelloController } from "./hello"

@Module({
    controllers:[HelloController],
})

export class HelloModule {}