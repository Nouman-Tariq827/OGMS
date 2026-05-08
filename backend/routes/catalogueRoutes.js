import express from 'express'
const router = express.Router()
import {
  getCatalogues,
  getAdminCatalogues,
  getCatalogueById,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  addProductToCatalogue,
  removeProductFromCatalogue,
} from '../controllers/catalogueController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getCatalogues).post(protect, admin, createCatalogue)
router.route('/admin/all').get(protect, admin, getAdminCatalogues)
router
  .route('/:id')
  .get(getCatalogueById)
  .put(protect, admin, updateCatalogue)
  .delete(protect, admin, deleteCatalogue)
router.put('/:id/products/:productId', protect, admin, addProductToCatalogue)
router.delete('/:id/products/:productId', protect, admin, removeProductFromCatalogue)

export default router
