"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carepointService } from "@/services/carepoint";

export const usePatientDashboard = () => useQuery({ queryKey: ["patient-dashboard"], queryFn: carepointService.patientDashboard });
export const useProfessionals = (filters: Record<string, unknown>) => useQuery({ queryKey: ["professionals", filters], queryFn: () => carepointService.professionals(filters) });
export const useProfessionalSpecialties = () => useQuery({ queryKey: ["professional-specialties"], queryFn: carepointService.professionalSpecialties, staleTime: 5 * 60 * 1000 });
export const useProfessional = (id: string) => useQuery({ queryKey: ["professional", id], queryFn: () => carepointService.professional(id), enabled: Boolean(id) });
export const useClinics = (filters: Record<string, unknown> = {}) => useQuery({ queryKey: ["clinics", filters], queryFn: () => carepointService.clinics(filters) });
export const useClinic = (id: string) => useQuery({ queryKey: ["clinic", id], queryFn: () => carepointService.clinic(id), enabled: Boolean(id) });
export const useMyRequests = () => useQuery({ queryKey: ["my-requests"], queryFn: carepointService.myRequests });
export const useRequest = (id: string) => useQuery({ queryKey: ["request", id], queryFn: () => carepointService.request(id), enabled: Boolean(id) });
export const useCreateRequest = () => { const client = useQueryClient(); return useMutation({ mutationFn: carepointService.createRequest, onSuccess: () => { void client.invalidateQueries({ queryKey: ["my-requests"] }); void client.invalidateQueries({ queryKey: ["patient-dashboard"] }); } }); };
export const useCancelRequest = () => { const client = useQueryClient(); return useMutation({ mutationFn: carepointService.cancelRequest, onSuccess: () => void client.invalidateQueries({ queryKey: ["my-requests"] }) }); };
export const useAdminDashboard = () => useQuery({ queryKey: ["admin-dashboard"], queryFn: carepointService.adminDashboard });
