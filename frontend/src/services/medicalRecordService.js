import apiClient from "../api/apiClient";

//Get medical records visible to the currently logged-in user
export const getMedicalRecords = async ()=>{
    const response = await apiClient.get("/medical-records/");
    return response.data;
};

//Get one medical record 
export const getMedicalRecord = async (recordId)=>{
    const response = await apiClient.get(`/medical-records/${recordId}/`);
    return response.data;
};

// Create a new medical record 
export const createMedicalRecord=async(recordData)=>{
    const response = await apiClient.post(
        "/medical-records/",
        recordData
    );  
    return response.data;
};

// Update an existing medical record
export const updateMedicalRecord = async(
    recordId,
    recordData
)=>{
    const response = await apiClient.patch(`/medical-records/${recordId}/`,
        recordData
    );
    return response.data;
} ;

//Delete a medical record
export const deleteMedicalRecord = async(recordId)=>{
    const response = await apiClient.delete(`/medical-records/${recordId}/`);
    return response.data;
};