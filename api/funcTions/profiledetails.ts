import { profiledetailsProps } from "@/typeScript/cms.interface";
import axiosInstance from "../axios/axios";
import { endPoints } from "../endPoints/endPoints";

export const profileDetails = async (): Promise<profiledetailsProps> => {
    try {
      const res = await axiosInstance.get<{ data: profiledetailsProps }>(endPoints.pages.profile);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching profile details:", error);
      throw error; 
    }
  };