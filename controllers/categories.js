const Organization = require('../models/Organization');
const Category = require('../models/Category');

class CategoriesController {
    static async createCategory (req, res) {
        try {
          const {id} = req.params
          const organization = await Organization.findById(id)
          if(!organization) {
            res.status(404).json("Organization does not exist");
          }
          const {
            name,
          } = req.body
          const category = new Category({name, organization});
          await category.save();
          res.send('Organization category successfully added');
        } catch (error) {
          res.status(500).json(error);
        }
      }
    static async getCategories (req, res) {
        try {
          const {id} = req.params
          const organization = await Organization.findById(id)
          if(!organization) {
            res.status(404).json("Organization does not exist");
          }
          const categories = await Category.find({organization: id})
          res.send(categories);
        } catch (error) {
          console.log(error)
          res.status(500).json(error);
        }
      }
}

module.exports = CategoriesController