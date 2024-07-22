import AxiosClient from "~/config/axiosClient";

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT_PORTAL as string;

const getProvinces = async () => {
  return await AxiosClient.get(BASE_URL + "/address-location/provinces").then(
    (res) => res.data,
  );
};

const getDistricts = async (province_id: string) => {
  return await AxiosClient.get(
    BASE_URL + `/address-location/districts?provinceId=${province_id}`,
  ).then((res) => res.data);
};

const getWards = async (district_id: string) => {
  return await AxiosClient.get(
    BASE_URL + `/address-location/wards?districtId=${district_id}`,
  ).then((res) => res.data);
};

export { getProvinces, getDistricts, getWards };
