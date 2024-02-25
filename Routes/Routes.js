const router = express.Router();

export default router;

/**
 * 
 */
import { UserPost, UserGet } from "../Controllers/UserController.js";

/**
 * Videos
 */
import { VideoPost, VideoGet, VideoPatch, VideoDelete } from "../Controllers/VideoController.js";

/**
 * Profiles
 */
import { ProfilePost, ProfileGet, ProfilePatch, ProfileDelete, AvatarGet } from "../Controllers/ProfileController.js";


/**
 * Listen to the task request
 * 
 * Users
 */
router.get("/users", UserGet);
router.post("/users", UserPost);

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

/**
 * Avatars
 */
router.get("/avatars", AvatarGet);