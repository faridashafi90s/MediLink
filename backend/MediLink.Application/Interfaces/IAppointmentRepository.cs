using MediLink.Domain.Entities;

namespace MediLink.Application.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<Appointment> GetByIdAsync(int id);
        Task AddAsync(Appointment appointment);
        Task UpdateAsync(Appointment appointment);
        Task DeleteAsync(int id);
        //Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId);
        //Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId);

    }
}
