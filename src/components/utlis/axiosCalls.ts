import axios from "axios";

export interface IBasicDetails {
  userDetails: innerContent;
}

type innerContent = {
  city: string;
  favoriteWriter: string;
  genres: string[];
  email: string;
};

export const updateUserContent = async (
  freeText: string,
  writingText: string,
  email: string
): Promise<void> => {
  try {
    await axios.post(
      `${process.env.REACT_APP_SERVER_URL}users/update-user-free-content`,
      {
        email,
        freeText,
        writingText,
      }
    );
    console.log("server updated successfully");
  } catch (err) {
    console.log("error in updatind from server ....", err);
  }
  return;
};

export const updateUserBasicDetails = async (
  userDataObject: innerContent
): Promise<void> => {
  try {
    await axios.post(
      `${process.env.REACT_APP_SERVER_URL}users/update-user-basic-details`,
      {
        userDataObject,
      }
    );
    console.log("server updated successfully");
  } catch (err) {
    console.log("error in updatind from server ....", err);
  }
  return;
};
