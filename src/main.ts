import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("ToDoList Backend")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("toDoList-API", app, document);
  app.enableCors();
  await app.listen(3333, () => {
    console.log("[INFO] running on port:", 3333);
  });
}
bootstrap();
