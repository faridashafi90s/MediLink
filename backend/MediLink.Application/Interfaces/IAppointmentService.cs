using MediLink.Application.DTOs;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDto>> GetAllAsync();
    Task<AppointmentDto> GetByIdAsync(int id);
    Task<AppointmentDto> CreateAsync(AppointmentDto AppointmentDto);
    Task<AppointmentDto> UpdateAsync(int id, AppointmentDto appointmentDto);
    Task DeleteAsync(int id);
    //Task<List<AppointmentDto>> GetAppointmentsByPatientIdAsync(int patientId);
    //Task<List<AppointmentDto>> GetAppointmentsByDoctorIdAsync(int doctorId);

}
