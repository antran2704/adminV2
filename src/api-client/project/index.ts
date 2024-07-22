import qs from "qs";

import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import {
  ICreateProject,
  ICreateStructure,
  ICreateStructureItem,
  ISearchProject,
  ISearchStructure,
  IStructure,
  IUpdateProject,
} from "~/interface";

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT as string;

const getProjects = async (paramater: ISearchProject) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/projects?${parseParameters}`,
  ).then((res) => res.data);
};

const getProject = async (projectId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}`,
  ).then((res) => res.data);
};

const createProject = async (body: ICreateProject) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/projects",
    body,
  ).then((res) => res.data);
};

const updateProject = async (projectId: string, body: IUpdateProject) => {
  return await AxiosClient.put(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}`,
    body,
  ).then((res) => res.data);
};

const getPresignedUrlProject = async (params: {
  objectName: string;
  projectId: string;
}) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + "/projects/pre-signed-put-url",
    {
      params,
    },
  ).then((res) => res.data);
};

const addDocumentProject = async (projectId: string, document: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}/document/${document}`,
  ).then((res) => res.data);
};

const removeDocumentProject = async (projectId: string, document: string) => {
  return await AxiosClient.delete(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}/document/${document}`,
  ).then((res) => res.data);
};

const activeProject = async (projectId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}/active`,
  ).then((res) => res.data);
};

const disableProject = async (projectId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}/disable`,
  ).then((res) => res.data);
};

const deleteProject = async (projectId: string) => {
  return await AxiosClient.delete(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}`,
  ).then((res) => res.data);
};

const removeImage = async (objectName: string) => {
  return await AxiosClient.delete(
    BASE_URL +
      INTERNAL_PATH +
      `/bucket/delete-data-in-bucket?objectName=${objectName}`,
  ).then((res) => res.data);
};

// create structure
const createProjectStructure = async (
  projectId: string,
  body: ICreateStructure,
) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}/asset-structure`,
    body,
  ).then((res) => res.data);
};

const createUnitOfStructure = async (
  projectId: string,
  body: ICreateStructureItem,
) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + `/projects/${projectId}/asset-structure/units`,
    body,
  ).then((res) => res.data);
};

const getProjectStructure = async (
  projectId: string,
  paramater: ISearchStructure,
) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL +
      INTERNAL_PATH +
      `/projects/${projectId}/asset-structure/units?${parseParameters}`,
  ).then((res) => res.data);
};

const getUnit = async (projectId: string, unitId: string) => {
  return await AxiosClient.get(
    BASE_URL +
      INTERNAL_PATH +
      `/projects/${projectId}/asset-structure/units/${unitId}`,
  ).then((res) => res.data);
};

const updateStructureUnit = async (
  projectId: string,
  unitId: string,
  body: Omit<IStructure, "_id" | "minted">,
) => {
  return await AxiosClient.put(
    BASE_URL +
      INTERNAL_PATH +
      `/projects/${projectId}/asset-structure/units/${unitId}`,
    body,
  ).then((res) => res.data);
};

const deleteStructureUnit = async (projectId: string, unitId: string) => {
  return await AxiosClient.delete(
    BASE_URL +
      INTERNAL_PATH +
      `/projects/${projectId}/asset-structure/units/${unitId}`,
  ).then((res) => res.data);
};

export {
  createProject,
  getProjects,
  getProject,
  updateProject,
  activeProject,
  disableProject,
  addDocumentProject,
  removeDocumentProject,
  getPresignedUrlProject,
  removeImage,
  getProjectStructure,
  getUnit,
  createProjectStructure,
  createUnitOfStructure,
  updateStructureUnit,
  deleteStructureUnit,
  deleteProject,
};
