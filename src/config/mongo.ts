import mongoose from "mongoose";
import { appConfig } from "./env.js";

export default async function connectiom() {
  await mongoose
    .connect(appConfig.DATABASE_URL)
    .then(() => {
      console.log("Database is connected Succesfully");
    })
    .catch((e) => {
      console.log(`Error occured ${e}`);
    })
    .finally(() => {
      console.log("Database Connection Finished");
    });
}
