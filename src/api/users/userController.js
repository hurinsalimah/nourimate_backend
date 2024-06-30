const UserDetail = require('../../models/UserDetail');
const Auth = require('../../models/Auth');
const admin = require('../../config/firebase');

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const [details] = await UserDetail.getUserDetails(userId);
    if (details.length === 0) {
      return res.status(404).send('User details not found');
    }
    res.send(details[0]);
  } catch (error) {
    res
      .status(500)
      .send({message: 'Failed to retrieve user details', error: error.message});
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {dob, height, waistSize, weight, gender, allergen, disease} =
      req.body;

    // Calculate age from dob and store it in the database
    const age = ((dobDate, today) => {
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      const dayDiff = today.getDate() - dobDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      return age;
    })(new Date(dob), new Date());

    // calculate BMI
    const bmi = weight / (height * height);

    await UserDetail.updateUserDetails(
      userId,
      dob,
      height,
      waistSize,
      weight,
      gender,
      allergen,
      disease,
      age,
      bmi,
    );
    res.send({message: 'User details updated successfully'});
  } catch (error) {
    res
      .status(500)
      .send({message: 'Failed to update user details', error: error.message});
  }
};

exports.deleteUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    // get email from database
    const user = await Auth.findUserById(userId);

    // delete in firebase
    await admin.auth().deleteUser(user.email);

    await await UserDetail.deleteUserDetails(userId);

    res.send({message: 'User details deleted successfully'});
  } catch (error) {
    res
      .status(500)
      .send({message: 'Failed to delete user details', error: error.message});
  }
};
