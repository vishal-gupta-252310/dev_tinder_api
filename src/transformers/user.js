const getUserData = (user) => {
  const {
    firstName,
    lastName,
    email,
    age,
    profilePhoto,
    skills,
    about,
    gender,
    userName,
  } = user;

  return {
    firstName,
    lastName,
    email,
    age,
    profilePhoto,
    skills,
    about,
    gender,
    userName,
    fullName: `${firstName} ${lastName}`,
  };
};

export { getUserData };
