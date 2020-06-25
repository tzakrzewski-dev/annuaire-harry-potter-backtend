const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    //Company
    company: {
      name: { type: String },
      address: { type: String },
      addressComp: { type: String },
      zip: { type: String },
      city: { type: String },
      phone: { type: String },
      email: { type: String },
      website: { type: String },
      sectorActivity: { type: String },
      descriptionActivity: { type: String },
      brandLogo: { type: String },
      picture: { type: String },
      presentationFile: { type: String },
    },

    //Social
    social: {
      facebookUrl: { type: String },
      instagramUrl: { type: String },
      linkedinUrl: { type: String },
      twitterUrl: { type: String },
      vimeoUrl: { type: String },
    },

    //Contact
    contact: {
      name: { type: String },
      firstname: { type: String },
      function: { type: String },
      citation: { type: String },
      picture: { type: String },
    },

    //Login
    login: {
      emailMember: { type: String, required: true, unique: true },
      passwordMember: { type: String, required: true },
    },

       // paymentType
    paymentType: { type: String },

    // mentions legales
    rgpd: { type: String },
    charte: { type: String },

    //
    resetPassword: { type: String },
    status: { type: String, default: "attente validation" },
    visibility: { type: Boolean, default: false },
    modifyAdherent: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "registeredDate" } }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("adherents", userSchema, "adherent");
