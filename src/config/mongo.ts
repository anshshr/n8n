import mongoose, { mongo } from "mongoose";
import { appConfig } from "./env.js";
import { UserModel } from "../modules/Auth/auth.model.js";

export default async function connection() {
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

async function mongoTranscationPractice() {
  await connection();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("transcatoin startted");

    for (let i = 0; i < 10; i++) {
      if (i == 5) throw Error("error occured in the transcation");

      await UserModel.create(
        [
          {
            name: "ansh" + Math.random() * 100,
            email: "ansh@gmail.com" + Math.random() * 100,
            password: (Math.random() * 100).toString(),
            isActive: true,
          },
        ],
        { session },
      );

    }
    console.log("transcatoin completed");

    session.commitTransaction();
  } catch (error) {
    console.log("transcatoin aborted");

    session.abortTransaction();
  } finally {
    await session.endSession();
  }
}

mongoTranscationPractice();
