const router = require('express').Router();
const orderController = require('../controllers/order');
const isAuth = require("../middlewares/isAuth");


// router.get('/' , isAuth , orderController.getOrders);
// router.get('/one/:id' , isAuth , orderController.getOrder);
router.post('/checkOut' , isAuth , orderController.checkOutOrder);
// router.post('/checkOut' , isAuth , orderController.checkOut);
// router.put('/update/:id' , isAuth , orderController.updateOrder);
// router.patch('/cancel/:id' , isAuth , orderController.cancelOrder);

module.exports = router;