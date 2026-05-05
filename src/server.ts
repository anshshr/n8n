import app from "./app.js";
import { appConfig } from "./config/env.js";
import connectiom from "./config/mongo.js";

const PORT = appConfig.PORT;

async function bootstrap() {
  await connectiom();

  app.listen(PORT, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Server is running on the PORT ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Server bootstrap failed", error);
  process.exit(1);
});
