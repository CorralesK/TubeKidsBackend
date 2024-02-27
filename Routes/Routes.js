const express = require('express');
const router = express.Router();

module.exports = router;

/**
 * 
 */
const {
    UserPost, 
    UserGet,
    UserPinGet
} = require("../Controllers/UserController.js");

/**
 * Videos
 */
const {
    VideoPost, 
    VideoGet,
    VideoPatch,
    VideoDelete
} = require("../Controllers/VideoController.js");

/**
 * Profiles
 */
const {
    ProfilePost, 
    ProfileGet,
    ProfilePatch,
    ProfileDelete,
    AvatarGet,
    PinGet
} = require("../Controllers/ProfileController.js");

/**
 * Listen to the task request
 * 
 * Users
 */
//router.get("/users", UserGet);
//router.post("/users", UserPost);
//router.get("/users/pin", UserPinGet);

/**
 * Videos and Playlist
 */
router.get("/videos", VideoGet);
router.post("/videos", VideoPost);
router.patch("/videos", VideoPatch);
router.put("/videos", VideoPatch);
router.delete("/videos", VideoDelete);

/**
 * Profiles
 */
router.get("/profiles", ProfileGet);
router.post("/profiles", ProfilePost);
router.patch("/profiles", ProfilePatch);
router.put("/profiles", ProfilePatch);
router.delete("/profiles", ProfileDelete);

router.get("/profiles/pin", PinGet);

/**
 * Avatars
 */
router.get("/profiles/avatar", AvatarGet);