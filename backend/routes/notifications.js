const express = require("express");

const router = express.Router();


const isAuth = require("../middlewares/isAuth");
const notificationsController = require("../controllers/notifications");

router.get("/my", isAuth, notificationsController.getAllMyNotifications);
router.post("/createRequest", isAuth, notificationsController.createNotificationRequest);
router.post('/send',notificationsController.sendNotification);
router.post('/saveFCMToken', isAuth, notificationsController.SaveFCMToken);
router.post('/markAllAsRead',isAuth,notificationsController.markAllAsRead);
router.post('/markAsRead/:id',isAuth,notificationsController.markAsRead);
router.patch('/updateRequestStatus/:id', isAuth, notificationsController.updatedNotificationRequestStatus);
router.delete('/delete/:id', isAuth, notificationsController.deleteNotification);



module.exports = router;