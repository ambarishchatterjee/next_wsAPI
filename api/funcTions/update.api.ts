import { updateProps } from '@/typeScript/cms.interface';
import { MutationFunction } from '@tanstack/react-query';
import axiosInstance from '../axios/axios';
import { endPoints } from '../endPoints/endPoints';



export const updateProductFn: MutationFunction<updateProps> = async (payload) => {
    const res = await axiosInstance.post<updateProps>(endPoints.pages.update,payload);
    return res.data
}



