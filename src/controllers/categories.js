import Organization from '../models/Organization';
import Category from '../models/Category';

class CategoriesController {
    static async createCategory (req, res) {
        try {
          const {organizationId} = req.params
          const organization = await Organization.findById(organizationId)
          if(!organization) {
            return res.status(404).json("Organization does not exist");
          }
          const {
            name,
            type, 
            description
          } = req.body
          const category = new Category({name, organization: organizationId, type, description});
          await category.save();
          res.send('Organization category successfully added');
        } catch (error) {
          res.status(500).json(error.message);
        }
      }
    static async getCategories (req, res) {
        try {
          const {organizationId} = req.params
          const organization = await Organization.findById(organizationId)
          if(!organization) {
            return res.status(404).json("Organization does not exist");
          }
          const categories = await Category.find({organization: organizationId})
          res.send(categories);
        } catch (error) {
          console.log(error)
          res.status(500).json(error);
        }
      }
    static async removeCategory (req, res) {
      try {
        const {organizationId, id} = req.params
        const organization = await Organization.findById(organizationId)
        if(!organization) {
          return res.status(404).json("Organization does not exist");
        }
        const category = await Category.find({organization: organizationId, _id:id})
        if(!category) {
          return res.status(404).json("Category does not exist");
        }
        await Category.deleteOne({organization: organizationId, _id:id})
        res.status(204).send();
      } catch (error) {
        console.log(error)
        res.status(500).json(error);
      }
    }
    static async updateCategory (req, res) {
      try {
        await Category.findOneAndUpdate({_id : req.params.id, organization: req.params.organizationId} , req.body)
        res.send("Category Updated Successfully");
      } catch (error) {
        res.status(500).json(error);
      }
    }
}

export default CategoriesController