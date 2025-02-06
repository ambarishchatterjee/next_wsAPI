import { updateProductFn } from "./../../api/funcTions/update.api";
import { Cookies } from "react-cookie";
import {
  createProps,
  deleteProps,
  detailsProps,
  profiledetailsProps,
  updateProps,
} from "@/typeScript/cms.interface";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useGlobalHooks } from "../globalHooks/gloBalHooks";
import { createProductFn } from "@/api/funcTions/create.api";
import { deleteProductFn } from "@/api/funcTions/delete.api";
import {
  allProductDetails,
  allProductsAPICall,
} from "@/api/funcTions/list.api";
import { listProps } from "@/typeScript/cms.interface";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { profileDetails } from "@/api/funcTions/profiledetails";

// export const allProductsQuery = (): UseQueryResult<listProps, unknown> => {
//     return useQuery({
//       queryKey: ["LISTPRODUCTS"],
//       queryFn: allProductsAPICall,
//     });
//   };

export const allProductsQuery = (
  page: number,
  perPage: number
): UseQueryResult<listProps, unknown> => {
  return useQuery({
    queryKey: ["LISTPRODUCTS", page, perPage],
    queryFn: () => allProductsAPICall(page, perPage),
    // onSuccess: () => {
    //   toast.success("Products fetched successfully!");
    // },
    // onError: () => {
    //   toast.error("Failed to fetch products. Please try again.");
    // },
  });
};

// export const allProductsQuery = (page: number, perPage: number) => {
//   return useQuery({
//     queryKey: ["PRODUCTS", page, perPage],
//     queryFn: () => allProductsAPICall({ page, perPage }),
//   });
// };

export const fetchProductQuery = (
  id: string | number
): UseQueryResult<detailsProps, unknown> => {
  return useQuery({
    queryKey: ["PRODUCTDETAILS", id],
    queryFn: () => allProductDetails(`${id}`),
  });
};

export const profileDetailsQuery = (): UseQueryResult<
  profiledetailsProps,
  unknown
> => {
  return useQuery({
    queryKey: ["PROFILEDETAILS"],
    queryFn: profileDetails,
  });
};

export const createMutation = (): UseMutationResult<createProps, unknown> => {
  const { queryClient } = useGlobalHooks();
  const cookie = new Cookies();

  return useMutation<createProps, void, unknown, FormData>({
    mutationFn: createProductFn,
    onSuccess: (res) => {
      const { token, status, user } = res || {};

      if (status === 200) {
        toast.success("Product created successfully!");
        if (token) {
          cookie.set("token", token, { path: "/", secure: true });
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        toast.error("Product creation failed. Please try again.");
      }

      queryClient.invalidateQueries({ queryKey: ["CREATE"] });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    },
  });
};

export const deleteMutation = (): UseMutationResult<
  deleteProps,
  unknown,
  unknown
> => {
  const { queryClient } = useGlobalHooks();
  const cookie = new Cookies();

  return useMutation({
    mutationFn: deleteProductFn,
    onSuccess: (res) => {
      const { status, user, token } = res || {};

      if (status === 200) {
        toast.success("Product deleted successfully!");

        if (token) {
          cookie.set("token", token, { path: "/", secure: true });
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        toast.error("Product deletion failed or no status returned.");
      }

      queryClient.invalidateQueries({ queryKey: ["LISTPRODUCTS"] });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    },
  });
};

export const updateMutation = (): UseMutationResult<
  updateProps,
  unknown,
  FormData,
  unknown
> => {
  const { queryClient } = useGlobalHooks();

  return useMutation<updateProps, unknown, FormData>({
    mutationFn: updateProductFn,
    onSuccess: (res) => {
      const { token, status, user } = res || {};

      if (status === 200) {
        toast.success("Product updated successfully!");
      } else {
        toast.error("Product update failed. Please try again.");
      }

      queryClient.invalidateQueries({ queryKey: ["UPDATE"] });
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    },
  });
};