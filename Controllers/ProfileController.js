const Profile = require("../Models/ProfileModel.js");
const path = require('path');

/**
 * Method to create a profile
 *
 * @param {*} req
 * @param {*} res
 */
const ProfilePost = async (req, res) => {
    try {
        if (!req.query || !req.query.userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const profile = new Profile({
            name: req.body.name,
            pin: req.body.pin,
            avatar: req.body.avatar,
            age: req.body.age,
            userId: req.query.userId
        });

        const data = await profile.save();
        res.header({ 'location': `/api/profiles/?id=${data.id}` });
        res.status(201).json(data);
    } catch (error) {
        console.error('Error while saving the profile:', error);
        res.status(422).json({ error: 'There was an error saving the profile' });
    }
}

/**
 * Get all profiles for a user or one profile
 *
 * @param {*} req
 * @param {*} res
 */
const ProfileGet = async (req, res) => {
    try {
        // if an specific profile is required
        if (req.query._id) {
            const profile = await Profile.findById(req.query._id);
            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }
            return res.status(200).json(profile);
        } else if (req.query.userId) {
            // get all profile related to a userId
            const profiles = await Profile.find({ userId: req.query.userId });
            if (profiles.length === 0) {
                return res.status(404).json({ error: 'No profiles found for the specified user ID' });
            }
            return res.status(200).json(profiles);
        } else {
            return res.status(400).json({ error: 'Invalid request: neither User ID nor Profile ID provided' });
        }
    } catch (error) {
        console.error('Error while querying profiles:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Updates the data of a profile by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const ProfilePatch = async (req, res) => {
    try {
        if (req.query && req.query._id) {
            const profile = await Profile.findById(req.query._id);

            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            profile.name = req.body.name ?? profile.name;
            profile.pin = req.body.pin ?? profile.pin;
            profile.avatar = req.body.avatar ?? profile.avatar;
            profile.age = req.body.age ?? profile.age;

            const updatedProfile = await profile.save();
            return res.status(200).json(updatedProfile);
        } else {
            return res.status(400).json({ error: "Profile ID not specified" });
        }
    } catch (error) {
        console.error('Error while updating the profile:', error);
        return res.status(422).json({ error: 'There was an error updating the profile' });
    }
}

/**
 * Delete a profile by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const ProfileDelete = async (req, res) => {
    try {
        if (req.query && req.query._id) {
            const profile = await Profile.findById(req.query._id);

            if (!profile) {
                return res.status(404).json({ error: "Profile doesn't exist" });
            }

            await profile.deleteOne({ _id: req.query._id });
            return res.status(204).json({});
        } else {
            return res.status(400).json({ error: "Profile ID not specified" });
        }
    } catch (error) {
        console.error('Error while deleting the profile:', error);
        return res.status(422).json({ error: 'There was an error deleting the profile' });
    }
}

/**
 * Get the json of the avatar
 *
 * @param {*} req
 * @param {*} res
 */
const AvatarGet = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../Models/Data/avatar.json');

        const avatarData = require(filePath);

        return res.status(200).json(avatarData);
    } catch (error) {
        console.error('Error while getting avatar JSON:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Get a profile pin 
 *
 * @param {*} req
 * @param {*} res
 */
const PinGet = async (req, res) => {
    try {
        if (req.query && req.query._id) {
            const profile = await Profile.findById(req.query._id);

            if (!profile) {
                return res.status(404).json({ error: "Profile doesn't exist" });
            }

            if (profile.pin != req.body.pin) {
                return res.status(401).json({ error: 'Incorrect pin' });
            }

            return res.status(200).json(profile);
        } else {
            return res.status(400).json({ error: 'Profile ID is required' });
        }
    } catch (error) {
        console.error('Error while getting profile pin:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    ProfilePost,
    ProfileGet,
    ProfilePatch,
    ProfileDelete,
    AvatarGet,
    PinGet
}