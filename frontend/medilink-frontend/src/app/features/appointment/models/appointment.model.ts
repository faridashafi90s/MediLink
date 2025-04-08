import { AppointmentStatus } from "./appointment-status.enum";

export interface Appointment {
    id: number;
    patientId: number;
    doctorId: number;
    patientName: string;
    doctorName: string;
    appointmentDate: Date;
    status: AppointmentStatus;
}