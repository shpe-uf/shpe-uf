const { UserInputError } = require("apollo-server");
const Corporation = require("../../models/Corporation.js");
const Request = require("../../models/Request.js");

require("dotenv").config();

const {
  validateCreateEditCorporationInput: validateCreateEditCorporationInput
} = require("../../util/validators");

module.exports = {
  Query: {
    async getCorporations() {
      try {
        const corporations = await Corporation.find().sort({ createdAt: 1 });
        return corporations;
      } catch (err) {
        throw new Error(err);
      }
    }, 
  },
  Mutation: {
    async createCorporation(
      _,
      {
        createCorporationInput: { 
          name,
          logo,
          slogan, 
          majors, 
          industries, 
          overview, 
          mission, 
          goals, 
          businessModel, 
          newsLink,       
          applyLink, 
          academia, 
          govContractor, 
          nonProfit, 
          visaSponsor, 
          shpeSponsor, 
          industryPartnership,
          fallBBQ, 
          springBBQ, 
          nationalConvention 
        }
      }
    ) {

      const { valid, errors } = validateCreateEditCorporationInput(
        name,
        logo,
        slogan,
        majors,
        industries,
        overview,
        mission,
        goals,
        businessModel,
        newsLink,
        applyLink
      );
      
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      isCorporationNameDuplicate = await Corporation.findOne({ name });

      if (isCorporationNameDuplicate) {
        throw new UserInputError("This corporation is already in our database.", {
          errors: {
            name: "This corporation is already in our database."
          }
        });
      }

      academia = academia === "true" || academia === true ? true : false;
      govContractor = govContractor === "true" || govContractor === true ? true : false;
      nonProfit = nonProfit === "true" || nonProfit === true ? true : false;
      visaSponsor = visaSponsor === "true" || visaSponsor === true ? true : false;
      shpeSponsor = shpeSponsor === "true" || shpeSponsor === true ? true : false;
      industryPartnership = industryPartnership === "true" || industryPartnership === true ? true : false;
      fallBBQ = fallBBQ === "true" || fallBBQ === true ? true : false;
      springBBQ = springBBQ === "true" || springBBQ === true ? true : false;
      nationalConvention = nationalConvention === "true" || nationalConvention === true ? true : false;

      const newCorporation = new Corporation({
        name,
        logo,
        slogan,
        majors,
        industries,
        overview,
        mission,
        goals,
        businessModel,
        newsLink,
        applyLink,
        academia, 
        govContractor, 
        nonProfit, 
        visaSponsor, 
        shpeSponsor, 
        industryPartnership,
        fallBBQ, 
        springBBQ, 
        nationalConvention
      });

      await newCorporation.save();

      const corporations = await Corporation.find();

      return corporations;
    },

    async updateCorporation(
      _,
      {
        editCorporationProfileInput: {
          name,
          logo,
          slogan, 
          majors, 
          industries, 
          overview, 
          mission, 
          goals, 
          businessModel, 
          newsLink,       
          applyLink, 
          academia, 
          govContractor, 
          nonProfit, 
          visaSponsor, 
          shpeSponsor, 
          industryPartnership,
          fallBBQ, 
          springBBQ, 
          nationalConvention 
        }
      }
    ){
      console.log("Update Corporation Running")

      const { valid, errors } = validateCreateEditCorporationInput(
        name,
        logo,
        slogan,
        majors,
        industries,
        overview,
        mission,
        goals,
        businessModel,
        newsLink,
        applyLink
      );

      if (!valid) {
        throw new UserInputError("Errors", {errors});
      }

      academia = (academia === "true" || academia === true) ? true : false;
      govContractor = (govContractor === "true" || govContractor === true) ? true : false;
      nonProfit = (nonProfit === "true" || nonProfit === true) ? true : false;
      visaSponsor = (visaSponsor === "true" || visaSponsor === true) ? true : false;
      shpeSponsor = (shpeSponsor === "true" || shpeSponsor === true) ? true : false;
      industryPartnership = (industryPartnership === "true" || industryPartnership === true) ? true : false;
      fallBBQ = (fallBBQ === "true" || fallBBQ === true) ? true : false;
      springBBQ = (springBBQ === "true" || springBBQ === true) ? true : false;
      nationalConvention = (nationalConvention === "true" || nationalConvention === true) ? true : false;
    
      const companyExists = await Corporation.findOne({name});

      if (companyExists) {
        const updatedCorporation = await Corporation.findOneAndUpdate(
          {name},
          {
            name,
            logo,
            slogan,
            majors,
            industries,
            overview,
            mission,
            goals,
            businessModel,
            newsLink,
            applyLink,
            academia, 
            govContractor, 
            nonProfit, 
            visaSponsor, 
            shpeSponsor, 
            industryPartnership,
            fallBBQ, 
            springBBQ, 
            nationalConvention          
          },
          {
            //Returns the updated object, instead of the old one
            new: true
          }
          );
          
        return updatedCorporation;

      } else {
        throw new Error("Company not found.");
      }
    },

    async deleteCorporation(
      _,
      { name }
    ){

      Corporation.deleteOne({ 'name': name }, (err) => {
        if (err){
          console.log(err);
          throw err;
        }
        else 
          return true;
      });
      return false;
    }
  }
};
