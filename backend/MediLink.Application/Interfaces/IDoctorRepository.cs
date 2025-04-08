using MediLink.Domain.Entities;

namespace MediLink.Application.Interfaces
{
    public interface IDoctorRepository
    {
        Task<IEnumerable<Doctor>> GetAllAsync();
        Task<Doctor> GetByIdAsync(int id);
        Task<IEnumerable<Doctor>> GetByIdsAsync(IEnumerable<int> ids);
        Task AddAsync(Doctor doctor);
        Task UpdateAsync(Doctor doctor);
        Task DeleteAsync(int id);
        Task<bool> Exists(string email);
        Task<Doctor?> GetByEmail(string email);
    }
}
