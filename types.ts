export type AppointmentStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Done';

export type Appointment = {
    id: string;
    customer_name: string;
    customer_phone: string;
    image_urls: string[];
    status: AppointmentStatus;
    admin_notes: string;
    created_at: string;
};

export type AnalysisResult = {
    condition: string;
    recommendation: string;
    estimatedEffort: 'Low' | 'Medium' | 'High';
};
