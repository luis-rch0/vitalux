"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invalidateRequestQueries } from "@/features/requests/cache";
import { carepointService } from "@/services/carepoint";

export const usePatientDashboard = () =>
  useQuery({ queryKey: ["patient-dashboard"], queryFn: carepointService.patientDashboard });
export const useProfessionals = (filters: import("@/types/requests").SearchFilters) =>
  useQuery({
    queryKey: ["professionals", filters],
    queryFn: () => carepointService.professionals(filters),
  });
export const useProfessionalSpecialties = () =>
  useQuery({
    queryKey: ["professional-specialties"],
    queryFn: carepointService.professionalSpecialties,
    staleTime: 5 * 60 * 1000,
  });
export const useProfessional = (id: string) =>
  useQuery({
    queryKey: ["professional", id],
    queryFn: () => carepointService.professional(id),
    enabled: Boolean(id),
  });
export const useClinics = (filters: import("@/types/requests").SearchFilters = {}) =>
  useQuery({ queryKey: ["clinics", filters], queryFn: () => carepointService.clinics(filters) });
export const useClinic = (id: string) =>
  useQuery({
    queryKey: ["clinic", id],
    queryFn: () => carepointService.clinic(id),
    enabled: Boolean(id),
  });
export const useMyRequests = () =>
  useQuery({ queryKey: ["my-requests"], queryFn: carepointService.myRequests });
export const useRequest = (id: string) =>
  useQuery({
    queryKey: ["request", id],
    queryFn: () => carepointService.request(id),
    enabled: Boolean(id),
  });
export const useCreateRequest = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: carepointService.createRequest,
    onSuccess: () => invalidateRequestQueries(client),
  });
};
export const useCancelRequest = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: carepointService.cancelRequest,
    onSuccess: () => invalidateRequestQueries(client),
  });
};
export const useAdminDashboard = () =>
  useQuery({ queryKey: ["admin-dashboard"], queryFn: carepointService.adminDashboard });
