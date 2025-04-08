using MediLink.Application.Interfaces;
using MediLink.Domain.Entities;
using MediLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Infrastructure.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly AppDbContext _context;

        public PatientRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllAsync() =>
            await _context.Patients.ToListAsync();

        public async Task<Patient> GetByIdAsync(int id) =>
            await _context.Patients.FindAsync(id);

        public async Task<IEnumerable<Patient>> GetByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Patients
                .Where(d => ids.Contains(d.Id))
                .ToListAsync();
        }

        public async Task AddAsync(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Patient patient)
        {
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> Exists(string email) =>
            await _context.Patients.AnyAsync(p => p.Email == email);

        public async Task<Patient?> GetByEmail(string email) =>
            await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);
    }
}
