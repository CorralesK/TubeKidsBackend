const express = require('express');
const router = express.Router();

module.exports = router;

const verifyToken = require('../middleware/authMiddleware.js');

/**
 * Middlewares for body field validations
 */
const {
    validateEmail,
    validateLegalAge,
    validateSixDigitNumber,
    validateVideoUrl
}  = require('../middleware/middlewares.js')

/**
 * Users
 */
const {
    userPost,
    userGet,
    userPinGet
} = require("../controllers/userController.js");

/**
 * Videos
 */
const {
    videoPost, 
    videoGet,
    videoPatch,
    videoDelete
} = require("../controllers/videoController.js");

/**
 * profiles
 */
const {
    profilePost, 
    profileGet,
    profilePatch,
    profileDelete,
    avatarGet,
    pinGet
} = require("../controllers/profileController.js");

/**
 * Listen to the task request
 * 
 * users
 */
router.get("/users", userGet);

router.post("/users",
    validateEmail,
    validateLegalAge,
    validateSixDigitNumber,
    userPost
);
router.get("/users/pin", verifyToken, userPinGet);

/**
 * videos and Playlist
 */
router.get("/videos", verifyToken, videoGet);

router.post("/videos", 
    verifyToken,
    validateVideoUrl,
    videoPost
);

router.patch("/videos", 
    verifyToken, 
    validateVideoUrl,
    videoPatch
);

router.delete("/videos", verifyToken, videoDelete);

/**
 * profiles
 */
router.get("/profiles", verifyToken, profileGet);

router.post("/profiles", 
    verifyToken, 
    validateSixDigitNumber,
    profilePost
);

router.patch("/profiles", 
    verifyToken, 
    validateSixDigitNumber,
    profilePatch
);

router.delete("/profiles", verifyToken, profileDelete);

router.get("/profiles/pin", verifyToken, pinGet);

/**
 * avatars
 */
router.get("/profiles/avatar", verifyToken, avatarGet);