const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Event = require("../../models/Event.js");

require("dotenv").config();

const {
  validateRegisterInput,
  validateLoginInput
} = require("../../util/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.SECRET,
    {
      expiresIn: "24h"
    }
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({
          lastName: 1
        });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);

        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", {
          errors
        });
      }

      username = username.toLowerCase();

      const user = await User.findOne({
        username
      });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {
          errors
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", {
          errors
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },

    async register(
      _,
      {
        registerInput: {
          firstName,
          lastName,
          major,
          year,
          graduating,
          country,
          ethnicity,
          sex,
          username,
          email,
          password,
          confirmPassword,
          listServ
        }
      }
    ) {
      const { valid, errors } = validateRegisterInput(
        firstName,
        lastName,
        major,
        year,
        graduating,
        country,
        ethnicity,
        sex,
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", {
          errors
        });
      }

      isUsernameDuplicate = await User.findOne({
        username
      });

      if (isUsernameDuplicate) {
        throw new UserInputError(
          "An account with that username already exists",
          {
            errors: {
              username: "An account with that username already exists"
            }
          }
        );
      }

      isEmailDuplicate = await User.findOne({
        email
      });

      if (isEmailDuplicate) {
        throw new UserInputError("An account with that e-mail already exists", {
          errors: {
            email: "An account with that email already exists"
          }
        });
      }

      username = username.toLowerCase();
      password = await bcrypt.hash(password, 12);
      listServ = listServ === "true" || listServ === true ? true : false;

      const newUser = new User({
        firstName,
        lastName,
        major,
        year,
        graduating,
        country,
        ethnicity,
        sex,
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
        points: 0,
        fallPoints: 0,
        springPoints: 0,
        summerPoints: 0,
        permission: "user",
        listServ,
        events: []
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },

    async redeemPoints(
      _,
      {
        redeemPointsInput: { code, username }
      }
    ) {
      const errors = {};

      if (code.trim() === "") {
        errors.general = "No code was provided";
        throw new UserInputError("No code was provided", {
          errors
        });
      }

      code = code
        .toLowerCase()
        .trim()
        .replace(/ /g, "");

      const event = await Event.findOne({
        code
      });

      const user = await User.findOne({
        username
      });

      user.events.map(userEvent => {
        if (String(userEvent._id) == String(event._id)) {
          errors.general = "Event code already redeemed";
          throw new UserInputError("Event code already redeemed", {
            errors
          });
        }
      });

      if (!event) {
        errors.general = "Event not found";
        throw new UserInputError("Event not found", {
          errors
        });
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {
          errors
        });
      }

      if (Date.parse(event.expiration) < Date.now()) {
        errors.general = "Event code expired";
        throw new UserInputError("Event code expired", {
          errors
        });
      }

      var pointsIncrease = {};

      if (event.semester === "Fall Semester") {
        pointsIncrease = {
          points: event.points,
          fallPoints: event.points
        };
      } else if (event.semester === "Spring Semester") {
        pointsIncrease = {
          points: event.points,
          springPoints: event.points
        };
      } else if (event.semester === "Summer Semester") {
        pointsIncrease = {
          points: event.points,
          summerPoints: event.points
        };
      } else {
        errors.general = "Invalid event";
        throw new UserInputError("Invalid event", {
          errors
        });
      }

      const updatedUser = await User.findOneAndUpdate(
        {
          username
        },
        {
          $push: {
            events: {
              _id: event._id
            }
          },
          $inc: pointsIncrease
        },
        {
          new: true
        }
      );

      await Event.findOneAndUpdate(
        {
          code
        },
        {
          $push: {
            users: {
              _id: user._id
            }
          },
          $inc: {
            attendance: 1
          }
        },
        {
          new: true
        }
      );

      return updatedUser;
    }
  }
};
