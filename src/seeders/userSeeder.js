const makeConnectionWithDB = require("../config/database");
const mongoose = require("mongoose");
const User = require("../models/user");
const { faker } = require("@faker-js/faker");
const { generateHashData } = require("../utils/common");

const userSeeder = async () => {
  const hashedPassword = await generateHashData("Password@123"); // default password for all users

  try {
    await makeConnectionWithDB();
    const users = [];

    for (let i = 1; i <= 10; i++) {
      const firstName = faker.person.firstName().replace(/[^a-zA-Z]/g, "");
      const lastName = faker.person.lastName().replace(/[^a-zA-Z]/g, "");
      const user = {
        firstName,
        lastName,
        email: faker.internet.email(),
        password: hashedPassword,
        age: faker.number.int({ min: 18, max: 60 }),
        userName: (
          firstName +
          lastName +
          faker.number.int({ min: 10, max: 99 })
        ).toLowerCase(),
        gender: faker.helpers.arrayElement(["Male", "Female", "Others"]),
        about: faker.lorem.sentence({ min: 3, max: 21 }),
        skills: faker.helpers.arrayElements(
          [
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "Ruby",
            "Go",
            "PHP",
            "Swift",
            "Kotlin",
            "TypeScript",
            "HTML",
            "CSS",
            "React",
            "Angular",
            "Vue",
            "Node.js",
            "Django",
            "Flask",
            "Spring Boot",
            "Laravel",
          ],
          faker.number.int({ min: 1, max: 6 })
        ),
        profilePhoto: faker.image.avatar(),
      };

      users.push(user);
    }

    await User.insertMany(users, { ordered: false });

    await mongoose.connection.close(); // close connection gracefully
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

userSeeder();
