import { Endpoint, EndpointInfo } from "@/types/endpoint";
import ApiService from "./api_service";

export async function getEndpoints(projectId: string): Promise<Endpoint[]> {
  console.log("Fetching endpoints for project:", projectId);
  const res = await ApiService.get(`/projects/${projectId}/endpoints`);
  return res.data;
}

export async function deleteEndpoint(projectId: string, endpointId: string) {
  const res = await ApiService.delete(`/projects/${projectId}/endpoints/${endpointId}`);
  return res.data;
}

export async function getEndpointById(projectId: string, endpointId: string): Promise<Endpoint> {
  const res = await ApiService.get(`/projects/${projectId}/endpoints/${endpointId}`);
  return res.data;
}

export async function createEndpoint(projectId: string, endpoint: EndpointInfo) {
  const res = await ApiService.post(`/projects/${projectId}/endpoints`, endpoint);
  return res.data;
}
export async function updateEndpoint(projectId: string, endpointId: string, endpoint: EndpointInfo) {
  const res = await ApiService.put(`/projects/${projectId}/endpoints/${endpointId}`, endpoint);
  return res.data;
}


export const updateEndpointSchema = async (projectId: string, endpointId: string, data: Partial<Endpoint>): Promise<Endpoint> => {
    try {
        const response = await ApiService.put(`/projects/${projectId}/endpoints/${endpointId}`, data);
        return response.data;
    } catch (error) {
        console.error(`Failed to update endpoint ${endpointId}:`, error);
        throw error;
    }
};
