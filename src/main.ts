import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { readFileSync } from "fs";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync("./secrets/cert.key"),
    cert: readFileSync("./secrets/cert.crt"),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle("ToDoList Backend")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("toDoList-API", app, document);
  app.enableCors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });
  await app.listen(3333, () => {
    console.log("[INFO] running on port:", 3333);
  });
}
bootstrap();
