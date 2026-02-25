
import { Profile } from "@/context/ProfileContext";

export const editProfile = async (data: Partial<Profile>) => {
  console.log("Saving profile text data:", data);
  if (!data.email) {
    throw {
      response: {
        data: {
          message: '"email" is not allowed to be empty',
        },
      },
    };
  }
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    status: 200,
    data: { ...data },
  };
};

export const editProfileImg = async (formData: FormData) => {
  console.log("Uploading image...");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    status: 200,
    data: {
      image: `https://picsum.photos/seed/${Date.now()}/200`,
    },
  };
};
 