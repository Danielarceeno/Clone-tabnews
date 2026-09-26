import user from "models/user.js";

async function activateUserByUserId(userId) {
  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
    "update:user",
  ]);

  return activatedUser;
}

const activation = {
  activateUserByUserId,
};

export default activation;
