using MediLink.Domain.Entities;

namespace MediLink.Application.Interfaces
{
    public interface IPatientRepository
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient> GetByIdAsync(int id);
        Task<IEnumerable<Patient>> GetByIdsAsync(IEnumerable<int> ids);
        Task AddAsync(Patient patient);
        Task UpdateAsync(Patient patient);
        Task DeleteAsync(int id);
        Task<bool> Exists(string email);
        Task<Patient?> GetByEmail(string email);
    }
}
